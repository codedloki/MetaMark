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
  const [loading, setLoading] = useState(true); // Added loading state

  const AMOY_RPC = "https://rpc-amoy.polygon.technology";

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let activeProvider;
        let activeSigner = null;

        if (window.ethereum && isConnected && walletAddress) {
          activeProvider = new BrowserProvider(window.ethereum);
          activeSigner = await activeProvider.getSigner();
        } else {
          activeProvider = new JsonRpcProvider(AMOY_RPC);
        }

        const target = activeSigner || activeProvider;

        const registryInstance = new Contract(
          import.meta.env.VITE_REGISTRY_ADDRESS,
          RegistryABI,
          target
        );

        const productInstance = new Contract(
          import.meta.env.VITE_PRODUCT_ADDRESS,
          ProductABI,
          target
        );

        setProvider(activeProvider);
        setSigner(activeSigner);
        setRegistry(registryInstance);
        setProduct(productInstance);
        console.log(walletAddress)
        if (walletAddress) {
          const r = await registryInstance.getRole(walletAddress);
          setRole(Number(r));
          console.log("Detected r :",r)
        } else {
          setRole(0); 
        }

      } catch (err) {
        console.error("UserProvider init error:", err);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    init();
  }, [isConnected, walletAddress]);

  return (
    <UserContext.Provider value={{ provider, registry, product, role, signer, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};