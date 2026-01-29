import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ShieldCheck, Factory, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UsersProvider.jsx";

export default function Register() {
  const { registry } = useUser();

  const [address, setAddress] = useState("");

  /* =======================
     CONSUMER STATE
  ======================= */
  const [customdata, setCustomdata] = useState({
    username: "",
    accType: "",
    contact: "",
  });
  const [custermstate, setCustermstate] = useState(false);
  const [custErrors, setCustErrors] = useState({});

  /* =======================
     MANUFACTURER STATE
  ======================= */
  const [manufactdata, setManufactdata] = useState({
    company: "",
    owner: "",
    email: "",
  });
  const [manterms, setManterms] = useState(false);
  const [manErrors, setManErrors] = useState({});

  /* =======================
     WALLET
  ======================= */
  useEffect(() => {
    const getWallet = async () => {
      if (!window.ethereum) return alert("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    };

    getWallet();
  }, []);

  /* =======================
     HANDLERS
  ======================= */
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleManufacturerChange = (e) => {
    const { name, value } = e.target;
    setManufactdata((prev) => ({ ...prev, [name]: value }));
  };

  /* =======================
     VALIDATION
  ======================= */
  const validateConsumer = () => {
    const errors = {};

    if (!customdata.username || customdata.username.length < 3)
      errors.username = "Username must be at least 3 characters";

    if (!/^[a-zA-Z0-9_]+$/.test(customdata.username))
      errors.username = "Username must be alphanumeric";

    if (customdata.accType === "")
      errors.accType = "Account type is required";

    if (!customdata.contact || customdata.contact.length < 5)
      errors.contact = "Contact must be at least 5 characters";

    if (!custermstate)
      errors.terms = "You must accept terms";

    setCustErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateManufacturer = () => {
    const errors = {};

    if (!manufactdata.company || manufactdata.company.length < 3)
      errors.company = "Company name must be at least 3 characters";

    if (!manufactdata.owner || manufactdata.owner.length < 3)
      errors.owner = "Owner name must be at least 3 characters";

    if (!manufactdata.email)
      errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manufactdata.email))
      errors.email = "Invalid email format";

    if (!manterms)
      errors.terms = "You must accept terms";

    setManErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* =======================
     SUBMIT
  ======================= */
  const registerCustomer = async (e) => {
    e.preventDefault();
    if (!validateConsumer()) return;

    await registry.registerCustomer(
      customdata.username,
      Number(customdata.accType),
      customdata.contact
    );

    console.log("Customer registered");
    window.location.reload(true)
  };

  const registerManufacturer = async (e) => {
    e.preventDefault();
    if (!validateManufacturer()) return;

    console.log("Manufacturer registered", manufactdata);
    const stakeAmount = await registry.STAKE_AMOUNT()
     console.log("Stake amount (wei):", stakeAmount.toString());
     const fun = await registry.interface.getFunction("registerManufacturer")
     console.log("Function state :" , fun )

     const tx = await registry.registerManufacturer(manufactdata.owner,manufactdata.company,manufactdata.email,{
      value:stakeAmount
     })

     console.log("Transaction sent:",tx.hash)
     await tx.wait()
     alert("Manufacturer Registered Successfully")
     window.location.reload(true)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold flex justify-center gap-2">
            <ShieldCheck className="text-blue-600" /> MetaMark Registration
          </CardTitle>
          <CardDescription>
            Blockchain-based product verification system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="manufacturer">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="manufacturer"><Factory /> Manufacturer</TabsTrigger>
              <TabsTrigger value="consumer"><User /> Consumer</TabsTrigger>
            </TabsList>

            {/* ================= MANUFACTURER ================= */}
            <TabsContent value="manufacturer">
              <form className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Company</Label>
                  <Input name="company" value={manufactdata.company} onChange={handleManufacturerChange} />
                  {manErrors.company && <p className="text-red-500 text-sm">{manErrors.company}</p>}
                </div>

                <div>
                  <Label>Owner</Label>
                  <Input name="owner" value={manufactdata.owner} onChange={handleManufacturerChange} />
                  {manErrors.owner && <p className="text-red-500 text-sm">{manErrors.owner}</p>}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input name="email" value={manufactdata.email} onChange={handleManufacturerChange} />
                  {manErrors.email && <p className="text-red-500 text-sm">{manErrors.email}</p>}
                </div>

                <div>
                  <Label>Wallet</Label>
                  <Input value={address} disabled />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <Checkbox checked={manterms} onCheckedChange={(v) => setManterms(v === true)} />
                  <Label>Accept terms</Label>
                </div>
                {manErrors.terms && <p className="text-red-500 text-sm col-span-2">{manErrors.terms}</p>}

                <Button className="col-span-2" disabled={!manterms} onClick={registerManufacturer}>
                  Register as Manufacturer
                </Button>
              </form>
            </TabsContent>

            {/* ================= CONSUMER ================= */}
            <TabsContent value="consumer">
              <form className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Username</Label>
                  <Input name="username" value={customdata.username} onChange={handleCustomerChange} />
                  {custErrors.username && <p className="text-red-500 text-sm">{custErrors.username}</p>}
                </div>

                <div>
                  <Label>Account Type</Label>
                  <Select
                    value={customdata.accType}
                    onValueChange={(v) => setCustomdata((p) => ({ ...p, accType: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Individual</SelectItem>
                      <SelectItem value="1">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  {custErrors.accType && <p className="text-red-500 text-sm">{custErrors.accType}</p>}
                </div>

                <div>
                  <Label>Contact</Label>
                  <Input name="contact" value={customdata.contact} onChange={handleCustomerChange} />
                  {custErrors.contact && <p className="text-red-500 text-sm">{custErrors.contact}</p>}
                </div>

                <div>
                  <Label>Wallet</Label>
                  <Input value={address} disabled />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <Checkbox checked={custermstate} onCheckedChange={(v) => setCustermstate(v === true)} />
                  <Label>Accept terms</Label>
                </div>
                {custErrors.terms && <p className="text-red-500 text-sm col-span-2">{custErrors.terms}</p>}

                <Button className="col-span-2 text-white" disabled={!custermstate} onClick={registerCustomer}>
                  Register as Consumer
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
