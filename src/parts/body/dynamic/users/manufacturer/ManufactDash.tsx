// import React, { useEffect, useState } from "react";
// import { useUser } from "../../../../providers/UsersProvider";
// import { Skeleton } from "../../../../../components/ui/skeleton";
// import { useNavigate } from "react-router-dom";
// import { useConnect } from "../../../../providers/ConnectProvider";
// import { 
//   LayoutGrid, 
//   BarChart3, 
//   FileText, 
//   Plus, 
//   Copy, 
//   Building2, 
//   ExternalLink,
//   ShieldCheck,
//   ArrowUpRight,
//   MessageSquare,
//   Shield,
//   CheckCircle2
// } from "lucide-react";

// export default function ManufactDash() {
//   const { registry, product, role } = useUser();
//   const { walletAddress } = useConnect();
//   const navigate = useNavigate();

//   const [manufact, setManufact] = useState({ name: "", company: "" });
//   const [nof, setNof] = useState(0); 
//   const [nb, setnb] = useState(0);   
//   const [loading, setLoading] = useState(true);

//   // Address Copy State
//   const [isAddrCopied, setIsAddrCopied] = useState(false);

//   // Fetch Manufacturer Info
//   useEffect(() => {
//     if (!registry || !walletAddress) return;
//     const getManInfo = async () => {
//       try {
//         setLoading(true);
//         const manufactData = await registry.getManufacturer(walletAddress);
//         setManufact({ name: manufactData[0], company: manufactData[1] });
//       } catch (err) { 
//         console.error(err); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
//     getManInfo();
//   }, [registry, walletAddress]);

//   // Fetch Product/Batch Data
//   useEffect(() => {
//     if (!product || !walletAddress) return;
//     const fetchData = async () => {
//       try {
//         const productIds = await product.getProductsByManufacturer(walletAddress);
//         setNof(productIds.length);
//         const batchPromises = productIds.map((id) => product.getProductBatchIds(id));
//         const allBatches = await Promise.all(batchPromises);
//         let total = 0;
//         allBatches.forEach((b) => { if (b) total += b.length; });
//         setnb(total);
//       } catch (error) { 
//         console.error(error); 
//       }
//     };
//     fetchData();
//   }, [product, walletAddress]);

//   const handleCopyAddr = () => {
//     if (!walletAddress) return;
//     navigator.clipboard.writeText(walletAddress);
//     setIsAddrCopied(true);
//     setTimeout(() => setIsAddrCopied(false), 2000);
//   };

//   if (role !== 1) return (
//     <div className="h-screen flex items-center justify-center bg-slate-50">
//       <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center font-sans">
//         <p className="text-red-500 font-black text-xl mb-2">ACCESS DENIED</p>
//         <p className="text-slate-500 text-sm">Manufacturer clearance required.</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-screen w-full bg-[#f8fafc] overflow-y-auto scrollbar-hide font-sans text-slate-900">
//       <div className="flex flex-col items-center justify-start p-4 md:p-12 min-h-full">
        
//         {/* Top Header */}
//         <div className="w-full max-w-5xl flex justify-between items-center mb-10 px-2">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
//               <ShieldCheck className="text-white" size={24} />
//             </div>
//             <div>
//               <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-none">Control Panel</h1>
//               <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest">Authorized Access</p>
//             </div>
//           </div>
//           <button onClick={() => navigate('/m/settings')} className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all font-bold text-xs text-slate-600">
//             SETTINGS <ExternalLink size={14} />
//           </button>
//         </div>

