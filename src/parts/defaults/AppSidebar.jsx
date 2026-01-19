 import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarHeader,
} from "../../components/ui/sidebar"
import { useState,useEffect } from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../components/ui/collapsible"

import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem } from '../../components/ui/dropdown-menu'

import {
  Home,
  Play,
  Terminal,
  Waypoints,
  MonitorSmartphone,
  AppWindow,
  ShieldCheck,
  Radar,
  Map,
  ScanSearch,
  Network,
  FileText,
  User2,
  ChevronUp,
} from "lucide-react"
 
import { Button } from "../../components/ui/button"

import ConnectedW from '../body/dynamic/wallet/ConnectedW.jsx'
import {BrowserProvider} from 'ethers'

export default  function AppSidebar() {
   const [connected,setConnected] = useState(false)
   const [account,setAccount] = useState()
   const [network,setNetwork] = useState()
   const [Signer,setSigner] = useState()

     useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setSigner(await provider.getSigner());
            localStorage.setItem("account", accounts[0]);
            setConnected(true);
          }

          const net = await window.ethereum.request({ method: "net_version" });
          setNetwork(net);
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum);
          setAccount(accounts[0]);
          setSigner(await provider.getSigner());
          setConnected(true);
          localStorage.setItem("account", accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);
  return (
    <Sidebar className="">
      <SidebarHeader className="text-white text-3xl font-bold flex items-center justify-center h-16">
        MetaMark 
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-2 p-3">
          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] hover:bg-[#1E293B] hover:cursor-pointer rounded-lg">
            <Link to="/">
            <div className="flex items-center">
              <Home className="mr-2" />
              HOME
            </div>
            </Link>
          </SidebarMenuItem>


          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] hover:bg-[#1E293B]  hover:cursor-pointer rounded-lg">
     
     <Link to="/about">
          <div className="flex  items-center">
              <Home className="mr-2" />
              ABOUT US 
              </div>
              </Link>

                     </SidebarMenuItem>

          <SidebarMenuItem className="p-4 text-xl font-semibold text-gray-300 bg-[#0F172B] hover:bg-[#1E293B]  hover:cursor-pointer rounded-lg">
           <Link to="/get-started">
            <div className="flex  items-center">
              <Play className="mr-2" />
            GET STARTED  
          </div> 
          </Link>
          </SidebarMenuItem>
          </SidebarMenu>

        </SidebarContent>
        <SidebarFooter>
            
            <div className="mb-10 text-center text-sm text-gray-400 items-center justify-center ">
           {
             connected ? (
                         <ConnectedW/>

             ):
               
                                      <ConnectButton showBalance={false} className="p-20" />


           }
          
            </div>
            
            </SidebarFooter>
    </Sidebar>
  )
}
