// context/WalletContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("MetaMask not detected.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null); // Just resetting on frontend side
  };

  useEffect(() => {
    const checkConnected = async () => {
      const accounts = await window.ethereum?.request({
        method: "eth_accounts",
      });
      if (accounts?.length > 0) {
        setWalletAddress(accounts[0]);
      }
    };

    checkConnected();

    // Auto update on account switch
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress(null);
      }
    });
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
