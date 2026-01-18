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


export default  function AppSidebar() {
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
            
            <div className="mb-10 text-center text-sm text-gray-400 items-center justify-center ml-[20%]">
            <ConnectButton showBalance={false} className="p-20" />
            </div>
            
            </SidebarFooter>
    </Sidebar>
  )
}
