import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  ShieldCheck, 
  ClipboardCheck, 
  Lock, 
  ChevronLeft, 
  UploadCloud,
  ArrowRight
} from "lucide-react";

export default function DocsPage() {
  const navigate = useNavigate();

  const docCategories = [
    {
      title: "Regulatory Licenses",
      desc: "GMP, ISO, and Drug Manufacturing Permissions.",
      icon: <ShieldCheck className="text-blue-400" size={24} />,
      count: "3 Files",
      color: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Lab Test Reports",
      desc: "Batch-wise quality control and chemical analysis.",
      icon: <ClipboardCheck className="text-indigo-400" size={24} />,
      count: "12 Files",
      color: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    {
      title: "Contract Audits",
      desc: "Smart contract security and blockchain verification.",
      icon: <Lock className="text-purple-400" size={24} />,
      count: "1 File",
      color: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      title: "Product SOPs",
      desc: "Standard operating procedures and specifications.",
      icon: <FileText className="text-slate-400" size={24} />,
      count: "5 Files",
      color: "bg-slate-500/10",
      border: "border-slate-500/20"
    }
  ];

  return (
    <div className="h-screen w-full bg-[#020617] bg-gradient-to-b from-[#020617] to-[#0f172a] overflow-y-auto scrollbar-hide font-sans text-slate-100 p-6 md:p-16">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10 hover:text-blue-400 transition-all group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          BACK TO PANEL
        </button>

        {/* Header Section */}
        <div className="mb-12 relative">
          {/* Subtle background glow behind title */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Compliance Vault</h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Access and manage your <span className="text-blue-400">cryptographically secured</span> manufacturing documents and certificates.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docCategories.map((cat, i) => (
            <div 
              key={i} 
              className="group relative bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-white/10 hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Corner Glow Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-0 group-hover:opacity-30 rounded-full -mr-16 -mt-16 blur-2xl transition-opacity duration-500`} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-5 ${cat.color} border ${cat.border} rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  {cat.icon}
                </div>
                <span className="text-[9px] font-black text-slate-400 bg-slate-950/80 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
                  {cat.count}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 pr-4">
                {cat.desc}
              </p>
              
              <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.2em] relative z-10">
                Access Storage <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Upload Box (Empty State / Pro Area) */}
        <div className="mt-16 p-12 border-2 border-dashed border-white/5 rounded-[3.5rem] text-center bg-slate-900/20 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
          <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 inline-block mb-6 text-slate-500 shadow-inner group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
            <UploadCloud size={32} />
          </div>
          <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Expand Your Archive</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Drag and drop new certifications or lab reports to secure them in the manufacturing registry.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-lg shadow-blue-900/40 active:scale-95 transition-all">
            UPLOAD NEW DOCS
          </button>
        </div>

        {/* Footer info line */}
        <div className="mt-12 flex justify-center opacity-20">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Encrypted Documentation Hub</p>
        </div>

      </div>
    </div>
  );
}