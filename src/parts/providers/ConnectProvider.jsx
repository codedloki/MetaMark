import { createContext, useContext, useEffect, useState } from "react";

const ConnectContext = createContext(null);

export default function ConnectProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // CamelCase use kiya (Standard)

  const connectwallet = async () => {
    try {
      // Mobile check: Browser mein ethereum inject hua hai ya nahi
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } else {
        alert('Bhai, Wallet nahi mila! Agar mobile par ho toh MetaMask/Rainbow app ka browser use karo.');
      }
    } catch (error) {
      console.error("Wallet Connection error:", error);
    }
  };

  useEffect(() => {
    // ✅ CRITICAL FIX: Pehle check karo window.ethereum hai ya nahi
    const hasEthereum = typeof window !== "undefined" && !!window.ethereum;

    if (!hasEthereum) {
      console.log("ConnectProvider: No provider detected (Normal for mobile browsers)");
      return; 
    }

    const checkconnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Check connection error:", err);
      }
    };

    checkconnection();

    const handleAccountChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setWalletAddress(null);
        setIsConnected(false);
      } else {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = () => window.location.reload();

    // Event Listeners
    window.ethereum.on('accountsChanged', handleAccountChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      // Cleanup with Optional Chaining
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <ConnectContext.Provider value={{ walletAddress, isConnected, connectwallet }}>
      {children}
    </ConnectContext.Provider>
  );
}

export const useConnect = () => {
  const context = useContext(ConnectContext);
  if (!context) throw new Error("useConnect must be used inside ConnectProvider");
  return context;
};