//         {/* Hero Section */}
//         <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 relative group overflow-hidden bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/60 border border-white transition-all">
//             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
//                 <Shield size={160} />
//             </div>
//             <div className="relative z-10">
//               {loading ? (
//                 <div className="space-y-4"><Skeleton className="h-10 w-48 rounded-xl" /><Skeleton className="h-6 w-32 rounded-lg" /></div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase mb-4">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Authorized Manufacturer Account
//                   </div>
//                   <h2 className="text-4xl font-black text-slate-900 mb-1 leading-tight">{manufact.name || "Loading..."}</h2>
//                   <p className="text-lg font-bold text-blue-600/60 mb-8 uppercase tracking-tight">{manufact.company || "Registry Pending"}</p>
                  
//                   <div className="flex flex-col gap-4">
//                     {/* Wallet Address Display */}
//                     <div className="w-full max-w-md">
//                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Manufacturer Wallet</p>
//                       <button 
//                           onClick={handleCopyAddr} 
//                           className="flex items-center justify-between w-full bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 group/addr hover:bg-slate-900 hover:text-white transition-all duration-300 text-left"
//                       >
//                           <span className="font-mono text-[10px] font-bold truncate mr-4">
//                               {walletAddress}
//                           </span>
//                           {isAddrCopied ? (
//                               <CheckCircle2 size={16} className="text-green-500 shrink-0" />
//                           ) : (
//                               <Copy size={14} className="opacity-40 group-hover/addr:opacity-100 shrink-0" />
//                           )}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-200 flex flex-col justify-between text-white relative overflow-hidden group">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
//             <div>
//               <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-80">Operations Center</p>
//               <h3 className="text-2xl font-black leading-tight">Initialize <br /> Assets & Batches</h3>
//             </div>
//             <button onClick={() => navigate('/m/create/actions')} className="mt-8 flex items-center justify-center gap-3 bg-white text-blue-600 py-4 rounded-2xl font-black text-sm shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all">
//               <Plus size={20} strokeWidth={3} /> ENTER HUB
//             </button>
//           </div>
//         </div>

//         {/* Real-time Insights */}
//         <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//           <StatCard 
//             title="Global Catalog" 
//             value={nof} 
//             unit="Products" 
//             desc="Explore registered asset types"
//             icon={<LayoutGrid className="text-blue-600 " size={20} />} 
//             onClick={() => navigate('/m/catalog')}
//           />
//           <StatCard 
//             title="Chain Deployment" 
//             value={nb} 
//             unit="Batches" 
//             desc="Live batches on-network"
//             icon={<BarChart3 className="text-indigo-600" size={20} />} 
//             onClick={() => navigate('/m/history')}
//           />
//         </div>

//         {/* Management Suite Section */}
//         <div className="w-full max-w-5xl mt-12">
//           <div className="flex items-center gap-4 mb-6 px-2">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management Suite</p>
//             <div className="h-[1px] flex-1 bg-slate-200"></div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <ActionButton icon={<LayoutGrid size={20} />} label="Products" url="/m/catalog" />
//             <ActionButton 
//               icon={<MessageSquare size={20} className="group-hover:text-blue-600 transition-colors" />} 
//               label="Web3 Messages" 
//               url="/m/messages" 
//               isNew={true}
//             />
//             <ActionButton icon={<FileText size={20} />} label="Documents" url="/m/docs" />
//             <ActionButton icon={<Building2 size={20} />} label="Corporate" url="/m/company" />
//           </div>
//         </div>
//         <div className="h-16 w-full" />
//       </div>
//     </div>
//   );
// }

// const StatCard = ({ title, value, unit, desc, icon, onClick }: any) => (
//   <div 
//     onClick={onClick}
//     className="group rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
//   >
//     <div className="flex justify-between items-start mb-6">
//       <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{icon}</div>
//       <ArrowUpRight size={18} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
//     </div>
//     <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
//     <div className="flex items-baseline gap-2">
//       <p className="text-4xl font-black text-slate-900">{value}</p>
//       <p className="text-sm font-bold text-slate-400 tracking-tight">{unit}</p>
//     </div>
//     <p className="text-xs text-slate-400 mt-2 font-medium">{desc}</p>
//   </div>
// );

