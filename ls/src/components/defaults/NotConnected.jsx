import React from "react";

export default function NotConnected({ connectWallet }) {
  return (
    <div className="p-4 flex flex-col items-center">
      <p className="text-gray-300 mb-2">Wallet not connected</p>
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>
    </div>
  );
}
