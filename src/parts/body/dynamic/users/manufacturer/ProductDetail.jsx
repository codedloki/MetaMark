import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../../providers/UsersProvider";
import axios from "axios";
import { ChevronRight, Box, Calendar, Lock, Info, Plus } from "lucide-react";

// --- Custom Scrollbar CSS (Injecting into the component) ---
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

// --- Sub-component for Collapsible Batch (Dark Mode) ---
function BatchItem({ batch }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden transition-all mb-4 bg-slate-900/50 shadow-xl backdrop-blur-sm">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-5 hover:bg-white/5 cursor-pointer transition-all border-b border-transparent"
        style={{ borderBottomColor: isOpen ? "rgba(255,255,255,0.05)" : "transparent" }}
      >
        <div className="flex items-center gap-4">
          <span className={`text-blue-500 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
            <ChevronRight size={18} strokeWidth={3} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-100 text-lg">Batch #{batch.batchId}</p>
              <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 font-mono">
                {batch.unitCount} Units
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium"> Registered on Chain: {batch.regDate} </p>
          </div>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
          batch.active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {batch.active ? "● ACTIVE" : "○ DEACTIVATED"}
        </span>
      </div>

      {isOpen && (
        <div className="p-6 bg-slate-950/40 animate-fadeIn">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 opacity-40">
                <Calendar size={12} className="text-slate-100" />
                <p className="text-[10px] text-slate-100 uppercase font-black tracking-widest">Mfg Date</p>
              </div>
              <p className="text-sm font-bold text-slate-200">{batch.mfgDate}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 opacity-40">
                <Info size={12} className="text-slate-100" />
                <p className="text-[10px] text-slate-100 uppercase font-black tracking-widest">Expiry Date</p>
              </div>
              <p className="text-sm font-bold text-slate-200">{batch.expDate}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-white/5"></span> Serial Units <span className="flex-1 h-px bg-white/5"></span>
            </p>
            
            {/* 🔥 Units List Scrollbar Applied */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {batch.units.map((unit, index) => (
                <div key={index} className="flex flex-col p-3 bg-slate-900 rounded-xl border border-white/5 hover:border-blue-500/40 transition-all group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-blue-400">{unit.serial_no}</span>
                    <span className="text-[8px] text-blue-400 font-black bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/10">SECURE</span>
                  </div>
                  <p className="text-[9px] text-slate-600 font-mono truncate">Leaf: {unit.leaf}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-600/5 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={12} className="text-blue-500" />
              <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest">Merkle Proof Evidence</p>
            </div>
            <p className="text-[10px] font-mono text-slate-400 break-all leading-relaxed bg-slate-950 p-2 rounded border border-white/5">
                {batch.merkleRoot}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product: productContract } = useUser();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!productContract || !id) return;
        const productipfs = await productContract.getProduct(id);
        const res = await axios.get(`https://ipfs.io/ipfs/${productipfs[0]}`);
        const batchids = await productContract.getProductBatchIds(id);
        const fetchedBatches = [];

        for (const bId of batchids) {
          const batchData = await productContract.getBatch(id, bId);
          const ipfsResponse = await axios.get(`https://ipfs.io/ipfs/${batchData[2]}`);
          const json = ipfsResponse.data;
          const regDate = new Date(Number(batchData.timestamp) * 1000).toLocaleDateString('en-GB');

          fetchedBatches.push({
            batchId: bId.toString(),
            regDate: regDate,
            active: !batchData.isDeactivated,
            mfgDate: json.units[0]?.mfg_date || "N/A",
            expDate: json.units[0]?.expiry_date || "N/A",
            merkleRoot: json.merkleRoot,
            unitCount: json.units.length,
            units: json.units,
            ipfsHash: batchData[2]
          });
        }

        setProductDetails({
          name: res.data.productName,
          type: res.data.productType,
          description: res.data.productDescription,
          batches: fetchedBatches
        });

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, productContract]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing Chain Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] flex justify-center items-start p-4 md:p-10 font-sans overflow-hidden">
      <style>{scrollbarStyles}</style>
      
      {/* 🔥 Main Card Scrollbar Applied */}
      <div className="w-full max-w-4xl max-h-full bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/5 overflow-y-auto custom-scrollbar">
        
        {/* Top Header */}
        <div className="bg-slate-900/60 p-8 border-b border-white/5 relative overflow-hidden sticky top-0 z-20 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-500 text-[10px] font-black tracking-widest flex items-center gap-2 mb-8 hover:text-blue-400 transition-colors uppercase"
          >
            ← BACK TO HUB
          </button>
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{productDetails?.name}</h1>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest border border-blue-500/20 rounded-md">
                   {productDetails?.type}
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter"> PID: {id.substring(0, 14)}... </span>
              </div>
            </div>
            <div className="hidden sm:block">
               <Box className="text-slate-800" size={60} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="p-8 pb-4">
          <div className="bg-slate-950/60 border-l-[3px] border-blue-600 p-5 rounded-r-2xl border-y border-r border-white/5">
            <p className="text-slate-400 text-sm leading-relaxed font-medium italic"> "{productDetails?.description}" </p>
          </div>
        </div>

        {/* Batch History Section */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-100">Live Inventory</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Batches on Ledger</p>
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
              onClick={() => navigate('/m/create/batch/')}
            >
              <Plus size={14} strokeWidth={3} /> NEW BATCH
            </button>
          </div>

          <div className="space-y-4 pb-10">
            {productDetails?.batches.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-[2rem] border-white/10 bg-slate-950/30">
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No ledger entries found.</p>
              </div>
            ) : (
              productDetails?.batches.map((batch, i) => (
                <BatchItem key={i} batch={batch} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}