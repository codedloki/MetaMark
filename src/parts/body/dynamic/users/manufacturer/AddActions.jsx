import React from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Layers, ArrowRight, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function AddActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Register Asset",
      type: "Level 1 Registration",
      desc: "Define a new product line on the blockchain. Required once per product type to establish origin.",
      icon: <PackagePlus className="h-7 w-7" />,
      path: "/m/create/product",
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/20",
      hoverBg: "group-hover:bg-blue-500/20",
    },
    {
      title: "Deploy Batch",
      type: "Level 2 Execution",
      desc: "Initialize a specific production series. Generates unique serials and cryptographic QR roots.",
      icon: <Layers className="h-7 w-7" />,
      path: "/m/create/batch",
      accent: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      glow: "shadow-indigo-500/20",
      hoverBg: "group-hover:bg-indigo-500/20",
    },
  ];

  return (
    <div className="h-screen w-full bg-[#020617] bg-gradient-to-b from-[#020617] to-[#0f172a] overflow-y-auto scrollbar-hide font-sans text-slate-100">
      <div className="flex flex-col items-center justify-start p-6 md:p-16 min-h-full">
        
        {/* Navigation & Header */}
        <div className="w-full max-w-5xl mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 hover:text-blue-400 transition-all"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Return to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Initialize Operations</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight">What would you like <br/> to execute?</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-xs text-sm leading-relaxed border-l-2 border-slate-800 pl-6">
              Select an action to update the <span className="text-blue-400">immutable ledger</span> with new production data.
            </p>
          </div>
        </div>

        {/* Action Tiles */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="group relative flex flex-col items-start p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:-translate-y-2 overflow-hidden shadow-2xl"
            >
              {/* Subtle Gradient Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 ${action.bg} opacity-0 group-hover:opacity-100 rounded-full -mr-32 -mt-32 blur-[80px] transition-opacity duration-700`} />

              {/* Icon Container */}
              <div className={`mb-10 p-5 rounded-2xl ${action.bg} ${action.accent} border ${action.border} transition-all duration-500 group-hover:scale-110 shadow-lg ${action.glow}`}>
                {action.icon}
              </div>

              <div className="relative z-10 text-left w-full">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                  {action.type}
                </p>
                <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <div className={`p-2 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 bg-white/5 ${action.accent}`}>
                    <ArrowRight size={20} />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed pr-6">
                  {action.desc}
                </p>
              </div>

              {/* Interactive Status Footer */}
              <div className="mt-10 flex items-center gap-2 text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0)] group-hover:shadow-emerald-500/50 transition-all" />
                 Latest Protocol Ready
              </div>
            </button>
          ))}
        </div>

        {/* Security Footer */}
        <div className="w-full max-w-5xl mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <ShieldCheck size={160} />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">Security Protocol</p>
              <p className="text-sm text-white/90 font-medium max-w-sm">All operations are cryptographically signed by your unique manufacturer key.</p>
            </div>
          </div>
          <div className="relative z-10 text-[10px] font-black font-mono text-blue-200 bg-black/20 px-5 py-2.5 rounded-xl border border-white/10 backdrop-blur-md uppercase tracking-widest">
             Node: Amoy-Polygon Testnet
          </div>
        </div>

        <div className="h-10 w-full" />
      </div>
    </div>
  );
}