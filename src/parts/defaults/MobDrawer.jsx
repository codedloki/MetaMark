import React from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from '../../components/ui/drawer.tsx'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUser } from '../providers/UsersProvider.jsx';
import { Home, Info, BookOpen, X, ChevronRight, UserCircle, LayoutDashboard, Settings2 } from 'lucide-react';

export default function MobDrawer({ open, onOpenChange }) {
  const { role } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'About', icon: <Info size={20} />, path: '/about' },
    { name: 'Guide', icon: <BookOpen size={20} />, path: '/guide' },
  ];

  const handleNav = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  const getRoleLabel = (roleId) => {
    if (roleId === 1) return "Manufacturer";
    if (roleId === 0) return "Consumer";
    return "User";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white/95 backdrop-blur-xl border-t border-slate-200 rounded-t-[2.5rem] outline-none">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 my-4" />
        
        <DrawerHeader className="text-left px-6">
          <DrawerTitle className="text-2xl font-black text-blue-600 tracking-tight">
            Metamark
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col p-6 gap-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.path)}
              className="flex items-center justify-between p-4 rounded-2xl transition-all active:bg-blue-50 active:scale-95 group border border-transparent active:border-blue-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-active:bg-blue-600 group-active:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="text-lg font-semibold text-slate-700">{item.name}</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          ))}

          <hr className="my-4 border-slate-100" />

          {/* Wallet Section - Space Saving Design */}
          <div className="p-2 w-full">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                if (!connected) {
                  return (
                    <button 
                      onClick={openConnectModal} 
                      className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <UserCircle size={20} />
                      Connect Wallet
                    </button>
                  );
                }

                return (
                  <div className="flex gap-2 w-full">
                    {/* Primary Action: Go to Dashboard */}
                    <button
                      onClick={() => handleNav(role === 1 ? '/m/dashboard' : '/c/dashboard')}
                      className="flex-1 flex items-center gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-xl active:scale-95 transition-transform border border-slate-800"
                    >
                      <div className="p-1.5 bg-blue-600 rounded-lg">
                        <LayoutDashboard size={18} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Dashboard</span>
                        <span className="text-xs font-bold truncate">{getRoleLabel(role)}</span>
                      </div>
                    </button>

                    {/* Secondary Action: Wallet Settings (Opens original RainbowKit Modal) */}
                    <button
                      onClick={openAccountModal}
                      className="p-4 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 active:scale-95 transition-transform flex items-center justify-center"
                      title="Wallet Settings"
                    >
                      <Settings2 size={24} />
                    </button>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>

        <div className="p-6 pt-0 mb-4">
          <DrawerClose asChild>
            <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-slate-400 font-bold active:scale-95 transition-all text-sm">
              <X size={16} />
              Close Menu
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}