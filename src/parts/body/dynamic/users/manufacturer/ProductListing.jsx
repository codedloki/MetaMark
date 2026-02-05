import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnect } from "../../../../providers/ConnectProvider";
import { useUser } from "../../../../providers/UsersProvider";
import axios from "axios";
// Modern Lucide Icons
import { Package, ChevronRight, Info, Loader2 } from "lucide-react";

export default function ProductListing() {
  const navigate = useNavigate();
  const { walletAddress } = useConnect();
  const { product } = useUser();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getmyproducts = async () => {
      try {
        if (!walletAddress || !product) return;
        setFetching(true);
        const productci = await product.getProductsByManufacturer(walletAddress);
        console.log(productci)

        setProducts([]);
        // Sequential fetch to maintain order and prevent rate limits
        for (const id of productci) {
          try {
            const productipfs = await product.getProduct(id);
            const res = await axios.get(`https://ipfs.io/ipfs/${productipfs[0]}`);

            const newProduct = {
              id: id,
              name: res.data.productName || "Unnamed Product",
              batches: [
                { batchId: "P-001", active: true },
                { batchId: "P-002", active: false },
              ]
            };
            setProducts(prevProducts => [...prevProducts, newProduct]);
          } catch (innerError) {
            console.error(`Error fetching IPFS for ID ${id}:`, innerError);
          }
        }
      } catch (error) {
        console.log("Global Error Occured:", error);
      } finally {
        setFetching(false);
      }
    };
    getmyproducts();
  }, [walletAddress, product]);

  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] flex justify-center items-start md:items-center p-4 md:p-10 font-sans text-slate-100">
      
      {/* Main Container: Glassmorphism effect */}
      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/20 shadow-inner">
              <Package className="text-blue-500" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">My Catalog</h2>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Blockchain Assets</p>
            </div>
          </div>
          
          {fetching && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-white/5">
              <Loader2 className="animate-spin text-blue-500" size={14} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Syncing...</span>
            </div>
          )}
        </div>

        {products.length === 0 && !fetching ? (
          <div className="py-20 text-center bg-slate-950/30 rounded-[2.5rem] border border-dashed border-white/10 group transition-all">
            <Info className="mx-auto text-slate-700 mb-4 group-hover:text-blue-500/50 transition-colors" size={48} />
            <p className="text-slate-500 font-medium italic">
              Your decentralized product registry is currently empty.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 relative z-10">
            {products.map((p, index) => {
              const activeCount = p.batches?.filter(b => b.active).length || 0;
              const expiredCount = p.batches?.filter(b => !b.active).length || 0;

              return (
                <div 
                  key={p.id || index} 
                  className="group relative flex justify-between items-center p-5 rounded-[1.8rem] bg-slate-900/60 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-950 items-center justify-center text-blue-500 font-bold border border-white/5 group-hover:scale-105 transition-transform shadow-inner">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 mb-1.5 group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-500/10">
                          Active: {activeCount}
                        </span>
                        {/* <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/5">
                          Expired: {expiredCount}
                        </span> */}
                      </div>
                    </div>
                  </div>

                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 uppercase tracking-widest"
                    onClick={() => navigate(`/m/product/${p.id}`)}
                  >
                    View <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* IPFS Status Footer */}
        <div className="mt-10 flex items-center justify-center gap-3 opacity-30">
          <div className="h-[1px] w-8 bg-slate-500"></div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
            IPFS Node Connected
          </p>
          <div className="h-[1px] w-8 bg-slate-500"></div>
        </div>
      </div>
    </div>
  );
}