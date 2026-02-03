// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useUser } from "../../../../providers/UsersProvider";
// import { MerkleTree } from "merkletreejs";
// import { ethers, keccak256, toUtf8Bytes } from "ethers";
// import jsPDF from "jspdf";
// import { useConnect } from "../../../../providers/ConnectProvider";
// import QRCode from "qrcode";
// import { FileUp, Package, ShieldCheck, Download, Loader2 } from "lucide-react";

// // ✅ SECRET SALT: QR ko secure rakhne ke liye (Expose mat karna)
// const SECRET_SALT = import.meta.env.VITE_QR_SALT || "METAMARK_PRIVATE_KEY_2026";

// function AddBatch() {
//   const { product } = useUser();
//   const { walletAddress } = useConnect();

//   const [batchId, setBatchId] = useState("");
//   const [productId, setProductId] = useState("");
//   const [koa, setkoa] = useState([]);
//   const [csvFile, setCsvFile] = useState(null);
//   const [csvData, setCsvData] = useState([]);
//   const [merkleRoot, setMerkleRoot] = useState("");

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ======================== LOAD PRODUCTS ========================
//   useEffect(() => {
//     if (!product || !walletAddress) return;
//     const loadProducts = async () => {
//       try {
//         const productIds = await product.getProductsByManufacturer(walletAddress);
//         const temp = [];
//         for (const id of productIds) {
//           const prod = await product.getProduct(id);
//           const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${prod.details}`);
//           temp.push({ productId: id, ...res.data });
//         }
//         setkoa(temp);
//       } catch (err) { console.error("Load Error:", err); }
//     };
//     loadProducts();
//   }, [product, walletAddress]);

//   // ======================== SECURE MERKLE LOGIC ========================
//   const processBatch = async (text) => {
//     try {
//       // ✅ FIX: split(/\r?\n/) handles Windows/Linux line endings properly
//       const lines = text.trim().split(/\r?\n/).filter(line => line.trim() !== "");
//       if (lines.length <= 1) throw new Error("CSV is empty");

//       const parsedRows = lines.slice(1).map(line => {
//         const [serial_no, mfg_date, expiry_date] = line.split(",").map(v => v.trim());
//         return { serial_no, mfg_date, expiry_date };
//       });

//       // ✅ SALTED HASHING: Serial Number ko hide kiya
//       const leaves = parsedRows.map(row => 
//         keccak256(toUtf8Bytes(row.serial_no + SECRET_SALT))
//       );

//       const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
//       const root = tree.getHexRoot();
//       setMerkleRoot(root);

//       const units = parsedRows.map((row, i) => ({
//         ...row,
//         leaf: leaves[i],
//         proof: tree.getHexProof(leaves[i])
//       }));

//       setCsvData(units);
//       setSuccess(`Manifest Loaded: ${units.length} unique units sealed! 🔐`);
//       setError("");
//     } catch (err) {
//       setError("Invalid CSV: Ensure format is Serial,Mfg,Exp");
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => processBatch(e.target.result);
//     reader.readAsText(file);
//     setCsvFile(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!batchId || !productId || csvData.length === 0) return setError("Please fill all fields");

//     setLoading(true);
//     try {
//       const blob = new Blob([JSON.stringify({ productId, batchId, units: csvData })], { type: "application/json" });
//       const formData = new FormData();
//       formData.append("file", blob, "security_manifest.json");

//       const ipfsRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
//         headers: { Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_SECRET}` }
//       });

//       console.log(ipfsRes)

//       const tx = await product.addBatch(productId, BigInt(batchId), ipfsRes.data.IpfsHash, merkleRoot);
//       await tx.wait();
      
//       setSuccess("Batch Registered on Blockchain! Labels ready for download.");
//       // ✅ FIX: Don't clear csvData here so PDF can still be generated
//     } catch (err) { 
//       setError(`Blockchain Error: ${err.reason || "Check duplicate ID"}`); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   // ======================== FIXED PDF GENERATION ========================
//   const downloadPDF = async () => {
//     if (csvData.length === 0) return;
    
//     const pdf = new jsPDF();
//     const dataToPrint = [...csvData]; // Local copy for loop safety

//     for (let i = 0; i < dataToPrint.length; i++) {
//       const item = dataToPrint[i];
      
//       // ✅ ZERO EXPOSURE: QR holds only the leaf hash
//       const qrPayload = JSON.stringify({ p: productId, b: batchId, l: item.leaf });
//       const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1 });
      
//       const x = (i % 2) * 105 + 10;
//       const y = Math.floor((i % 6) / 2) * 90 + 20;
//       if (i > 0 && i % 6 === 0) pdf.addPage();

//       pdf.setDrawColor(220);
//       pdf.roundedRect(x, y, 95, 80, 5, 5, 'D');
//       pdf.addImage(qrDataUrl, "PNG", x + 22, y + 5, 50, 50);
      
//       pdf.setFontSize(8);
//       pdf.setTextColor(40);
//       pdf.text(`PID: ${productId.substring(0, 18)}...`, x + 5, y + 60);
//       pdf.text(`BATCH ID: ${batchId}`, x + 5, y + 66);
//       pdf.text(`MFG: ${item.mfg_date} | EXP: ${item.expiry_date}`, x + 5, y + 72);
      
