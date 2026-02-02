import React, { useEffect, useState } from "react";
import { useUser } from "../../../../providers/UsersProvider";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useConnect } from "../../../../providers/ConnectProvider";
import { LayoutGrid, BarChart3, FileText, Link as LinkIconLucide, Plus } from "lucide-react";

export default function ManufactDash() {
  const { registry, product, role } = useUser();
  const { walletAddress } = useConnect();

  const [manufact, setManufact] = useState({ name: "", company: "" });
  const [nof, setNof] = useState(0); 
  const [nb, setnb] = useState(0);   
  const [loading, setLoading] = useState(true);

  // Stats fetching logic remains same...
  useEffect(() => {
    if (!registry || !walletAddress) return;
    const getManInfo = async () => {
      try {
        setLoading(true);
        const manufactData = await registry.getManufacturer(walletAddress);
        setManufact({ name: manufactData[0], company: manufactData[1] });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    getManInfo();
  }, [registry, walletAddress]);

  useEffect(() => {
    if (!product || !walletAddress) return;
    const fetchData = async () => {
      try {
        const productIds = await product.getProductsByManufacturer(walletAddress);
        setNof(productIds.length);
        const batchPromises = productIds.map((id) => product.getProductBatchIds(id));
        const allBatches = await Promise.all(batchPromises);
        let total = 0;
        allBatches.forEach((b) => { if (b) total += b.length; });
        setnb(total);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [product, walletAddress]);

  if (role !== 1) return <div className="p-10 text-center font-bold text-red-500">Unauthorized</div>;

  return (
    // ✅ FIX: added h-screen and overflow-y-auto for the main wrapper
    <div className="h-screen w-full bg-[#cbdff2] overflow-y-auto scrollbar-hide font-sans">
      <div className="flex flex-col items-center justify-start p-4 md:p-10 min-h-full">
        
        {/* Main Card Container */}
        <div className="relative w-full max-w-4xl bg-gradient-to-br from-blue-300/40 via-white/60 to-blue-200/40 p-6 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl border border-white/30 overflow-hidden">
          
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-white shadow-xl">
                <LayoutGrid className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md text-center md:text-left">
                MANUFACTURER DASHBOARD
              </h1>
            </div>

            {/* Manufacturer Info */}
            <div className="mb-8 text-center md:text-left bg-white/30 p-6 rounded-[2rem] border border-white/40">
              {loading ? (
                <div className="space-y-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-1/3" /></div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-800 uppercase">{manufact.name || "N/A"}</h2>
                  <p className="text-sm font-bold text-blue-700/70 mb-3">{manufact.company || "Company"}</p>
                  <div className="inline-block bg-white/80 px-3 py-1.5 rounded-xl text-[10px] font-mono text-blue-600 border border-blue-50 break-all">
                    {walletAddress}
                  </div>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard title="Total Products" value={nof} unit="Items" color="blue" />
              <StatCard title="Total Batches" value={nb} unit="Batches" color="indigo" />
            </div>

            {/* ✅ FIXED ACTIONS SECTION: Scrollable row for mobile icons if they don't fit */}
            <div className="mt-10">
               <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4 ml-2">Quick Actions</p>
               <div className="flex overflow-x-auto pb-4 gap-4 md:justify-end no-scrollbar">
                <ActionButton icon={<Plus size={24} />} url="/m/create/actions" label="Add" />
                <ActionButton icon={<BarChart3 size={24} />} url="/m/charts" label="Stats" />
                <ActionButton icon={<FileText size={24} />} url="/m/docs" label="Files" />
                <ActionButton icon={<LinkIconLucide size={24} />} url="/m/links" label="Links" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacer for bottom area padding on mobile */}
        <div className="h-10 w-full" />
      </div>
    </div>
  );
}

/* =======================
   REUSABLE UI COMPONENTS
   ======================= */

const StatCard = ({ title, value, unit, color }) => (
  <div className="rounded-[2rem] bg-white/90 p-6 shadow-lg border border-white">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
    <p className={`text-3xl font-black text-slate-800`}>{value} <span className="text-xs font-bold text-slate-400">{unit}</span></p>
  </div>
);

const ActionButton = ({ icon, url, label }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <button
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-xl transition-all active:scale-90 border border-white"
        onClick={() => navigate(url)}
      >
        {icon}
      </button>
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{label}</span>
    </div>
  );
};