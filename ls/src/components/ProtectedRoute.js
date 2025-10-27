// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

const ProtectedRoute = ({ children }) => {
  const { walletAddress } = useWallet();

  if (!walletAddress) {
    return <Navigate to="/connect-wallet" replace />;
  }

  return children;
};

export default ProtectedRoute;