// const ActionButton = ({ icon, url, label, isNew }: any) => {
//   const navigate = useNavigate();
//   return (
//     <button onClick={() => navigate(url)} className="relative flex flex-col items-start p-5 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group w-full text-left">
//       {isNew && (
//         <span className="absolute top-4 right-4 flex h-2 w-2">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//         </span>
//       )}
//       <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-slate-400 mb-4">{icon}</div>
//       <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</span>
//       <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Chat Support</span>
//     </button>
//   );
// };

// import React, { useEffect, useState } from "react";
// import { useUser } from "../../../../providers/UsersProvider";
// import { Skeleton } from "../../../../../components/ui/skeleton";
// import { useNavigate } from "react-router-dom";
// import { useConnect } from "../../../../providers/ConnectProvider";
// import { 
//   LayoutGrid, 
//   BarChart3, 
//   FileText, 
//   Plus, 
//   Copy, 
//   Building2, 
//   ExternalLink,
//   ShieldCheck,
//   ArrowUpRight,
//   MessageSquare,
//   Shield,
//   CheckCircle2
// } from "lucide-react";

// export default function ManufactDash() {
//   const { registry, product, role } = useUser();
//   const { walletAddress } = useConnect();
//   const navigate = useNavigate();

//   const [manufact, setManufact] = useState({ name: "", company: "" });
//   const [nof, setNof] = useState(0); 
//   const [nb, setnb] = useState(0);   
//   const [loading, setLoading] = useState(true);
//   const [isAddrCopied, setIsAddrCopied] = useState(false);

//   useEffect(() => {
//     if (!registry || !walletAddress) return;
//     const getManInfo = async () => {
//       try {
//         setLoading(true);
//         const manufactData = await registry.getManufacturer(walletAddress);
//         setManufact({ name: manufactData[0], company: manufactData[1] });
//       } catch (err) { 
//         console.error(err); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
//     getManInfo();
//   }, [registry, walletAddress]);

//   useEffect(() => {
//     if (!product || !walletAddress) return;
//     const fetchData = async () => {
//       try {
//         const productIds = await product.getProductsByManufacturer(walletAddress);
//         setNof(productIds.length);
//         const batchPromises = productIds.map((id: any) => product.getProductBatchIds(id));
//         const allBatches = await Promise.all(batchPromises);
//         let total = 0;
//         allBatches.forEach((b: any) => { if (b) total += b.length; });
//         setnb(total);
//       } catch (error) { 
//         console.error(error); 
//       }
//     };
//     fetchData();
//   }, [product, walletAddress]);

//   const handleCopyAddr = () => {
//     if (!walletAddress) return;
//     navigator.clipboard.writeText(walletAddress);
//     setIsAddrCopied(true);
//     setTimeout(() => setIsAddrCopied(false), 2000);
//   };

//   if (role !== 1) return (
//     <div className="h-screen flex items-center justify-center bg-slate-950">
//       <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-red-500/20 text-center font-sans">
//         <p className="text-red-500 font-black text-xl mb-2 uppercase tracking-tighter">Access Denied</p>
//         <p className="text-slate-400 text-sm">Manufacturer clearance required.</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-screen w-full bg-slate-950 overflow-y-auto scrollbar-hide font-sans text-slate-100">
//       <div className="flex flex-col items-center justify-start p-4 md:p-12 min-h-full">
        
//         {/* Top Header */}
//         <div className="w-full max-w-5xl flex justify-between items-center mb-10 px-2">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
//               <ShieldCheck className="text-white" size={24} />
//             </div>
//             <div>
//               <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none">Control Panel</h1>
//               <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-widest">Authorized Access</p>
//             </div>
//           </div>
//           <button 
//             onClick={() => navigate('/m/settings')} 
//             className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-2xl border border-white/5 shadow-sm hover:bg-slate-800 transition-all font-bold text-xs text-slate-300"
//           >
//             SETTINGS <ExternalLink size={14} />
//           </button>
//         </div>

