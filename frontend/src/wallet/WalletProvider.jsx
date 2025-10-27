import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defineChain } from "@reown/appkit/networks";

// ✅ Define Ganache as a wagmi-compatible chain
const ganacheNetwork = defineChain({
  id: 1337, // or 5777 depending on Ganache setup
  name: "Ganache Localhost",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
    },
    public: {
      http: ["http://127.0.0.1:7545"],
    },
  },
});

const queryClient = new QueryClient();

// ✅ Use getDefaultConfig properly
const config = getDefaultConfig({
  appName: "MetaMark",
  projectId: "9f1273f2687d93fc7c55a5907b665018", // required for WalletConnect
  chains: [ganacheNetwork, mainnet, polygon,sepolia ],
  transports: {
    
    [ganacheNetwork.id]: http("http://127.0.0.1:7545"),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
    
  },
});

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          chains={[ganacheNetwork, mainnet, polygon, sepolia]} // ✅ Add here too
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
