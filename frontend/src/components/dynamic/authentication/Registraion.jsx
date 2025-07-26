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

  const contractAddress = "0x33913593B9ff141CC27a28A532d98CA49F00F99B";
  const dappUrl = 'your-dapp.vercel.app';

  const isMobile = () => /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🧠 Reset company if switching from manufacturer to customer
    if (name === 'userType' && value === 'customer') {
      setFormData({ ...formData, userType: value, company: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const account = ethers.getAddress(accounts[0]);
        setFormData((prev) => ({ ...prev, account }));

        SuccessToast?.(`Wallet Connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
      } catch (err) {
        console.error('Wallet connection failed:', err);
        ErrorToast?.('Wallet connection failed');
      }
    } else {
      ErrorToast?.('MetaMask not detected');
      window.open(`https://metamask.app.link/dapp/${dappUrl}`, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.account) {
      ErrorToast?.('Please connect your wallet first');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MetamarkAbi, signer);

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
        
        const tx = await contract.registerCustomer(formData.name)
        await tx.wait()
        SuccessToast?.('Customer registration logic goes here! 🧑‍💼');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      ErrorToast?.('Registration failed ❌');
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
    </div>
  );
}

export default Registration;
