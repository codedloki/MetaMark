import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useConnect } from "./ConnectProvider.jsx";
import RegistryABI from "../../abi/Registry.json";
import Productabu from '../../abi/Product.json'

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { isConnected,walletAddress } = useConnect();

  const [provider, setProvider] = useState(null);
  const [registry, setRegistry] = useState(null);
  const [product,setproduct] = useState(null)
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!isConnected || !window.ethereum) return;

    const init = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log("Registry address:",import.meta.env.VITE_REGISTRY_ADDRESS)
        const registry = new Contract(
          import.meta.env.VITE_REGISTRY_ADDRESS,
          RegistryABI,
          signer
        );

        const producti = new Contract(
          import.meta.env.VITE_PRODUCT_ADDRESS,
          Productabu,
          signer

        )

        setproduct(producti)
        const role = await registry.getRole();
        

        setProvider(provider);
        setRegistry(registry);
        setRole(Number(role)); // enum → number
        console.log(role)
      } catch (err) {
        console.error("UserProvider error:", err);
      }
    };

    init();
  }, [isConnected]);

  return (
    <UserContext.Provider
      value={{
        provider,
        registry,
        product,
        role,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
