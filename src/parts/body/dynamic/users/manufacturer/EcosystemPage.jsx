import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  Truck, 
  ShieldCheck, 
  Database, 
  ChevronLeft, 
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export default function EcosystemPage() {
  const navigate = useNavigate();

  const networks = [
    {
      name: "Logistics Sync",
      desc: "Real-time integration with shipping and freight partners.",
      status: "Connected",
      icon: <Truck className="text-blue-500" size={22} />,
      link: "Track Shipments"
    },
    {
      name: "Govt. Drug Registry",
      desc: "Direct verification portal for national medical authorities.",
      status: "Active",
      icon: <ShieldCheck className="text-green-500" size={22} />,
      link: "Verify Licenses"
    },
    {
      name: "IPFS Explorer",
      desc: "Direct access to decentralized storage layer logs.",
      status: "Online",
      icon: <Database className="text-orange-500" size={22} />,
      link: "View CID Logs"
    },
    {
      name: "Public Verifier",
      desc: "Consumer-facing portal for public authenticity checks.",
      status: "Live",
      icon: <Globe className="text-indigo-500" size={22} />,
      link: "Open Portal"
    }
  ];

  return (
    <div className="h-screen w-full bg-[#f8fafc] overflow-y-auto font-sans p-6 md:p-16">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-blue-600 transition-all">
          <ChevronLeft size={14} /> BACK TO PANEL
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Network Ecosystem</h1>
          <p className="text-slate-500 font-medium">Manage cross-chain integrations and external protocol access.</p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networks.map((net, i) => (
            <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {net.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">{net.name}</h3>
                    <span className="text-[8px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full uppercase">● {net.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1 max-w-[200px]">{net.desc}</p>
                </div>
              </div>
              
              <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Informational Banner */}
        <div className="mt-12 p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="absolute right-0 top-0 p-10 opacity-10">
              <Globe size={150} />
           </div>
           <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">Ready for API Integration?</h4>
              <p className="text-indigo-100 text-sm font-medium">Generate API keys to allow third-party systems to verify your production data automatically.</p>
           </div>
           <button className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
              Developer Docs
           </button>
        </div>

      </div>
    </div>
  );
}