//         {/* Hero Section */}
//         <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 relative group overflow-hidden bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/5 transition-all">
//             <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform text-white">
//                 <Shield size={160} />
//             </div>
//             <div className="relative z-10">
//               {loading ? (
//                 <div className="space-y-4">
//                   <Skeleton className="h-10 w-48 rounded-xl bg-slate-800" />
//                   <Skeleton className="h-6 w-32 rounded-lg bg-slate-800" />
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] tracking-[0.2em] uppercase mb-4">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Verified Manufacturer
//                   </div>
//                   <h2 className="text-4xl font-black text-white mb-1 leading-tight">{manufact.name || "Loading..."}</h2>
//                   <p className="text-lg font-bold text-blue-500 mb-8 uppercase tracking-tight">{manufact.company || "Registry Pending"}</p>
                  
//                   <div className="flex flex-col gap-4">
//                     <div className="w-full max-w-md">
//                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Manufacturer Wallet</p>
//                       <button 
//                           onClick={handleCopyAddr} 
//                           className="flex items-center justify-between w-full bg-slate-950/50 px-5 py-3.5 rounded-2xl border border-white/5 group/addr hover:bg-blue-600 hover:text-white transition-all duration-300 text-left"
//                       >
//                           <span className="font-mono text-[10px] font-bold truncate mr-4 text-slate-300 group-hover/addr:text-white">
//                               {walletAddress}
//                           </span>
//                           {isAddrCopied ? (
//                               <CheckCircle2 size={16} className="text-green-400 shrink-0" />
//                           ) : (
//                               <Copy size={14} className="text-slate-600 group-hover/addr:text-white shrink-0" />
//                           )}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-900/40 flex flex-col justify-between text-white relative overflow-hidden group">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
//             <div className="relative z-10">
//               <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-80">Operations Center</p>
//               <h3 className="text-2xl font-black leading-tight">Initialize <br /> Assets & Batches</h3>
//             </div>
//             <button 
//               onClick={() => navigate('/m/create/actions')} 
//               className="relative z-10 mt-8 flex items-center justify-center gap-3 bg-white text-blue-600 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-100 active:scale-95 transition-all"
//             >
//               <Plus size={20} strokeWidth={3} /> ENTER HUB
//             </button>
//           </div>
//         </div>

//         {/* Real-time Insights */}
//         <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//           <StatCard 
//             title="Global Catalog" 
//             value={nof} 
//             unit="Products" 
//             desc="Explore registered asset types"
//             icon={<LayoutGrid className="text-blue-500" size={20} />} 
//             onClick={() => navigate('/m/catalog')}
//           />
//           <StatCard 
//             title="Chain Deployment" 
//             value={nb} 
//             unit="Batches" 
//             desc="Live batches on-network"
//             icon={<BarChart3 className="text-indigo-500" size={20} />} 
//             onClick={() => navigate('/m/history')}
//           />
//         </div>

//         {/* Management Suite Section */}
//         <div className="w-full max-w-5xl mt-12">
//           <div className="flex items-center gap-4 mb-6 px-2">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Management Suite</p>
//             <div className="h-[1px] flex-1 bg-white/5"></div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <ActionButton icon={<LayoutGrid size={20} />} label="Products" url="/m/catalog" />
//             <ActionButton 
//               icon={<MessageSquare size={20} className="group-hover:text-blue-500 transition-colors" />} 
//               label="Web3 Messages" 
//               url="/chat" 
//               isNew={true}
//             />
//             <ActionButton icon={<FileText size={20} />} label="Documents" url="/m/docs" />
//             {/* <ActionButton icon={<Building2 size={20} />} label="Corporate" url="/m/company" /> */}
//           </div>
//         </div>
//         <div className="h-16 w-full" />
//       </div>
//     </div>
//   );
// }

