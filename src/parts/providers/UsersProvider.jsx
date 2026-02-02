import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { useConnect } from "./ConnectProvider.jsx";
import RegistryABI from "../../abi/Registry.json";
import ProductABI from '../../abi/Product.json';

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { isConnected, walletAddress } = useConnect();
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [registry, setRegistry] = useState(null);
  const [product, setProduct] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Mobile Check: Agar window.ethereum nahi hai toh 
    // thoda wait karke dobara check karna chahiye
    const init = async () => {
      console.log("Checking Connection States:", { isConnected, walletAddress, hasEthereum: !!window.ethereum });

      if (!isConnected || !walletAddress || !window.ethereum) {
        console.log("Waiting for wallet connection...");
        return;
      }

      try {
        const browserProvider = new BrowserProvider(window.ethereum);
        const userSigner = await browserProvider.getSigner();
        
        // Contracts Setup
        const registryInstance = new Contract(
          import.meta.env.VITE_REGISTRY_ADDRESS,
          RegistryABI,
          userSigner
        );

        const productInstance = new Contract(
          import.meta.env.VITE_PRODUCT_ADDRESS,
          ProductABI,
          userSigner
        );

        // ✅ Immediate State Update (Registration page ko yehi chahiye)
        setProvider(browserProvider);
        setSigner(userSigner);
        setRegistry(registryInstance);
        setProduct(productInstance);

        console.log("Contracts Initialized. Fetching role in background...");

        // Role fetch ko 'await' mat karo, background mein hone do
        registryInstance.getRole(walletAddress)
          .then(r => setRole(Number(r)))
          .catch(e => console.error("Role fetch error:", e));

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