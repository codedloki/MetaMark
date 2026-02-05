import React from "react";
import { 
  Wallet, UserPlus, Factory, User, ShieldCheck, 
  PackageSearch, PlusCircle, Boxes, QrCode, 
  ScanLine, SearchCheck, ArrowDown
} from "lucide-react";

import { ScrollArea } from "../../../components/ui/scroll-area";

// --- Global & Custom Scrollbar CSS ---
const scrollbarStyles = `
  /* Poore page ke liye global scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #020617; /* Deep dark background match */
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.2); /* Subtle blue */
    border-radius: 5px;
    border: 2px solid #020617; /* Space around thumb */
    transition: all 0.3s ease;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5); /* Bright blue on hover */
  }

  /* Firefox ke liye support */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.2) #020617;
  }
`;

const FeatureCard = ({ icon, name, desc }) => (
  <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 group transition-all hover:border-blue-500/50 hover:bg-slate-800 shadow-lg backdrop-blur-md">
    <div className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0 bg-blue-500/10 p-2 rounded-xl">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="text-[11px] font-black text-slate-100 leading-tight uppercase tracking-widest">{name}</h4>
      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{desc}</p>
    </div>
  </div>
);

const Branch = ({ title, icon: Icon, features, colorClass, label, glowClass }) => (
  <div className="flex-1 flex flex-col gap-5 p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/10 relative backdrop-blur-xl group hover:border-white/20 transition-all duration-500">
    <div className={`absolute inset-0 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${glowClass}`} />
    
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-2xl shadow-current/20`}>
        <Icon size={24} />
      </div>
      <div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block leading-none mb-1.5">{label}</span>
        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{title}</h3>
      </div>
    </div>
    
    <div className="flex flex-col gap-3 relative z-10">
      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </div>
  </div>
);

export default function MetaMarkHierarchy() {
  return (
    
    <div className="h-screen w-full bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] overflow-y-auto px-4 py-12 md:py-20 font-sans selection:bg-blue-500/30">
      <style>{scrollbarStyles}</style>
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-3xl relative mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="p-5 bg-blue-600/20 rounded-[2rem] border border-blue-500/30 shadow-2xl shadow-blue-500/10 mb-6 group hover:scale-105 transition-transform duration-500">
            <PackageSearch className="text-blue-400" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Protocol <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8 text-nowrap">Architecture</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase mt-6 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
            Decentralized Supply Chain Roadmap
          </p>
        </div>

        {/* --- STEP 01 --- */}
        <div className="relative flex flex-col items-center">
          <div className="z-20 flex flex-col items-center gap-4">
            <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-slate-950 transition-all hover:rotate-6">
              <Wallet size={32} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Phase 01</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">Connect Node</h3>
            </div>
          </div>
          <div className="h-16 w-[2px] bg-gradient-to-b from-blue-600 to-indigo-500 my-4" />
        </div>

        {/* --- STEP 02 --- */}
        <div className="relative flex flex-col items-center mb-12">
          <div className="z-20 flex flex-col items-center gap-4">
            <div className="h-20 w-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(79,70,229,0.4)] border-4 border-slate-950 transition-all hover:-rotate-6">
              <UserPlus size={32} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Phase 02</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">Digital Identity</h3>
            </div>
          </div>
          
          <div className="w-full max-w-[500px] h-20 relative mt-4">
            <svg className="w-full h-full" viewBox="0 0 500 80" fill="none">
              <path 
                d="M250 0V20C250 40 230 40 210 40H60C40 40 40 60 40 80" 
                stroke="url(#grad-line)" strokeWidth="3" strokeDasharray="6 6"
              />
              <path 
                d="M250 0V20C250 40 270 40 290 40H440C460 40 460 60 460 80" 
                stroke="url(#grad-line)" strokeWidth="3" strokeDasharray="6 6"
              />
              <defs>
                <linearGradient id="grad-line" x1="0" y1="0" x2="0" y2="100%">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Branches */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 relative z-10 px-2 md:px-0">
          <Branch 
            title="Manufacturer"
            label="Authorized Producer"
            icon={Factory}
            colorClass="bg-indigo-600"
            glowClass="bg-indigo-500"
            features={[
              { name: "Initialize Asset", desc: "Permanent NFT line", icon: <PlusCircle size={14}/> },
              { name: "Seal Batch", desc: "Merkle Root hashing", icon: <Boxes size={14}/> },
              { name: "Export Root", desc: "Encrypted QR identity", icon: <QrCode size={14}/> }
            ]}
          />
          <Branch 
            title="Consumer"
            label="Validation Agent"
            icon={User}
            colorClass="bg-emerald-600"
            glowClass="bg-emerald-500"
            features={[
              { name: "Audit Scan", desc: "Camera logic sync", icon: <ScanLine size={14}/> },
              { name: "Verify Proof", desc: "Consensus check", icon: <SearchCheck size={14}/> },
              // { name: "Trace History", desc: "Full supply chain map", icon: <ArrowDown size={14}/> }
            ]}
          />
        </div>

        {/* Convergence */}
        <div className="relative flex flex-col items-center pt-16">
           <div className="z-20 h-24 w-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-900 shadow-[0_0_60px_rgba(248,250,252,0.2)] border-[6px] border-slate-950 group hover:scale-110 transition-all duration-500">
             <ShieldCheck size={44} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5}/>
           </div>
           
           <div className="text-center mt-8">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">End-to-End Integrity</h3>
             <p className="text-[11px] text-slate-400 font-bold max-w-[280px] mx-auto mt-3 leading-relaxed uppercase tracking-[0.15em]">
               Real-time authenticity powered by <span className="text-blue-400">Merkle Proofs</span> & <span className="text-emerald-400">IPFS storage</span>.
             </p>
           </div>
           
           <div className="mt-12 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Network Verified & Immutable</span>
           </div>
        </div>

        <div className="h-32 w-full" />
      </div>
    </div>
    
  );
}