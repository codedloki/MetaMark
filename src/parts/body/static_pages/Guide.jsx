import React from "react";
import { 
  Wallet, UserPlus, Factory, User, ShieldCheck, 
  PackageSearch, PlusCircle, Boxes, QrCode, 
  ScanLine, SearchCheck
} from "lucide-react";

const FeatureCard = ({ icon, name, desc }) => (
  <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-slate-200 group transition-all hover:bg-white hover:shadow-md">
    <div className="text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="text-[11px] font-black text-slate-800 leading-tight uppercase tracking-tighter">{name}</h4>
      <p className="text-[10px] text-slate-500 font-medium truncate">{desc}</p>
    </div>
  </div>
);

const Branch = ({ title, icon: Icon, features, colorClass, label, lineSide }) => (
  <div className="flex-1 flex flex-col gap-4 p-5 rounded-[2.5rem] bg-slate-100/50 border-2 border-slate-200 relative">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-2xl ${colorClass} text-white shadow-lg`}>
        <Icon size={20} />
      </div>
      <div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block leading-none mb-1">{label}</span>
        <h3 className="text-sm font-black text-slate-900 uppercase italic">{title}</h3>
      </div>
    </div>
    <div className="flex flex-col gap-2.5">
      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </div>
  </div>
);

export default function MetaMarkHierarchy() {
  return (
    <div className="h-screen w-full bg-[#f1f5f9] overflow-y-auto scrollbar-hide px-4 py-10">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-3xl p-6 md:p-10 rounded-[3.5rem] shadow-2xl border border-white mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-200">
            <PackageSearch className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">MetaMark Flow</h2>
            <p className="text-slate-500 text-[11px] font-bold tracking-[0.25em] uppercase mt-2">Blockchain Supply Chain Roadmap</p>
          </div>
        </div>

        {/* Step 01: Connect Wallet */}
        <div className="relative flex flex-col items-center mb-16">
          <div className="z-10 flex flex-col items-center gap-3">
            <div className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl ring-[12px] ring-white">
              <Wallet size={28} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Step 01</span>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Connect Wallet</h3>
            </div>
          </div>
          {/* Darker Vertical Line */}
          <div className="absolute top-16 w-1 h-16 bg-blue-500/30" />
        </div>

        {/* Step 02: Registration */}
        <div className="relative flex flex-col items-center mb-20">
          <div className="z-10 flex flex-col items-center gap-3">
            <div className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl ring-[12px] ring-white">
              <UserPlus size={28} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Step 02</span>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identity Registration</h3>
            </div>
          </div>
          
          {/* Darker Branching Connectors */}
          <div className="absolute top-16 w-full flex justify-center">
             <div className="w-[85%] h-16 border-x-[3px] border-t-[3px] border-dashed border-blue-500/40 rounded-t-[3rem]" />
          </div>
        </div>

        {/* The Branches (Manufacturer & Consumer) */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <Branch 
            title="Manufacturer"
            label="Producer Path"
            icon={Factory}
            colorClass="bg-indigo-600"
            features={[
              { name: "Add Product", desc: "Define categories", icon: <PlusCircle size={14}/> },
              { name: "Add Batch", desc: "Merkle root creation", icon: <Boxes size={14}/> },
              { name: "Generate QR", desc: "Digital identity export", icon: <QrCode size={14}/> }
            ]}
          />
          <Branch 
            title="Consumer"
            label="Verifier Path"
            icon={User}
            colorClass="bg-emerald-600"
            features={[
              { name: "Scan Product", desc: "Mobile camera scan", icon: <ScanLine size={14}/> },
              { name: "Verify Logic", desc: "Blockchain check", icon: <SearchCheck size={14}/> }
            ]}
          />
        </div>

        {/* Final Convergence Step */}
        <div className="relative flex flex-col items-center pt-10 border-t-[3px] border-dashed border-slate-300">
           <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-4">
             <ShieldCheck size={28} />
           </div>
           <div className="text-center">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">Secure Verification</h3>
             <p className="text-[11px] text-slate-500 font-bold max-w-[240px] mx-auto mt-2 leading-relaxed uppercase tracking-tighter">
               End-to-end integrity through Merkle Proofs & IPFS.
             </p>
           </div>
        </div>

        {/* Mobile Bottom Padding */}
        <div className="h-20 w-full" />
      </div>
    </div>
  );
}