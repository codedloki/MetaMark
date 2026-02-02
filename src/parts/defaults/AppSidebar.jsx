import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "../../components/ui/sidebar"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { BrowserProvider } from "ethers"
import { Home, Play } from "lucide-react"


import { useConnect } from "../providers/ConnectProvider.jsx"
import { useUser } from "../providers/UsersProvider.jsx"

import ConnectedW from "../body/dynamic/wallet/ConnectedW.jsx"

export default function AppSidebar() {
  const { walletAddress, isConnected, disconnectWallet } = useConnect()
  
  const { provider, registry, role } = useUser()

  const [account, setAccount] = useState()
  const [network, setNetwork] = useState()
  const [signer, setSigner] = useState()

  // ✅ wallet check on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return

      const provider = new BrowserProvider(window.ethereum)

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setSigner(await provider.getSigner())
          localStorage.setItem("account", accounts[0])
        }

        const net = await window.ethereum.request({
          method: "net_version",
        })
        setNetwork(net)
      } catch (err) {
        console.error("Wallet check failed:", err)
      }
    }

    checkConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum)
          setAccount(accounts[0])
          setSigner(await provider.getSigner())
          localStorage.setItem("account", accounts[0])
        } else {
          disconnectWallet()
        }
      })

      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {})
        window.ethereum.removeListener("chainChanged", () => {})
      }
    }
  }, [disconnectWallet])

  return (
    <Sidebar>
      <SidebarHeader className="text-white text-3xl font-bold flex items-center justify-center h-16">
        MetaMark
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="space-y-2 p-3">
          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] rounded-lg">
            <Link to="/" className="flex items-center">
              <Home className="mr-2" />
              HOME
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] rounded-lg">
            <Link to="/about" className="flex items-center">
              <Home className="mr-2" />
              ABOUT US
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] rounded-lg">
            <Link to="/get-started" className="flex items-center">
              <Play className="mr-2" />
              GET STARTED
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mb-10 text-center">
        {isConnected ? (
          <ConnectedW />
        ) : (
          <ConnectButton showBalance={false} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
