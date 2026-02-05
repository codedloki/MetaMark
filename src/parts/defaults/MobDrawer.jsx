import React from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from '../../components/ui/drawer'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUser } from '../providers/UsersProvider.jsx';
import { 
  Home, 
  Info, 
  BookOpen, 
  X, 
  ChevronRight, 
  UserCircle, 
  LayoutDashboard, 
  Settings2,
  ShieldCheck,
  Zap,
  Fingerprint
} from 'lucide-react';

export default function MobDrawer({ open, onOpenChange }) {
  const { role } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Protocol About', icon: <Info size={20} />, path: '/about' },
    { name: 'Deployment Guide', icon: <BookOpen size={20} />, path: '/guide' },
  ];

  const handleNav = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  const getRoleLabel = (roleId) => {
    if (roleId === 1) return "Manufacturer";
    if (roleId === 2) return "Consumer";
    return "Public Node";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[3rem] outline-none shadow-2xl">
        {/* Handle Bar */}
        <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-800 mt-4 mb-2" />
        
        <DrawerHeader className="text-left px-8 pt-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <ShieldCheck className="text-blue-400" size={24} />
             </div>
             <div>
               <DrawerTitle className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                 MetaMark
               </DrawerTitle>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5">Blockchain Interface</p>
             </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col p-8 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.path)}
              className="flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.96] group bg-slate-900/50 border border-white/5 hover:bg-slate-800/80 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-950 text-slate-500 group-active:bg-blue-600 group-active:text-white transition-all border border-white/5">
                  {item.icon}
                </div>
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{item.name}</span>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-active:text-blue-400" />
            </button>
          ))}

          <div className="h-px w-full bg-white/5 my-4" />

          {/* Wallet Section */}
          <div className="w-full">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;

                if (!connected) {
                  return (
                    <button 
                      onClick={openConnectModal} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-[2rem] font-black text-[11px] tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 border-none"
                    >
                      <Fingerprint size={20} className="text-blue-200" />
                      AUTHORIZE WALLET
                    </button>
                  );
                }

                return (
                  <div className="flex gap-3 w-full">
                    {/* Primary Dashboard Action */}
                    <button
                      onClick={() => handleNav(role === 1 ? '/m/dashboard' : '/c/dashboard')}
                      className="flex-1 flex items-center gap-4 p-4 rounded-[2rem] bg-slate-100 text-slate-900 shadow-xl active:scale-95 transition-all border-none"
                    >
                      <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
                        <LayoutDashboard size={20} className="text-white" />
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Access Panel</span>
                        <span className="text-xs text-white uppercase tracking-tight truncate w-full">{getRoleLabel(role)}</span>
                      </div>
                    </button>

                    {/* Wallet Settings / Account Modal */}
                    <button
                      onClick={openAccountModal}
                      className="p-5 rounded-[2.5rem] bg-slate-900 text-slate-400 border border-white/5 shadow-inner active:scale-95 transition-all flex items-center justify-center group hover:text-blue-400"
                    >
                      <Settings2 size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="p-8 pt-0 mb-6">
          <DrawerClose asChild>
            <button className="w-full py-4 rounded-2xl bg-slate-950 text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] active:scale-95 transition-all border border-white/5 hover:text-slate-400">
       Close 
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}