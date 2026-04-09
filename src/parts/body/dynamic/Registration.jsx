import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ShieldCheck, Factory, User, Loader2, Sparkles, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UsersProvider.jsx";
import { useConnect } from "../../providers/ConnectProvider.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Register() {
  const { registry } = useUser();
  const { isConnected, walletAddress } = useConnect();
  const [loading, setLoading] = useState(false);

  const [customdata, setCustomdata] = useState({ username: "", accType: "", contact: "" });
  const [custermstate, setCustermstate] = useState(false);
  const [manufactdata, setManufactdata] = useState({ company: "", owner: "", email: "" });
  const [manterms, setManterms] = useState(false);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleManufacturerChange = (e) => {
    const { name, value } = e.target;
    setManufactdata((prev) => ({ ...prev, [name]: value }));
  };

  const registerCustomer = async (e) => {
    e.preventDefault();
    if (!registry) return;
    setLoading(true);
    try {
      const tx = await registry.registerCustomer(
        customdata.username.toLowerCase(), 
        Number(customdata.accType), 
        customdata.contact,
        {
          maxFeePerGas: 30000000000,      // 30 Gwei
          maxPriorityFeePerGas: 30000000000 // 30 Gwei
        }
      );
      await tx.wait();
      window.location.reload();
    } catch (err) { 
      alert(err.reason || "Registration Failed"); 
    } finally { setLoading(false); }
  };

  const registerManufacturer = async (e) => {
    e.preventDefault();
    if (!registry) return;
    setLoading(true);
    try {
      const stakeAmount = await registry.STAKE_AMOUNT();
      const tx = await registry.registerManufacturer(
        manufactdata.owner, 
        manufactdata.company.toLowerCase(), 
        manufactdata.email, 
        { value: stakeAmount }
      );
      await tx.wait();
      window.location.reload();
    } catch (err) { 
      alert(err.reason || "Transaction Failed"); 
    } finally { setLoading(false); }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 bg-[#020617]">
        <div className="bg-blue-500/10 p-6 rounded-full animate-bounce border border-blue-500/20">
          <Wallet className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Wallet Not Connected</h2>
        <p className="text-slate-400 max-w-[250px] text-sm">Please connect your wallet to access MetaMark Registration.</p>
        <ConnectButton />
      </div>
    );
  }

  if (isConnected && !registry) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4 bg-[#020617]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="font-bold text-slate-300">Syncing with Blockchain...</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Network: Polygon Amoy</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] text-white flex flex-col items-center p-4 py-10 font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md shadow-2xl rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden">
        <CardHeader className="text-center pb-4 pt-10">
          <div className="mx-auto bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-blue-500/30 mb-4 shadow-blue-500/10">
             <ShieldCheck className="text-blue-500 h-8 w-8" /> 
          </div>
          <CardTitle className="text-3xl font-black text-white tracking-tight leading-none">MetaMark</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Authenticated Supply Chain</CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-10">
          <Tabs defaultValue="manufacturer" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 h-12 bg-slate-950/50 p-1 rounded-xl border border-white/5">
              <TabsTrigger value="manufacturer" className="rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Manufacturer</TabsTrigger>
              <TabsTrigger value="consumer" className="rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Consumer</TabsTrigger>
            </TabsList>

            {/* MANUFACTURER */}
            <TabsContent value="manufacturer" className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Name</Label>
                <Input name="company" className="h-12 rounded-xl bg-slate-950/50 border-white/10 text-white placeholder:text-slate-700 focus:ring-blue-500/50 focus:border-blue-500/50" placeholder="e.g. Nike" value={manufactdata.company} onChange={handleManufacturerChange} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Owner Name</Label>
                <Input name="owner" className="h-12 rounded-xl bg-slate-950/50 border-white/10 text-white placeholder:text-slate-700" placeholder="Full Name" value={manufactdata.owner} onChange={handleManufacturerChange} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email / Website</Label>
                <Input name="email" className="h-12 rounded-xl bg-slate-950/50 border-white/10 text-white placeholder:text-slate-700" placeholder="contact@brand.com" value={manufactdata.email} onChange={handleManufacturerChange} />
              </div>
              
              <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 backdrop-blur-sm">
                <Checkbox id="manterms" className="mt-0.5 h-4 w-4 border-blue-500/30 data-[state=checked]:bg-blue-500" checked={manterms} onCheckedChange={(v) => setManterms(v === true)} />
                <Label htmlFor="manterms" className="text-[10px] leading-relaxed text-blue-400 font-medium">
                  I agree to stake 0.01 MATIC for protocol verification and security.
                </Label>
              </div>

              <Button 
                className="w-full h-14 text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 border-none mt-2" 
                disabled={!manterms || loading} 
                onClick={registerManufacturer}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize & Register"}
              </Button>
            </TabsContent>

            {/* CONSUMER */}
            <TabsContent value="consumer" className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</Label>
                <Input name="username" className="h-12 rounded-xl bg-slate-950/50 border-white/10 text-white placeholder:text-slate-700" placeholder="@nickname" value={customdata.username} onChange={handleCustomerChange} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Type</Label>
                <Select onValueChange={(v) => setCustomdata((p) => ({ ...p, accType: v }))}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Select Profile" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-slate-900 border-white/10 text-white">
                    <SelectItem value="0">Individual</SelectItem>
                    <SelectItem value="1">Wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Bio</Label>
                <textarea 
                   name="contact"
                   className="w-full min-h-[100px] p-4 rounded-xl bg-slate-950/50 border border-white/10 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                   placeholder="Tell us about your interest in supply chain transparency..."
                   value={customdata.contact}
                   onChange={handleCustomerChange}
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <Checkbox id="custterms" className="h-4 w-4 border-slate-700 data-[state=checked]:bg-slate-200 data-[state=checked]:text-white" checked={custermstate} onCheckedChange={(v) => setCustermstate(v === true)} />
                <Label htmlFor="custterms" className="text-[10px] text-slate-500 font-medium tracking-tight">Accept MetaMark's decentralized policy</Label>
              </div>
              <Button 
                className="w-full h-14 text-xs font-black uppercase tracking-widest bg-white text-white hover:bg-slate-200 rounded-2xl shadow-xl transition-all active:scale-95 border-none mt-2" 
                disabled={!custermstate || loading} 
                onClick={registerCustomer}
              >
                 {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Consumer Setup"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Wallet Info Badge */}
      <div className="mt-10 py-2.5 px-5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl">
        <p className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          NETWORK: AMOY POLYGON | <span className="text-slate-300">{walletAddress?.substring(0,6)}...{walletAddress?.substring(38)}</span>
        </p>
      </div>
    </div>
  );
}