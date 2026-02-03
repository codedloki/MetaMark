import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, ethers } from "ethers"; // ethers added
import { useConnect } from "./ConnectProvider.jsx";
import RegistryABI from "../../abi/Registry.json";
import ProductABI from '../../abi/Product.json';
import { sign } from "viem/accounts";

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { isConnected, walletAddress } = useConnect();
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [registry, setRegistry] = useState(null);
  const [product, setProduct] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ RPC URL from your WalletProvider (Alchemy)
  const AMOY_RPC = "https://polygon-amoy.g.alchemy.com/v2/HUuUwdt83uUOmUB4v5gA4";

  useEffect(() => {
    const init = async () => {
      try {
        let activeProvider;
        let activeSigner = null;

        // 🛡️ Logic Change: Wallet check ke saath Fallback support
        if (window.ethereum && isConnected && walletAddress) {
          // Desktop/Wallet Browser Flow
          activeProvider = new BrowserProvider(window.ethereum);
          activeSigner = await activeProvider.getSigner();
          console.log("MetaMark: Connected via Wallet");
        } else {
          // ✅ Mobile/Consumer Flow: Public RPC Fallback
          // Isse 'product' hamesha available rahega null nahi hoga
          activeProvider = new JsonRpcProvider(AMOY_RPC);
          console.log("MetaMark: Connected via Public RPC (Consumer Mode)");
        }

        // Contracts Setup (Using Signer if available, else Provider for Read-only)
        const target = activeSigner || activeProvider;

        const registryInstance = new Contract(
          import.meta.env.VITE_REGISTRY_ADDRESS,
          RegistryABI,
          activeSigner

        );

        const productInstance = new Contract(
          import.meta.env.VITE_PRODUCT_ADDRESS,
          ProductABI,
          activeSigner
        );

        setProvider(activeProvider);
        setSigner(activeSigner);
        setRegistry(registryInstance);
        setProduct(productInstance);

        // Background Role Fetch (Only if walletAddress exists)
        if (walletAddress) {
          registryInstance.getRole(walletAddress)
            .then(r => setRole(Number(r)))
            .catch(e => console.error("Role fetch error:", e));
        }

      } catch (err) {
        console.error("UserProvider init error:", err);
      }
    };

    init();
  }, [isConnected, walletAddress]);

  return (
    <UserContext.Provider value={{ provider, registry, product, role, signer }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};