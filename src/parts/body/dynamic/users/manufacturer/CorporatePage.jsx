import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Users, 
  ChevronLeft, 
  Globe,
  Briefcase,
  ExternalLink
} from "lucide-react";

export default function CorporatePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#f8fafc] overflow-y-auto font-sans p-6 md:p-16">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-blue-600 transition-all">
          <ChevronLeft size={14} /> BACK TO PANEL
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Corporate Profile</h1>
          <p className="text-slate-500 font-medium">Verified blockchain identity and enterprise resource mapping.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Enterprise Identity</h2>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Verified Manufacturer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem label="Registration ID" value="REG-2026-X9921" />
                <InfoItem label="Tax Identity" value="GSTIN-992100441" />
                <InfoItem label="HQ Location" value="Mumbai, Maharashtra, IN" />
                <InfoItem label="Website" value="www.pharma-corp.io" />
              </div>
            </div>

            {/* Warehouse Locations */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-red-500" /> Authorized Warehouses
              </h3>
              <div className="space-y-4">
                <LocationRow name="Central Logistics Hub" loc="Bhiwandi, MH" status="Primary" />
                <LocationRow name="Northern Cold Storage" loc="Gurugram, HR" status="Active" />
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Stakeholders Card */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
              <Users className="text-blue-400 mb-4" size={32} />
              <h4 className="text-xl font-black mb-2 tracking-tight">Personnel</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">Manage authorized employees who can access this dashboard.</p>
              <div className="flex -space-x-3 mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    ID
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  +4
                </div>
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Manage Access
              </button>
            </div>

            {/* Blockchain Node Card */}
            <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100">
               <Briefcase className="text-blue-600 mb-4" size={32} />
               <h4 className="text-lg font-black text-slate-800 mb-2 tracking-tight">Node Status</h4>
               <p className="text-slate-500 text-xs font-medium mb-4">Current Connection: Polygon Amoy Testnet</p>
               <div className="flex items-center gap-2 text-[10px] font-black text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> SYSTEM ONLINE
               </div>
            </div>
          </div>

        </div>

        <div className="h-10 w-full" />
      </div>
    </div>
  );
}

/* Helper Components */
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

const LocationRow = ({ name, loc, status }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div>
      <p className="text-sm font-black text-slate-800">{name}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{loc}</p>
    </div>
    <span className="text-[9px] font-black px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 uppercase">{status}</span>
  </div>
);