// const StatCard = ({ title, value, unit, desc, icon, onClick }: any) => (
//   <div 
//     onClick={onClick}
//     className="group rounded-[2.5rem] bg-slate-900 p-8 shadow-xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
//   >
//     <div className="flex justify-between items-start mb-6">
//       <div className="p-4 bg-slate-950 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{icon}</div>
//       <ArrowUpRight size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
//     </div>
//     <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</h3>
//     <div className="flex items-baseline gap-2">
//       <p className="text-4xl font-black text-white">{value}</p>
//       <p className="text-sm font-bold text-slate-500 tracking-tight">{unit}</p>
//     </div>
//     <p className="text-xs text-slate-500 mt-2 font-medium">{desc}</p>
//   </div>
// );

// const ActionButton = ({ icon, url, label, isNew }: any) => {
//   const navigate = useNavigate();
//   return (
//     <button 
//       onClick={() => navigate(url)} 
//       className="relative flex flex-col items-start p-5 rounded-[2rem] bg-slate-900 border border-white/5 shadow-sm hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group w-full text-left"
//     >
//       {isNew && (
//         <span className="absolute top-4 right-4 flex h-2 w-2">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//         </span>
//       )}
//       <div className="p-3 bg-slate-950 rounded-xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all text-slate-500 mb-4">{icon}</div>
//       <span className="text-xs font-black text-slate-200 uppercase tracking-tight">{label}</span>
//       <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">Live Access</span>
//     </button>
//   );
// }


import React, { useEffect, useState } from "react";
import { useUser } from "../../../../providers/UsersProvider";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useConnect } from "../../../../providers/ConnectProvider";
import { Client, IdentifierKind } from "@xmtp/browser-sdk"; // Added IdentifierKind
import { ethers } from "ethers";
import { 
  LayoutGrid, 
  BarChart3, 
  FileText, 
  Plus, 
  Copy, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  Fingerprint,
  Zap
} from "lucide-react";

