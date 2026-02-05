import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  QrCode, 
  History, 
  ShieldCheck, 
  Search, 
  Star, 
  ChevronRight,
  Info,
  Activity,
  Zap,
  CheckCircle2,
  Loader2,
  MessageSquare, // New Icon
  ArrowUpRight // New Icon
} from "lucide-react";

// ✅ Firebase & Provider Imports
import { db } from "../../../../../lib/firebase"; 
import { ref, onValue } from "firebase/database";
import { useConnect } from "../../../../providers/ConnectProvider";

// --- Custom Scrollbar CSS ---
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
`;

export default function CustomerDash() {
  const navigate = useNavigate();
  const { walletAddress } = useConnect();

  // State Management
  const [totalScans, setTotalScans] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================== FETCH REAL HISTORY FROM FIREBASE ========================
  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const historyRef = ref(db, `user_history/${walletAddress}/scans`);

    const unsubscribe = onValue(historyRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const historyArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          historyArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setHistory(historyArray);
          setTotalScans(historyArray.length);
        } else {
          setHistory([]);
          setTotalScans(0);
        }
      } catch (err) {
        console.error("Firebase Read Error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [walletAddress]);

  return (
    <div className="h-screen w-full bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] overflow-y-auto custom-scrollbar font-sans text-slate-100 selection:bg-indigo-500/30">
      <style>{scrollbarStyles}</style>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex flex-col items-center justify-start p-4 md:p-12 min-h-full relative z-10">
        
        {/* Header */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-10 px-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl shadow-xl shadow-indigo-900/20 text-indigo-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none text-nowrap">Consumer Vault</h1>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-[0.2em]">
                {walletAddress ? `ID: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : "Authenticated Session"}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Node: Amoy Mainnet</span>
          </div>
        </div>

        {/* --- HERO ACTION: SCAN --- */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 relative group overflow-hidden bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-2xl border border-white/5 transition-all hover:border-indigo-500/30">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700 pointer-events-none">
              <QrCode size={220} className="text-white" />
            </div>
            
            <div className="relative z-10 max-w-md text-left">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-indigo-400 fill-indigo-400" />
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Instant P2P Validation</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
                Is your product <br /> <span className="text-indigo-500">Authentic?</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed pr-6">
                Scan the cryptographic QR code to verify the origin, batch history, and blockchain signature in real-time.
              </p>
              
              <button 
                onClick={() => navigate('/c/scan')}
                className="group flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all active:scale-95 uppercase"
              >
                <QrCode size={20} /> Launch Scanner
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div>
              <div className="flex items-center gap-3 mb-2 opacity-80">
                <Activity size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">Global Statistics</p>
              </div>
              <h3 className="text-2xl font-black leading-tight">Total Scans <br /> Performed</h3>
            </div>
            
            <div className="mt-8">
               <div className="text-6xl font-black tracking-tighter mb-2">{totalScans}</div>
               <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                       style={{ width: `${Math.min(totalScans * 4, 100)}%` }} />
               </div>
               <p className="text-[10px] font-bold mt-4 text-indigo-100 uppercase tracking-tight">Protecting the Network</p>
            </div>
          </div>
        </div>

        {/* --- 🔥 NEW: REDIRECT TO CHAT SECTION --- */}
        <div 
          onClick={() => navigate('/chat')}
          className="w-full max-w-5xl bg-emerald-500/10 border border-emerald-500/20 p-6 mb-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer group hover:bg-emerald-500/20 transition-all duration-300 backdrop-blur-md"
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Support & Inquiry Channel</h3>
              <p className="text-emerald-400/80 text-xs font-medium uppercase tracking-widest mt-1">Chat directly with manufacturers on-chain</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
            Open Secure Chat <ArrowUpRight size={16} />
          </div>
        </div>

        {/* --- BOTTOM GRID --- */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Recent Scans */}
          <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/5 shadow-2xl text-left min-h-[400px]">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                <History className="text-indigo-500" size={22} /> Recent History
              </h3>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Accessing Ledger...</p>
                </div>
              ) : history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="p-3 bg-slate-900 rounded-2xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                        <Search size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-slate-200 leading-tight truncate">
                          {item.productName || "Secured Product"}
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-1">
                          {item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          }) : "Recent"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
                  <Info size={32} className="mb-2" />
                  <p className="text-sm tracking-tight text-center">No recent activity detected on-chain.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 bg-indigo-500/5 backdrop-blur-sm p-8 rounded-[3.5rem] border border-indigo-500/20 flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                    <Star className="text-white fill-white" size={14} />
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Safety Protocol</p>
                </div>
                <h4 className="text-xl font-black text-white mb-3 leading-tight tracking-tight">Check the Merkle Proof</h4>
                <p className="text-sm font-medium text-slate-400 leading-relaxed pr-4">
                  Always ensure the QR code leads to this official portal to confirm blockchain signature validity and prevent phishing.
                </p>
              </div>
              <button className="mt-8 flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] hover:translate-x-2 transition-transform">
                Read Security Guide <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
               <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-500">
                  <Info size={20} />
               </div>
               <p className="text-xs font-bold text-slate-500 leading-snug">
                  Protecting consumers with <br /><span className="text-indigo-400 uppercase tracking-widest text-[10px]">Web3 Multi-Signature Verification.</span>
               </p>
            </div>
          </div>

        </div>

        <div className="h-16 w-full" />
      </div>
    </div>
  );
}