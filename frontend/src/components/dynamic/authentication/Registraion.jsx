import React, { useState } from 'react';
import { ethers } from 'ethers';
import MetamarkAbi from '../../../abi/Metamark.json';

function Registration({ SuccessToast, ErrorToast }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    userType: '',
    account: '',
  });

  // NEW: state for error popup
  const [errorPopup, setErrorPopup] = useState({ visible: false, message: '' });

  const contractAddress = import.meta.env.VITE_REGISTRY_CONTRACT
  const dappUrl = 'your-dapp.vercel.app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userType' && value === 'customer') {
      setFormData({ ...formData, userType: value, company: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        console.log("contract loaded :", import.meta.env.VITE_REGISTRY_CONTRACT)

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = ethers.getAddress(accounts[0]);
        setFormData((prev) => ({ ...prev, account }));
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

  // helper to show popup
  const showErrorPopup = (msg) => {
    setErrorPopup({ visible: true, message: msg });
  };

  const closeErrorPopup = () => {
    setErrorPopup({ visible: false, message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.account) {
      showErrorPopup('Please connect your wallet first');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(import.meta.env.VITE_REGISTRY_CONTRACT, MetamarkAbi, signer);

      if (formData.userType === 'manufacturer') {
        const tx = await contract.registerManufacturer(
          formData.name,
          formData.company,
          {
            value: ethers.parseEther("10")
          }
        );
        await tx.wait();
        SuccessToast?.('Manufacturer registered successfully! 🏭');
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
    <div className="mt-[35vh] md:mt-[-30vh] md:min-h-screen flex flex-col items-center justify-center">
      <header className="w-full max-w-sm mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Register</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl shadow-md space-y-5 text-white"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Company - Only show for Manufacturer */}
        {formData.userType === 'manufacturer' && (
          <div>
            <label className="block mb-1 font-medium">Company Name:</label>
            <input
              type="text"
              name="company"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Radio Group */}
        <div>
          <label className="block mb-2 font-medium">Account Type:</label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="userType"
                value="manufacturer"
                className='text-black bg-white'
                checked={formData.userType === 'manufacturer'}
                onChange={handleChange}
                required
              />
              <span>Manufacturer</span>
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
              <span>Customer</span>
            </label>
          </div>
        </div>

        {/* Wallet Connect */}
        <div className="w-full text-center">
          {!formData.account ? (
            <button
              type="button"
              onClick={connectWallet}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <p className="text-sm text-green-500 text-center">
              Wallet Connected: {formData.account.slice(0, 6)}...{formData.account.slice(-4)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="w-full text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Submit Registration
          </button>
        </div>
      </form>

      {/* ERROR POPUP */}
      {errorPopup.visible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={closeErrorPopup}
        >
          <div
            className="bg-red-600 rounded-lg p-6 max-w-sm text-white shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent modal close on clicking inside box
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
  );
}

export default Registration;
