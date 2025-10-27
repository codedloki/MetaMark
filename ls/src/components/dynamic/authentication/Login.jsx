import { useState } from "react";
import { ethers } from "ethers";

export default function Login() {
  const [account, setAccount] = useState(null);
  const dappUrl = "192.168.143.231:3000"; // Change to your actual deployed domain or IP

  const isMobile = () =>
    /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else if (isMobile()) {
      // Redirect to MetaMask app
      window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };
  
  return (
    <div className="h-[150vh] md:h-auto md:min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <header className="w-full max-w-sm mb-6 text-center items-center justify-between">
        <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnhmeXU1N2pkOHI4MzBjb2k1bTJrMGg1NXBmN2FrYW5jOHkzMjNzYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/E6yGVSaVoxIGnEiaEJ/giphy.gif" width="20%" height={80} />
        <h1 className="text-3xl font-bold text-blue-600 mb-2">MetaMark</h1>
        
      </header>

      <div className="bg-white md:bg-linear-65 from-blue-500 to-sky-500 w-full max-w-sm p-6 rounded-2xl text-center hover:cursor-pointer" onClick={connectWallet} >
        {!account ? (
          <p>
            Connect Wallet
          </p>
        
        ) : (
          <>
            <p className="text-green-600 font-medium mb-2">Wallet Connected ✅</p>
            <div className="bg-gray-100 text-xs text-gray-800 break-all p-2 rounded-lg">
              {account}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
