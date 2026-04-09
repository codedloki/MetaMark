import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../../providers/UsersProvider";
import { MerkleTree } from "merkletreejs";
import { ethers, keccak256, toUtf8Bytes, BrowserProvider } from "ethers";
import jsPDF from "jspdf";
import { useConnect } from "../../../../providers/ConnectProvider";
import QRCode from "qrcode";
import { FileUp, Package, ShieldCheck, Download, Loader2, Info } from "lucide-react";

const SECRET_SALT = import.meta.env.VITE_QR_SALT || "METAMARK_PRIVATE_KEY_2026";

function AddBatch() {
  const { product } = useUser();
  const { walletAddress, signer: contextSigner } = useConnect(); 

  const [batchId, setBatchId] = useState("");
  const [productId, setProductId] = useState("");
  const [koa, setkoa] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product || !walletAddress) return;
    const loadProducts = async () => {
      try {
        const productIds = await product.getProductsByManufacturer(walletAddress);
        const temp = [];
        for (const id of productIds) {
          const prod = await product.getProduct(id);
          const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${prod.details}`);
          temp.push({ productId: id, ...res.data });
        }
        setkoa(temp);
      } catch (err) { console.error("Load Error:", err); }
    };
    loadProducts();
  }, [product, walletAddress]);

  const processBatch = async (text) => {
    try {
      if (!productId || !batchId) {
        setError("Please select Product and enter Batch ID first!");
        return;
      }
      const lines = text.trim().split(/\r?\n/).filter(line => line.trim() !== "");
      if (lines.length <= 1) throw new Error("CSV is empty");

      const parsedRows = lines.slice(1).map(line => {
        const [serial_no, mfg_date, expiry_date] = line.split(",").map(v => v.trim());
        return { serial_no, mfg_date, expiry_date };
      });

      const leaves = parsedRows.map(row => 
        keccak256(toUtf8Bytes(productId + batchId + row.serial_no + SECRET_SALT))
      );

      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const root = tree.getHexRoot();
      setMerkleRoot(root);

      const units = parsedRows.map((row, i) => ({
        ...row,
        leaf: leaves[i],
        proof: tree.getHexProof(leaves[i])
      }));

      setCsvData(units);
      setSuccess(`Manifest Ready: ${units.length} unique units generated! 🔐`);
      setError("");
    } catch (err) { setError("Invalid CSV or logic error."); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => processBatch(e.target.result);
    reader.readAsText(file);
    setCsvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchId || !productId || csvData.length === 0) return setError("Please fill all fields");

    setLoading(true);
    try {
      let activeSigner = contextSigner;
      if (!activeSigner && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        activeSigner = await provider.getSigner();
      }

      if (!activeSigner) throw new Error("No wallet connected!");

      const message = ethers.solidityPackedKeccak256(
        ["bytes32", "uint256", "bytes32"],
        [productId, BigInt(batchId), merkleRoot]
      );
      
      const signature = await activeSigner.signMessage(ethers.toBeArray(message));

      const manifestData = {
        productId,
        batchId,
        merkleRoot,
        signature,
        manufacturer: walletAddress,
        units: csvData
      };

      const blob = new Blob([JSON.stringify(manifestData)], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "signed_manifest.json");

      const ipfsRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_SECRET}` }
      });

      const tx = await product.addBatch(productId, BigInt(batchId), ipfsRes.data.IpfsHash, merkleRoot,{
          maxFeePerGas: 30000000000,      // 30 Gwei
          maxPriorityFeePerGas: 30000000000 // 30 Gwei
        });
      await tx.wait();
      
      setSuccess("Batch Signed & Registered! QR Labels Ready. 🛡️");
    } catch (err) { 
      setError(`Error: ${err.reason || err.message}`); 
    } finally { setLoading(false); }
  };

  const downloadPDF = async () => {
    if (csvData.length === 0) return;
    const pdf = new jsPDF();
    for (let i = 0; i < csvData.length; i++) {
      const item = csvData[i];
      const qrPayload = JSON.stringify({ p: productId, b: batchId, l: item.leaf });
      const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1 });
      const x = (i % 2) * 105 + 10;
      const y = Math.floor((i % 6) / 2) * 90 + 20;
      if (i > 0 && i % 6 === 0) pdf.addPage();
      pdf.setDrawColor(200);
      pdf.roundedRect(x, y, 95, 80, 5, 5, 'D');
      pdf.addImage(qrDataUrl, "PNG", x + 22, y + 5, 50, 50);
      pdf.setFontSize(8);
      pdf.text(`PID: ${productId.substring(0, 15)}...`, x + 5, y + 60);
      pdf.text(`BATCH: ${batchId} | MFG: ${item.mfg_date}`, x + 5, y + 66);
      pdf.text(`SERIAL: ${item.serial_no}`, x + 5, y + 72);
    }
    pdf.save(`Signed_Labels_B${batchId}.pdf`);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] overflow-y-auto flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-8 md:p-12 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-10 text-center relative z-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-6 shadow-inner">
            <Package size={32} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none italic">Deploy Batch</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Immutable Supply Chain Execution</p>
          {!walletAddress && <div className="mt-4 flex items-center justify-center gap-2 text-rose-500 font-bold text-xs"><Info size={14}/> Wallet Not Detected!</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Product</label>
              <select 
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/50 text-slate-200 transition-all"
                value={productId} onChange={(e) => setProductId(e.target.value)}
              >
                <option value="" className="bg-slate-900">-- Choose Product --</option>
                {koa.map(p => <option key={p.productId} value={p.productId} className="bg-slate-900">{p.productName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Batch Number</label>
              <input 
                type="number" className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/50 text-slate-200"
                placeholder="Ex: 101" value={batchId} onChange={(e) => setBatchId(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inventory Manifest (CSV)</label>
            <div className="relative border-2 border-dashed border-white/10 p-10 rounded-[2rem] text-center hover:bg-white/5 transition-all group cursor-pointer">
              <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              <FileUp className="mx-auto text-slate-600 group-hover:text-blue-400 mb-3 transition-colors" size={40} />
              <p className="text-slate-400 font-bold text-sm tracking-tight">{csvFile ? csvFile.name : "Drop Manifest CSV Here"}</p>
              <p className="text-[9px] text-slate-600 mt-2 uppercase">Format: Serial, Mfg_Date, Exp_Date</p>
            </div>
          </div>

          {error && <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 animate-shake">{error}</div>}
          {success && <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">{success}</div>}

          <button 
            type="submit" 
            disabled={loading || !merkleRoot || !walletAddress} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-600 active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20}/>}
            {loading ? "Establishing Proof..." : "Sign & Deploy to Chain"}
          </button>
        </form>

        {csvData.length > 0 && (
          <button onClick={downloadPDF} className="w-full mt-4 bg-slate-800/50 hover:bg-slate-800 text-blue-400 font-black py-5 rounded-[1.5rem] border border-white/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <Download size={18} /> Download {csvData.length} Encrypted Labels
          </button>
        )}

        <div className="mt-8 flex items-center justify-center gap-3 opacity-20">
          <div className="h-px w-8 bg-slate-500" />
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Amoy Network Verified</p>
          <div className="h-px w-8 bg-slate-500" />
        </div>
      </div>
    </div>
  );
}

export default AddBatch;