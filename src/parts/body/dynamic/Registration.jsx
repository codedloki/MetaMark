import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ShieldCheck, Factory, User, Store } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            MetaMark Registration
          </CardTitle>
          <CardDescription className="text-gray-600 max-w-2xl mx-auto">
            MetaMark is a cutting-edge blockchain-based product verification system
            designed to ensure the authenticity of products and combat counterfeiting.
            Register to securely verify and track products in real-time using blockchain.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="manufacturer" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="manufacturer" className="flex gap-2">
                <Factory className="h-4 w-4" /> Manufacturer
              </TabsTrigger>
              <TabsTrigger value="retailer" className="flex gap-2">
                <Store className="h-4 w-4" /> Retailer
              </TabsTrigger>
              <TabsTrigger value="consumer" className="flex gap-2">
                <User className="h-4 w-4" /> Consumer
              </TabsTrigger>
            </TabsList>

            {/* Manufacturer */}
            <TabsContent value="manufacturer">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Company Name</Label>
                  <Input placeholder="ABC Manufacturing Pvt Ltd" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="company@email.com" />
                </div>
                <div>
                  <Label>Wallet Address</Label>
                  <Input placeholder="0x..." />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full">Register as Manufacturer</Button>
                </div>
              </form>
            </TabsContent>

            {/* Retailer */}
            <TabsContent value="retailer">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Store Name</Label>
                  <Input placeholder="Retail Store Name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="store@email.com" />
                </div>
                <div>
                  <Label>Wallet Address</Label>
                  <Input placeholder="0x..." />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full">Register as Retailer</Button>
                </div>
              </form>
            </TabsContent>

            {/* Consumer */}
            <TabsContent value="consumer">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="user@email.com" />
                </div>
                <div>
                  <Label>Wallet Address</Label>
                  <Input placeholder="0x..." />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full">Register as Consumer</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}