//       // ✅ MASKED SERIAL: For human reference only
//       const maskedSerial = item.serial_no ? item.serial_no.replace(/.(?=.{4})/g, '*') : "N/A";
//       pdf.text(`SERIAL: ${maskedSerial}`, x + 5, y + 78);
//     }
//     pdf.save(`Secure_Labels_Batch_${batchId}.pdf`);
//   };

//   return (
//     <div className="h-screen w-full bg-[#f8fafc] overflow-y-auto scrollbar-hide flex items-center justify-center p-6 text-black">
//       <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 relative">
        
//         <div className="mb-10 text-center">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl mb-4 transition-transform hover:scale-110">
//             <ShieldCheck size={32} />
//           </div>
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Add Batch</h2>
//           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
//             Secure Cryptographic Unit Tracking
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase ml-1">Product</label>
//               <select 
//                 className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500"
//                 value={productId} 
//                 onChange={(e) => setProductId(e.target.value)}
//               >
//                 <option value="">Select Product</option>
//                 {koa.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase ml-1">Batch Number</label>
//               <input 
//                 type="number" 
//                 className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
//                 placeholder="Ex: 5001"
//                 value={batchId} 
//                 onChange={(e) => setBatchId(e.target.value)} 
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-black text-slate-500 uppercase ml-1">Inventory CSV</label>
//             <div className="relative group">
//               <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
//               <div className="border-2 border-dashed border-slate-200 p-10 rounded-[2rem] text-center group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
//                 <FileUp className="mx-auto text-slate-300 mb-2" size={32} />
//                 <p className="text-slate-500 text-sm font-bold">{csvFile ? csvFile.name : "Drop CSV Here"}</p>
//               </div>
//             </div>
//           </div>

//           {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{error}</div>}
//           {success && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">{success}</div>}

//           <button 
//             type="submit" 
//             disabled={loading || !merkleRoot} 
//             className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-300 uppercase tracking-tighter active:scale-95 transition-transform"
//           >
//             {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20}/>}
//             {loading ? "Registering..." : "Register Batch to Blockchain"}
//           </button>
//         </form>

//         {csvData.length > 0 && (
//           <button 
//             onClick={downloadPDF} 
//             className="w-full mt-4 bg-blue-50 text-blue-700 font-black py-5 rounded-[2rem] border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all uppercase tracking-tighter"
//           >
//             <Download size={20} /> Download {csvData.length} Secured Labels
//           </button>
//         )}
        
//         {/* Bottom Spacer for Mobile Scroll */}
//         <div className="h-10 w-full" />
//       </div>
//     </div>
//   );
// }

// export default AddBatch;

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../../providers/UsersProvider";
import { MerkleTree } from "merkletreejs";
import { ethers, keccak256, toUtf8Bytes, BrowserProvider } from "ethers"; // BrowserProvider add kiya
import jsPDF from "jspdf";
import { useConnect } from "../../../../providers/ConnectProvider";
import QRCode from "qrcode";
import { FileUp, Package, ShieldCheck, Download, Loader2 } from "lucide-react";

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

  // ======================== LOAD PRODUCTS ========================
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

  // ======================== SECURE UNIQUE MERKLE LOGIC ========================
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
      // ✅ FIX: Manual Signer Retrieval agar context null hai
      let activeSigner = contextSigner;
      if (!activeSigner && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        activeSigner = await provider.getSigner();
      }

      if (!activeSigner) throw new Error("No wallet connected!");

      // 1. 🔥 CRYPTOGRAPHIC SIGNATURE
      const message = ethers.solidityPackedKeccak256(
        ["bytes32", "uint256", "bytes32"],
        [productId, BigInt(batchId), merkleRoot]
      );
      
      const signature = await activeSigner.signMessage(ethers.toBeArray(message));

      // 2. IPFS Upload
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

      // 3. Blockchain Transaction
      const tx = await product.addBatch(productId, BigInt(batchId), ipfsRes.data.IpfsHash, merkleRoot);
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

      pdf.setDrawColor(220);
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
    <div className="h-screen w-full bg-[#f8fafc] overflow-y-auto flex items-center justify-center p-6 text-black">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10">
        
        <div className="mb-10 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white mb-4 shadow-lg">
            <Package size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic">Add Batch (Secure)</h2>
          {!walletAddress && <p className="text-red-500 font-bold text-xs animate-pulse">Wallet Not Detected!</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Select Product</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500"
                value={productId} onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">-- Choose --</option>
                {koa.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Batch ID</label>
              <input 
                type="number" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
                placeholder="Ex: 101" value={batchId} onChange={(e) => setBatchId(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Upload Manifest (CSV)</label>
            <div className="relative border-2 border-dashed border-slate-200 p-10 rounded-[2rem] text-center hover:bg-blue-50 transition-all">
              <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <FileUp className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-bold">{csvFile ? csvFile.name : "Click to select CSV"}</p>
            </div>
          </div>

          {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{error}</div>}
          {success && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">{success}</div>}

          <button 
            type="submit" 
            disabled={loading || !merkleRoot || !walletAddress} 
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-300 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20}/>}
            {loading ? "Signing..." : "Sign & Register Batch"}
          </button>
        </form>

        {csvData.length > 0 && (
          <button onClick={downloadPDF} className="w-full mt-4 bg-blue-50 text-blue-700 font-black py-5 rounded-[2rem] border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all">
            <Download size={20} className="inline mr-2" /> Download Secured Labels
          </button>
        )}
      </div>
    </div>
  );
}

export default AddBatch;