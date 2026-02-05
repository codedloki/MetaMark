import React from "react"
import { Button } from "../../../components/ui/button"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { 
  ShieldCheck, 
  Zap, 
  QrCode, 
  ChevronRight, 
  Database, 
  Lock 
} from "lucide-react"

function Home() {
  const navigate = useNavigate();

  return (
    <ScrollArea className="h-screen bg-[#020617]">
      <div className="w-full font-sans text-slate-100">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-6">
          {/* Neon Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-fade-in backdrop-blur-md">
                <ShieldCheck size={14} /> Powered by Polygon Amoy Blockchain
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Verify Product <br /> 
                <span className="text-blue-500">Authenticity</span> <br /> 
                Instantly.
              </h1>

              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Eliminate counterfeits and secure your supply chain using our 
                decentralized verification protocol. Fast, secure, and immutable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-7 rounded-2xl text-sm font-black tracking-widest transition-all shadow-lg shadow-blue-900/40 active:scale-95 border-none"
                >
                  GET STARTED <ChevronRight size={18} className="ml-2" />
                </Button>

                <Button 
                  variant="outline" 
                  className="border-slate-800 bg-slate-900/50 text-slate-300 px-8 py-7 rounded-2xl text-sm font-black tracking-widest hover:bg-slate-800 hover:text-white transition-all active:scale-95 backdrop-blur-sm"
                >
                  WHITEPAPER
                </Button>
              </div>
            </div>

            {/* Right: Image Section */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg animate-float">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full -z-10" />
                <img
                  src="https://media.istockphoto.com/id/1132091431/vector/verification-application-scanning-qr-code-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=m2Sw8mN3tdRm6OwgBGmzElz1M2AFlkyHmTaMLupk-b0="
                  alt="Verification Illustration"
                  className="rounded-[3rem] shadow-2xl border-8 border-slate-900 grayscale-[0.2] brightness-[0.8] hover:brightness-100 transition-all duration-700"
                />
                
                {/* Floating Dark Badge */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900/80 p-6 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <Zap size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-500 uppercase">Latency</p>
                    <p className="text-sm font-bold text-slate-200">0.8s Verification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / HOW IT WORKS */}
        <section className="bg-slate-950/50 py-24 border-y border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Core Ecosystem</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-16 uppercase tracking-tight">Trust but verify.</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard 
                icon={<Lock size={28} />}
                title="Manufacturer Registry"
                desc="Authorized producers register assets on a tamper-proof ledger."
              />
              <FeatureCard 
                icon={<Database size={28} />}
                title="Blockchain Storage"
                desc="Every batch is cryptographically linked and stored across the network."
              />
              <FeatureCard 
                icon={<QrCode size={28} />}
                title="Consumer Scanning"
                desc="Instantly verify the journey of your product via unique QR roots."
              />
            </div>
          </div>
        </section>
        
        <div className="h-20" />
      </div>
    </ScrollArea>
  )
}

/* Reusable Feature Component - Dark Version */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="group flex flex-col items-center text-center p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500 backdrop-blur-sm">
    <div className="mb-6 p-5 bg-slate-950 rounded-2xl text-blue-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

export default Home