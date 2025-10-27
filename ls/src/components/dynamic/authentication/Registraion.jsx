import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MetamarkAbi from '../../../abi/Metamark.json';

function Registration({ SuccessToast, ErrorToast }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    userType: '',
    account: '',
  });
  const [errorPopup, setErrorPopup] = useState({ visible: false, message: '' });
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = import.meta.env.VITE_REGISTRY_CONTRACT;
  const dappUrl = 'your-dapp.vercel.app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userType' && value === 'customer') {
      setFormData({ ...formData, userType: value, company: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const showErrorPopup = (msg) => {
    setErrorPopup({ visible: true, message: msg });
  };

  const closeErrorPopup = () => {
    setErrorPopup({ visible: false, message: '' });
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0]);
        setFormData((prev) => ({ ...prev, account }));

        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);

        const signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, MetamarkAbi, signer);
        setContract(_contract);

        SuccessToast?.(`Wallet Connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
      } catch (err) {
        console.error('Wallet connection failed:', err);
        showErrorPopup('Wallet connection failed');
      }
    } else {
      showErrorPopup('MetaMask not detected');
      window.open(`https://metamask.app.link/dapp/${dappUrl}`, '_blank');
    }
  };

  useEffect(() => {
    if (!contract) return;

    const handler = (wallet, name, companyName, stake) => {
      console.log('📢 Live ManufacturerRegistered event:', { wallet, name, companyName, stake });
      SuccessToast?.(`Manufacturer registered: ${name}`);
    };

    contract.on('ManufacturerRegistered', handler);

    return () => {
      contract.off('ManufacturerRegistered', handler);
    };
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.account) {
      showErrorPopup('Please connect your wallet first');
      return;
    }

    try {
      const signer = await provider.getSigner();

      if (formData.userType === 'manufacturer') {
        const tx = await contract.registerManufacturer(
          formData.name,
          formData.company,
          { value: ethers.parseEther('10') }
        );

        const receipt = await tx.wait();

        const event = receipt.logs
          .map(log => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .filter(e => e && e.name === 'ManufacturerRegistered')[0];

        if (event) {
          SuccessToast?.('Manufacturer registered successfully! 🏭');
        }
      } else {
        const tx = await contract.registerCustomer(formData.name);
        await tx.wait();
        SuccessToast?.('Customer registered successfully! 🧑‍💼');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      showErrorPopup('Registration failed ❌');
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen">
      <div className="bg-gray-900 bg-opacity-95 rounded-xl shadow-lg w-full max-w-md p-6 relative overflow-y-auto">
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500">Register</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-white">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-500 rounded-lg text-black"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {formData.userType === 'manufacturer' && (
            <div>
              <label className="block mb-1 font-medium text-white">Company Name:</label>
              <input
                type="text"
                name="company"
                className="w-full px-3 py-2 border border-gray-500 rounded-lg text-black"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-white">Account Type:</label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="userType"
                  value="manufacturer"
                  checked={formData.userType === 'manufacturer'}
                  onChange={handleChange}
                  required
                />
                <span className="text-white">Manufacturer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleChange}
                  required
                />
                <span className="text-white">Customer</span>
              </label>
            </div>
          </div>

          <div className="text-center">
            {!formData.account ? (
              <button
                type="button"
                onClick={connectWallet}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-500 transition"
              >
                Connect Wallet
              </button>
            ) : (
              <p className="text-sm text-green-500">
                Wallet Connected: {formData.account.slice(0, 6)}...{formData.account.slice(-4)}
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-500 transition"
            >
              Submit Registration
            </button>
          </div>
        </form>

        {errorPopup.visible && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4"
            onClick={closeErrorPopup}
          >
            <div
              className="bg-red-600 rounded-lg p-6 max-w-sm w-full text-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Error</h2>
              <p className="mb-6">{errorPopup.message}</p>
              <button
                onClick={closeErrorPopup}
                className="bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Registration;
