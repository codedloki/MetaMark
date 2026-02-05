import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "../../components/ui/sidebar"

import { Link, useLocation } from "react-router-dom"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { 
  Home, 
  Info, 
  Rocket, 
  ShieldCheck, 
  LayoutDashboard, 
  ExternalLink,
  Wallet,
  LogOut,
  ChevronRight
} from "lucide-react"
import { User } from "lucide-react"

import { useConnect } from "../providers/ConnectProvider.jsx"
import { useUser } from "../providers/UsersProvider.jsx"

export default function AppSidebar() {
  const { isConnected } = useConnect()
  const { role } = useUser()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "About Us", path: "/about", icon: <Info size={20} /> },
    { name: "Get Started", path: "/get-started", icon: <Rocket size={20} /> },
  ]

  const getDashLink = () => {
    if (role === 1) return { name: "Manufacturer", path: "/m/dashboard" }
    if (role === 2) return { name: "customer", path: "/c/dashboard" }
    return null
  }

  const dashLink = getDashLink()

  return (
    <Sidebar className="border-r border-slate-800 bg-[#020617] text-slate-300">
      
      {/* HEADER */}
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">
            MetaMark
          </span>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-4 py-2">
        <SidebarMenu className="space-y-1.5">
          <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Navigation</p>
          
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all group
                  ${isActive(item.path) 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 hover:text-white"}`}
              >
                <span className={`${isActive(item.path) ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`}>
                  {item.icon}
                </span>
                {item.name.toUpperCase()}
              </Link>
            </SidebarMenuItem>
          ))}

          {dashLink && (
            <div className="mt-8">
              <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Authorized Access</p>
              <SidebarMenuItem>
                <Link 
                  to={dashLink.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all border border-slate-800/50
                    ${isActive(dashLink.path) 
                      ? "bg-slate-800 text-blue-400 border-blue-500/50" 
                      : "bg-slate-900/50 hover:bg-slate-800 hover:text-white"}`}
                >
                  <LayoutDashboard size={20} />
                  {dashLink.name.toUpperCase()}
                </Link>
              </SidebarMenuItem>
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER: Custom ConnectButton Logic */}
      <SidebarFooter className="p-6 border-t border-slate-800/50 bg-[#020617]/50 backdrop-blur-sm">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button 
                        onClick={openConnectModal} 
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs tracking-widest transition-all shadow-lg shadow-blue-900/20"
                      >
                        <Wallet size={16} /> CONNECT WALLET
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        className="w-full bg-red-500 text-white py-3 rounded-xl font-black text-xs transition-all"
                      >
                        WRONG NETWORK
                      </button>
                    );
                  }

                  return (
                    <div className="flex flex-col gap-3">
                      {/* Active Connection Card */}
                      <div 
                        onClick={openAccountModal}
                        className="flex items-center gap-3 p-3 bg-slate-900 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                          <User size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active Account</p>
                          <p className="text-xs font-mono font-bold text-slate-200 truncate">
                            {account.displayName}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />
                      </div>

                      {/* Network Switcher (Small) */}
                      <button 
                        onClick={openChainModal}
                        className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
                      >
                        {chain.hasIcon && (
                          <div className="w-3 h-3 rounded-full overflow-hidden">
                            {chain.iconUrl && <img src={chain.iconUrl} alt={chain.name} />}
                          </div>
                        )}
                        {chain.name}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-600 hover:text-slate-400 transition-colors cursor-pointer uppercase tracking-tighter">
          <ExternalLink size={12} /> Protocol Status: v1.0-Amoy
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}