export default function ManufactDash() {
  const { registry, product, role } = useUser();
  const { walletAddress } = useConnect();
  const navigate = useNavigate();

  // Basic States
  const [manufact, setManufact] = useState({ name: "", company: "" });
  const [nof, setNof] = useState(0); 
  const [nb, setnb] = useState(0);   
  const [loading, setLoading] = useState(true);
  const [isAddrCopied, setIsAddrCopied] = useState(false);
  
  // XMTP States
  const [myInboxId, setMyInboxId] = useState("");
  const [isXmtpLoading, setIsXmtpLoading] = useState(false);
  const [copyType, setCopyType] = useState(""); // 'addr' or 'id'

  // ======================== LOAD ON-CHAIN DATA ========================
  useEffect(() => {
    if (!registry || !walletAddress) return;
    const getManInfo = async () => {
      try {
        setLoading(true);
        const manufactData = await registry.getManufacturer(walletAddress);
        setManufact({ name: manufactData[0], company: manufactData[1] });
        
        // 💾 Check if InboxID exists in cache to avoid extra signatures
        const cachedId = localStorage.getItem(`xmtp_id_${walletAddress.toLowerCase()}`);
        if (cachedId) setMyInboxId(cachedId);

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

  // ======================== XMTP LOGIC (FIXED) ========================
  const getInboxId = async () => {
    setIsXmtpLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();
      
      // ✅ FIX: Using IdentifierKind.Ethereum instead of string "ethereum"
      const client = await Client.create(
        {
          type: "EOA",
          getIdentifier: () => ({ 
            identifier: address, 
            identifierKind: IdentifierKind.Ethereum // 🔥 Numeric Enum Fix
          }),
          signMessage: async (msg) => ethers.getBytes(await signer.signMessage(msg)),
        },
        { env: "production" }
      );

      setMyInboxId(client.inboxId);
      localStorage.setItem(`xmtp_id_${address}`, client.inboxId); // Cache result
    } catch (e) {
      console.error("XMTP ID Error:", e);
    } finally {
      setIsXmtpLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyType(type);
    setIsAddrCopied(true);
    setTimeout(() => {
        setIsAddrCopied(false);
        setCopyType("");
    }, 2000);
  };

  if (role !== 1) return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-red-500/20 text-center shadow-2xl">
        <Shield size={64} className="text-red-500 mx-auto mb-6 opacity-50" />
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Access Restricted</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">Manufacturer clearance required for node operations.</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-950 overflow-y-auto scrollbar-hide font-sans text-slate-100 selection:bg-blue-500/30">
      <div className="flex flex-col items-center justify-start p-4 md:p-12 min-h-full">
        
        {/* HEADER */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-10 px-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/20 transition-transform hover:rotate-3">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none">Manufacturer Node</h1>
              <p className="text-[10px] font-bold text-blue-500 mt-1.5 uppercase tracking-[0.2em]">Live Decentralized State</p>
            </div>
          </div>
          <button onClick={() => navigate('/m/settings')} className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-2xl border border-white/5 shadow-sm hover:bg-slate-800 transition-all font-black text-[10px] tracking-widest text-slate-400 active:scale-95">
            SETTINGS <ExternalLink size={14} />
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative group overflow-hidden bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl border border-white/5 backdrop-blur-3xl transition-all hover:border-blue-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 text-white pointer-events-none">
              <Shield size={200} />
            </div>
            
            <div className="relative z-10">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-64 rounded-2xl bg-slate-800" />
                  <Skeleton className="h-6 w-40 rounded-xl bg-slate-800" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Network Identity
                  </div>
                  <h2 className="text-5xl font-black text-white mb-2 leading-none tracking-tighter italic uppercase">{manufact.name || "Registry Node"}</h2>
                  <p className="text-xl font-bold text-blue-500 mb-10 uppercase tracking-widest leading-none">{manufact.company || "Brand ID Required"}</p>
                  
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Wallet Identity */}
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 mb-2">Primary Wallet Node</p>
                      <button 
                        onClick={() => handleCopy(walletAddress, 'addr')} 
                        className="flex items-center justify-between w-full bg-slate-950/50 px-5 py-4 rounded-[1.5rem] border border-white/5 hover:bg-blue-600/20 hover:border-blue-500/30 transition-all duration-300 group/addr active:scale-[0.98]"
                      >
                        <span className="font-mono text-[10px] font-bold truncate mr-4 text-slate-400 group-hover/addr:text-white">{walletAddress}</span>
                        {isAddrCopied && copyType === 'addr' ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <Copy size={14} className="text-slate-700 group-hover/addr:text-blue-400 shrink-0" />}
                      </button>
                    </div>

                    {/* XMTP Inbox ID */}
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 mb-2">Web3 Messaging Identity</p>
                      {myInboxId ? (
                        <button 
                          onClick={() => handleCopy(myInboxId, 'id')} 
                          className="flex items-center justify-between w-full bg-emerald-500/5 px-5 py-4 rounded-[1.5rem] border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group/id active:scale-[0.98]"
                        >
                          <span className="font-mono text-[10px] font-bold truncate mr-4 text-emerald-500 uppercase tracking-tighter">{myInboxId.slice(0,6)}...{myInboxId.slice(20,26)}</span>
                          {isAddrCopied && copyType === 'id' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Fingerprint size={16} className="text-emerald-900 group-hover/id:text-emerald-400" />}
                        </button>
                      ) : (
                        <button 
                          onClick={getInboxId} 
                          disabled={isXmtpLoading}
                          className="flex items-center justify-center gap-3 w-full bg-emerald-600 text-white px-5 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isXmtpLoading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} fill="currentColor" />}
                          {isXmtpLoading ? "Securing Node..." : "Link Messenger ID"}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* QUICK HUB CARD */}
          <div className="bg-blue-600 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/40 flex flex-col justify-between text-white relative overflow-hidden group border border-blue-400/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-70">Infrastructure</p>
              <h3 className="text-3xl font-black leading-[1.1] italic uppercase tracking-tighter">Initialize <br /> Asset Registry</h3>
            </div>
            <button onClick={() => navigate('/m/create/actions')} className="relative z-10 mt-10 flex items-center justify-center gap-3 bg-white text-blue-600 py-5 rounded-[1.5rem] font-black text-xs shadow-xl hover:bg-slate-100 active:scale-95 transition-all tracking-widest uppercase">
              <Plus size={20} strokeWidth={4} /> Open Hub
            </button>
          </div>
        </div>

        {/* CHAT REDIRECT BANNER */}
        <div 
          onClick={() => navigate('/chat')}
          className="w-full max-w-5xl bg-emerald-500/5 border border-emerald-500/10 p-6 mt-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer group hover:bg-emerald-500/10 transition-all duration-500 backdrop-blur-sm"
        >
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-900/10 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight italic leading-none">Global Support Channel</h3>
              <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-[0.25em] mt-2">End-to-End Encrypted B2C Messaging Node</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
            SECURE MESSENGER <ArrowUpRight size={18} strokeWidth={3} />
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <StatCard title="Product Catalog" value={nof} unit="Units" desc="Active asset definitions on ledger" icon={<LayoutGrid size={24} />} onClick={() => navigate('/m/catalog')} />
          <StatCard title="Batch Deployments" value={nb} unit="Blocks" desc="Cryptographically sealed batch entries" icon={<BarChart3 size={24} />} onClick={() => navigate('/m/history')} />
        </div>

        {/* QUICK ACCESS LINKS */}
        <div className="w-full max-w-5xl mt-16 pb-16">
          <div className="flex items-center gap-4 mb-8 px-4 opacity-20">
            <p className="text-[10px] font-black text-slate-100 uppercase tracking-[0.5em]">Enterprise Suite</p>
            <div className="h-px flex-1 bg-white"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <ActionButton icon={<LayoutGrid size={22} />} label="Catalog" url="/m/catalog" />
            <ActionButton icon={<MessageSquare size={22} />} label="Inquiries" url="/chat" isNew={true} />
            <ActionButton icon={<FileText size={22} />} label="Compliance" url="/m/docs" />
            <ActionButton icon={<ShieldCheck size={22} />} label="Audit Log" url="/m/docs" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Sub-component
const StatCard = ({ title, value, unit, desc, icon, onClick }) => (
  <div onClick={onClick} className="group rounded-[3rem] bg-slate-900/50 p-10 shadow-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
    <div className="absolute -bottom-10 -right-10 p-10 opacity-[0.02] text-white pointer-events-none group-hover:scale-125 transition-transform duration-700">{icon}</div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-blue-500">{icon}</div>
      <ArrowUpRight size={20} className="text-slate-800 group-hover:text-blue-400 transition-colors" strokeWidth={3} />
    </div>
    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{title}</h3>
    <div className="flex items-baseline gap-3">
      <p className="text-5xl font-black text-white tracking-tighter leading-none">{value}</p>
      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">{unit}</p>
    </div>
    <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
  </div>
);

// Action Button Sub-component
const ActionButton = ({ icon, url, label, isNew }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(url)} className="relative flex flex-col items-start p-7 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-xl hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all duration-300 group w-full text-left active:scale-95">
      {isNew && (
        <span className="absolute top-6 right-6 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      )}
      <div className="p-4 bg-slate-950 rounded-2xl group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all duration-300 text-slate-600 mb-6 border border-white/5">{icon}</div>
      <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">{label}</span>
      <span className="text-[8px] font-bold text-slate-600 uppercase mt-2 tracking-tighter opacity-50 text-nowrap">Authorized Access</span>
    </button>
  );
}