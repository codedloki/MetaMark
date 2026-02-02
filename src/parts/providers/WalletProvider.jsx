import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
// ✅ polygonAmoy ko yahan add kiya hai
import { mainnet, polygon, polygonAmoy } from "wagmi/chains"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// ✅ RainbowKit config update
// ... existing imports
const config = getDefaultConfig({
  appName: "MetaMark",
  projectId: "9f1273f2687d93fc7c55a5907b665018",
  chains: [polygonAmoy], // Production mein yahan mainnet add karna
  transports: {
    [polygonAmoy.id]: http("https://polygon-amoy.g.alchemy.com/v2/HUuUwdt83uUOmUB4v5gA4"), // Reliable public RPC
  },
});

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          // ✅ Yahan bhi chains list update kar di hai
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}