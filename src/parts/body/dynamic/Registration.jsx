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

  /* =======================
     SUBMIT LOGIC
  ======================= */
  const registerCustomer = async (e) => {
    e.preventDefault();
    if (!registry) return;
    setLoading(true);
    try {
      const tx = await registry.registerCustomer(
        customdata.username.toLowerCase(), 
        Number(customdata.accType), 
        customdata.contact
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

  /* =======================
     CONDITIONAL STATES
  ======================= */
  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="bg-blue-100 p-6 rounded-full animate-bounce">
          <Wallet className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Wallet Not Connected</h2>
        <p className="text-slate-500 max-w-[250px]">Please connect your wallet to access MetaMark Registration.</p>
        <ConnectButton />
      </div>
    );
  }

  if (isConnected && !registry) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-bold text-slate-600">Syncing with Blockchain...</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Network: Polygon Amoy</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col items-center p-4 py-6 font-sans">
      <Card className="w-full max-w-md shadow-2xl rounded-[2.5rem] border-none bg-white">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-3">
             <ShieldCheck className="text-white h-7 w-7" /> 
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">MetaMark</CardTitle>
          <CardDescription className="text-xs">Blockchain-Secured Supply Chain</CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-8">
          <Tabs defaultValue="manufacturer" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 h-12 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="manufacturer" className="rounded-lg text-xs font-bold">Manufacturer</TabsTrigger>
              <TabsTrigger value="consumer" className="rounded-lg text-xs font-bold">Consumer</TabsTrigger>
            </TabsList>

            {/* MANUFACTURER */}
            <TabsContent value="manufacturer" className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Company Name</Label>
                <Input name="company" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="e.g. Nike" value={manufactdata.company} onChange={handleManufacturerChange} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Owner Name</Label>
                <Input name="owner" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Full Name" value={manufactdata.owner} onChange={handleManufacturerChange} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email / Website</Label>
                <Input name="email" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="contact@brand.com" value={manufactdata.email} onChange={handleManufacturerChange} />
              </div>
              
              <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <Checkbox id="manterms" className="mt-0.5 h-4 w-4" checked={manterms} onCheckedChange={(v) => setManterms(v === true)} />
                <Label htmlFor="manterms" className="text-[10px] leading-relaxed text-blue-900 font-semibold">
                  I agree to stake 0.01 MATIC for protocol verification and security.
                </Label>
              </div>

              <Button 
                className="w-full h-14 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-2xl shadow-xl transition-all active:scale-95" 
                disabled={!manterms || loading} 
                onClick={registerManufacturer}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Register as Manufacturer"}
              </Button>
            </TabsContent>

            {/* CONSUMER */}
            <TabsContent value="consumer" className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</Label>
                <Input name="username" className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="@nickname" value={customdata.username} onChange={handleCustomerChange} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Account Type</Label>
                <Select onValueChange={(v) => setCustomdata((p) => ({ ...p, accType: v }))}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Select Profile" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="0">Individual</SelectItem>
                    <SelectItem value="1">Wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Your Bio</Label>
                <textarea 
                   name="contact"
                   className="w-full min-h-[80px] p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Tell us about yourself..."
                   value={customdata.contact}
                   onChange={handleCustomerChange}
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <Checkbox id="custterms" className="h-4 w-4" checked={custermstate} onCheckedChange={(v) => setCustermstate(v === true)} />
                <Label htmlFor="custterms" className="text-[10px] text-slate-500 font-medium">Accept MetaMark's decentralized policy</Label>
              </div>
              <Button 
                className="w-full h-14 text-sm font-bold bg-slate-900 text-white rounded-2xl shadow-xl transition-all active:scale-95" 
                disabled={!custermstate || loading} 
                onClick={registerCustomer}
              >
                 {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Consumer Setup"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-8 py-2 px-4 bg-white/50 border border-white rounded-2xl shadow-sm">
        <p className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          AMOY: {walletAddress?.substring(0,6)}...{walletAddress?.substring(38)}
        </p>
      </div>
    </div>
  );
}