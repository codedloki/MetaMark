// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { Html5Qrcode } from "html5-qrcode";
// // // // // // import { 
// // // // // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // // // // //   AlertTriangle, CheckCircle2, History 
// // // // // // } from "lucide-react";
// // // // // // import axios from "axios";

// // // // // // // ✅ Firebase & Provider Imports
// // // // // // import { db } from "../../../../../lib/firebase"; 
// // // // // // import { ref, get, set } from "firebase/database";
// // // // // // import { useUser } from "../../../../providers/UsersProvider"; 

// // // // // // export default function ScanMe() {
// // // // // //   const { product } = useUser();
// // // // // //   const [scanResult, setScanResult] = useState(null);
// // // // // //   const [verifying, setVerifying] = useState(false);
// // // // // //   const [verificationData, setVerificationData] = useState(null);
// // // // // //   const [error, setError] = useState(null);
// // // // // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // // // // //   // ======================== VERIFICATION FLOW ========================
// // // // // //   const handleVerify = async (decodedText) => {
// // // // // //     setVerifying(true);
// // // // // //     setError(null);
// // // // // //     setIsAlreadyUsed(false);
    
// // // // // //     try {
// // // // // //       // 1. QR Data Parsing
// // // // // //       const data = JSON.parse(decodedText);
// // // // // //       const leafHash = data.l;

// // // // // //       // 2. 🔥 FIREBASE CHECK: Kya ye leaf pehle scan ho chuki hai?
// // // // // //       const scanRef = ref(db, `scans/${leafHash}`);
// // // // // //       const snapshot = await get(scanRef);

// // // // // //       if (snapshot.exists()) {
// // // // // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // // // // //         setIsAlreadyUsed(true);
// // // // // //         setError(`Security Alert: This product was already verified on ${scanTime}.`);
// // // // // //         setVerifying(false);
// // // // // //         return; 
// // // // // //       }

// // // // // //       // 3. BLOCKCHAIN FETCH: Batch IPFS Hash nikalna
// // // // // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// // // // // //       // 4. IPFS FETCH: Manifest se unit details nikalna
// // // // // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // // // // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // // // // //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// // // // // //       // 5. ON-CHAIN VERIFY: Merkle Proof verification (Gasless View Call)
// // // // // //       const isValid = await product.verify(batchInfo.merkleRoot, unit.leaf, unit.proof);

// // // // // //       if (isValid) {
// // // // // //         // 🔥 FIREBASE UPDATE: Success hone par DB mein save karein
// // // // // //         await set(scanRef, {
// // // // // //           timestamp: Date.now(),
// // // // // //           productId: data.p,
// // // // // //           batchId: data.b,
// // // // // //           verified: true
// // // // // //         });

// // // // // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // // // // //       } else {
// // // // // //         throw new Error("Blockchain mismatch: Not an authentic product!");
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       console.error(err);
// // // // // //       setError(err.message || "Invalid QR Code format.");
// // // // // //     } finally {
// // // // // //       setVerifying(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     const html5QrCode = new Html5Qrcode("reader");
// // // // // //     const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // // // // //     if (!scanResult) {
// // // // // //       html5QrCode.start(
// // // // // //         { facingMode: "environment" }, 
// // // // // //         qrConfig,
// // // // // //         (text) => {
// // // // // //           setScanResult(text);
// // // // // //           html5QrCode.stop();
// // // // // //           handleVerify(text); 
// // // // // //         },
// // // // // //         () => {}
// // // // // //       );
// // // // // //     }

// // // // // //     return () => {
// // // // // //       if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e));
// // // // // //     };
// // // // // //   }, [scanResult]);

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans">
// // // // // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // // // // //         {/* Dynamic Header based on state */}
// // // // // //         <div className="text-center mb-8">
// // // // // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // // // // //             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // // // // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // // // // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // // // // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // // // // //              <ScanLine className="text-white" size={32} />}
// // // // // //           </div>
// // // // // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // // // // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Cloned QR?" : "Secure Scan"}
// // // // // //           </h2>
// // // // // //         </div>

// // // // // //         {!scanResult ? (
// // // // // //           <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
// // // // // //         ) : (
// // // // // //           <div className="space-y-6">
            
// // // // // //             {/* ⚠️ Case 1: Already Scanned (Double Scan Protection) */}
// // // // // //             {isAlreadyUsed && (
// // // // // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl animate-in zoom-in">
// // // // // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // // // // //                 <h3 className="font-black text-amber-900 text-center uppercase">Duplicate Scan</h3>
// // // // // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 text-center uppercase leading-tight">
// // // // // //                   {error}
// // // // // //                 </p>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             {/* ❌ Case 2: Fraud / Error */}
// // // // // //             {error && !isAlreadyUsed && (
// // // // // //               <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center">
// // // // // //                 <AlertTriangle className="mx-auto text-red-500 mb-2" size={48} />
// // // // // //                 <h3 className="font-black text-red-900 uppercase italic">Verification Failed</h3>
// // // // // //                 <p className="text-[10px] text-red-700 font-bold mt-2 uppercase">{error}</p>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             {/* ✅ Case 3: Success */}
// // // // // //             {verificationData && (
// // // // // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in">
// // // // // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // // // // //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Authentic Product</h3>
// // // // // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
// // // // // //                   <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // // // // //                   <div className="flex justify-between"><span>Mfg:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
// // // // // //                   <div className="flex justify-between"><span>Exp:</span><span className="text-emerald-900">{verificationData.expiry_date}</span></div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             <button 
// // // // // //               onClick={() => window.location.reload()}
// // // // // //               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
// // // // // //             >
// // // // // //               <RefreshCw size={20} /> New Scan
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // import React, { useEffect, useState } from "react";
// // // // // import { Html5Qrcode } from "html5-qrcode";
// // // // // import { 
// // // // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // // // //   AlertTriangle, CheckCircle2, History, Beaker 
// // // // // } from "lucide-react";
// // // // // import axios from "axios";

// // // // // import { db } from "../../../../../lib/firebase"; 
// // // // // import { ref, get, set } from "firebase/database";
// // // // // import { useUser } from "../../../../providers/UsersProvider"; 

// // // // // export default function ScanMe() {
// // // // //   const { product } = useUser();
// // // // //   const [scanResult, setScanResult] = useState(null);
// // // // //   const [verifying, setVerifying] = useState(false);
// // // // //   const [verificationData, setVerificationData] = useState(null);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // // // //   const runStaticTest = () => {
// // // // //     const testPayload = {
// // // // //       p: "0xf30232bb749dde6f1b4162c8da86180ff1c0ff02eca78993629517de3ef4fb69",
// // // // //       b: "3",
// // // // //       l: "0x0d333f9c989d839383532e1b10aa4673c76d1f874a1fbb5b2ffb0ea30e8ab449"
// // // // //     };
// // // // //     setScanResult(JSON.stringify(testPayload));
// // // // //     handleVerify(JSON.stringify(testPayload));
// // // // //   };

// // // // //   const handleVerify = async (decodedText) => {
// // // // //     setVerifying(true);
// // // // //     setError(null);
// // // // //     setIsAlreadyUsed(false);
    
// // // // //     try {
// // // // //       const data = JSON.parse(decodedText);
// // // // //       const leafHash = data.l;

// // // // //       const scanRef = ref(db, `scans/${leafHash}`);
// // // // //       const snapshot = await get(scanRef);

// // // // //       if (snapshot.exists()) {
// // // // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // // // //         setIsAlreadyUsed(true);
// // // // //         setError(`Security Alert: This product was already verified on ${scanTime}.`);
// // // // //         setVerifying(false);
// // // // //         return; 
// // // // //       }

// // // // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
// // // // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // // // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // // // //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// // // // //       const isValid = await product.verifySerial(batchInfo.merkleRoot, unit.leaf, unit.proof);

// // // // //       if (isValid) {
// // // // //         await set(scanRef, {
// // // // //           timestamp: Date.now(),
// // // // //           productId: data.p,
// // // // //           batchId: data.b,
// // // // //           verified: true
// // // // //         });
// // // // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // // // //       } else {
// // // // //         throw new Error("Blockchain mismatch: Not an authentic product!");
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setError(err.message || "Invalid Data format.");
// // // // //     } finally {
// // // // //       setVerifying(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     let html5QrCode;

// // // // //     // ✅ FIX: Timeout use kar rahe hain taaki DOM element 'reader' render ho jaye
// // // // //     const setupScanner = async () => {
// // // // //       const element = document.getElementById("reader");
// // // // //       if (!element) return;

// // // // //       html5QrCode = new Html5Qrcode("reader");
// // // // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // // // //       try {
// // // // //         if (!scanResult) {
// // // // //           await html5QrCode.start(
// // // // //             { facingMode: "environment" }, 
// // // // //             qrConfig,
// // // // //             (text) => {
// // // // //               setScanResult(text);
// // // // //               html5QrCode.stop().then(() => handleVerify(text));
// // // // //             },
// // // // //             () => {}
// // // // //           );
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.warn("Scanner start error:", err);
// // // // //       }
// // // // //     };

// // // // //     const timer = setTimeout(setupScanner, 500); // 0.5 sec wait for DOM

// // // // //     return () => {
// // // // //       clearTimeout(timer);
// // // // //       if (html5QrCode && html5QrCode.isScanning) {
// // // // //         html5QrCode.stop().catch(e => console.error(e));
// // // // //       }
// // // // //     };
// // // // //   }, [scanResult]);

// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6">
// // // // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // // // //         <div className="text-center mb-8">
// // // // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // // // //             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // // // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // // // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // // // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // // // //              <ScanLine className="text-white" size={32} />}
// // // // //           </div>
// // // // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // // // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Cloned QR?" : "Secure Scan"}
// // // // //           </h2>
// // // // //         </div>

// // // // //         {!scanResult ? (
// // // // //           <>
// // // // //             {/* ✅ Yeh div hona zaroori hai scanner ke liye */}
// // // // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
// // // // //             <button 
// // // // //               onClick={runStaticTest}
// // // // //               className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2"
// // // // //             >
// // // // //               <Beaker size={18} /> Run Static Test
// // // // //             </button>
// // // // //           </>
// // // // //         ) : (
// // // // //           <div className="space-y-6">
// // // // //             {/* Result Displays (Same as before) */}
// // // // //             {error && (
// // // // //                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center">
// // // // //                  <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // // // //                  <p className="text-[10px] text-amber-700 font-bold uppercase">{error}</p>
// // // // //                </div>
// // // // //             )}
// // // // //             {verificationData && (
// // // // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
// // // // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // // // //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Authentic</h3>
// // // // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
// // // // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // // // //                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}
// // // // //             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
// // // // //               <RefreshCw size={20} className="inline mr-2" /> New Scan
// // // // //             </button>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import React, { useEffect, useState } from "react";
// // // // import { Html5Qrcode } from "html5-qrcode";
// // // // import { 
// // // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // // //   AlertTriangle, CheckCircle2, History, Beaker 
// // // // } from "lucide-react";
// // // // import axios from "axios";

// // // // // Firebase & Provider Imports
// // // // import { db } from "../../../../../lib/firebase"; 
// // // // import { ref, get, set } from "firebase/database";
// // // // import { useUser } from "../../../../providers/UsersProvider"; 

// // // // export default function ScanMe() {
// // // //   const { product } = useUser();
// // // //   const [scanResult, setScanResult] = useState(null);
// // // //   const [verifying, setVerifying] = useState(false);
// // // //   const [verificationData, setVerificationData] = useState(null);
// // // //   const [error, setError] = useState(null);
// // // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // // //   // ======================== STATIC TEST LOGIC ========================
// // // //   const runStaticTest = () => {
// // // //     const testPayload = {
// // // //       p: "0xf30232bb749dde6f1b4162c8da86180ff1c0ff02eca78993629517de3ef4fb69", // productId
// // // //       b: "6", // batchId
// // // //       l: "0x61ff620213671a8c988790c40c89d608a54f061eb3a793ee8efb5a84f055cb51" // leaf
// // // //     };
// // // //     setScanResult(JSON.stringify(testPayload));
// // // //     handleVerify(JSON.stringify(testPayload));
// // // //   };

// // // //   // ======================== VERIFICATION FLOW ========================
// // // //   const handleVerify = async (decodedText) => {
// // // //     setVerifying(true);
// // // //     setError(null);
// // // //     setIsAlreadyUsed(false);
    
// // // //     try {
// // // //       // 1. QR Data Parsing
// // // //       const data = JSON.parse(decodedText);
// // // //       const leafHash = data.l;

// // // //       // 2. 🔥 FIREBASE CHECK: Double Scan Protection
// // // //       const scanRef = ref(db, `scans/${leafHash}`);
// // // //       const snapshot = await get(scanRef);

// // // //       if (snapshot.exists()) {
// // // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // // //         setIsAlreadyUsed(true);
// // // //         setError(`Security Alert: This product was already verified on ${scanTime}.`);
// // // //         setVerifying(false);
// // // //         return; 
// // // //       }

// // // //       console.log("Product Data",data.p)
      
// // // //       // 3. BLOCKCHAIN FETCH: Batch Details
// // // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// // // //       // 4. IPFS FETCH: Manifest Details
// // // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // // //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// // // //       // 5. 🔥 ON-CHAIN VERIFY: Matching your Contract signature
// // // //       // function verifySerial(bytes32 _productId, uint256 _batchId, bytes32 _leaf, bytes32[] calldata _merkleProof)
// // // //       const tx = await product.verifySerial(
// // // //         data.p,           // bytes32 _productId
// // // //         BigInt(data.b),   // uint256 _batchId
// // // //         unit.leaf,        // bytes32 _leaf
// // // //         unit.proof        // bytes32[] _merkleProof
// // // //       );

// // // //       // Agar ye transaction hai, toh wait karna padega
// // // //       if (tx.wait) await tx.wait();

// // // //       // 6. 🔥 FIREBASE UPDATE: Mark as Scanned
// // // //       await set(scanRef, {
// // // //         timestamp: Date.now(),
// // // //         productId: data.p,
// // // //         batchId: data.b,
// // // //         verified: true
// // // //       });

// // // //       setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
// // // //     } catch (err) {
// // // //       console.error("Verification Error:", err);
// // // //       // Handling Contract Revert Reasons
// // // //       const reason = err.reason || err.message || "Blockchain Error";
// // // //       setError(reason.includes("Already verified") ? "Unit already marked on-chain!" : reason);
// // // //     } finally {
// // // //       setVerifying(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     let html5QrCode;
// // // //     const setupScanner = async () => {
// // // //       const element = document.getElementById("reader");
// // // //       if (!element) return;

// // // //       html5QrCode = new Html5Qrcode("reader");
// // // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // // //       try {
// // // //         if (!scanResult) {
// // // //           await html5QrCode.start(
// // // //             { facingMode: "environment" }, 
// // // //             qrConfig,
// // // //             (text) => {
// // // //               setScanResult(text);
// // // //               html5QrCode.stop().then(() => handleVerify(text));
// // // //             },
// // // //             () => {}
// // // //           );
// // // //         }
// // // //       } catch (err) {
// // // //         console.warn("Scanner start error:", err);
// // // //       }
// // // //     };

// // // //     const timer = setTimeout(setupScanner, 500);
// // // //     return () => {
// // // //       clearTimeout(timer);
// // // //       if (html5QrCode && html5QrCode.isScanning) {
// // // //         html5QrCode.stop().catch(e => console.error(e));
// // // //       }
// // // //     };
// // // //   }, [scanResult]);

// // // //   return (
// // // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans">
// // // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // // //         <div className="text-center mb-8">
// // // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // // //             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // // //              <ScanLine className="text-white" size={32} />}
// // // //           </div>
// // // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Used Serial" : "Secure Scan"}
// // // //           </h2>
// // // //         </div>

// // // //         {!scanResult ? (
// // // //           <>
// // // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
// // // //             <button 
// // // //               onClick={runStaticTest}
// // // //               className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-indigo-100"
// // // //             >
// // // //               <Beaker size={18} /> Run Static Test (Batch 3)
// // // //             </button>
// // // //           </>
// // // //         ) : (
// // // //           <div className="space-y-6">
// // // //             {/* Error View */}
// // // //             {error && (
// // // //                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // // //                  <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // // //                  <h3 className="font-black text-amber-900 uppercase">Verification Alert</h3>
// // // //                  <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // // //                </div>
// // // //             )}

// // // //             {/* Success View */}
// // // //             {verificationData && (
// // // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in">
// // // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // // //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Product Authentic</h3>
// // // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
// // // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // // //                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // // //                    <div className="flex justify-between"><span>Mfg:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
// // // //               <RefreshCw size={20} /> New Scan
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }


// // // // import React, { useEffect, useState } from "react";
// // // // import { Html5Qrcode } from "html5-qrcode";
// // // // import { 
// // // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // // //   AlertTriangle, CheckCircle2, History 
// // // // } from "lucide-react";
// // // // import axios from "axios";

// // // // // Firebase & Provider Imports
// // // // import { db } from "../../../../../lib/firebase"; 
// // // // import { ref, get, set } from "firebase/database";
// // // // import { useUser } from "../../../../providers/UsersProvider"; 

// // // // export default function ScanMe() {
// // // //   const { product } = useUser(); // Context se contract instance
// // // //   const [scanResult, setScanResult] = useState(null);
// // // //   const [verifying, setVerifying] = useState(false);
// // // //   const [verificationData, setVerificationData] = useState(null);
// // // //   const [error, setError] = useState(null);
// // // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // // //   // ======================== VERIFICATION LOGIC ========================
// // // //   const handleVerify = async (decodedText) => {
// // // //     // 🛡️ CRITICAL FIX: Agar product instance null hai toh wahi ruk jao
// // // //     if (!product) {
// // // //       setError("Blockchain Node is connecting... Please wait a few seconds and try again.");
// // // //       return;
// // // //     }

// // // //     setVerifying(true);
// // // //     setError(null);
// // // //     setIsAlreadyUsed(false);
    
// // // //     try {
// // // //       // 1. QR Data Parsing
// // // //       const data = JSON.parse(decodedText);
// // // //       const leafHash = data.l;

// // // //       // 2. 🔥 FIREBASE CHECK: Double Scan Protection (Off-chain)
// // // //       const scanRef = ref(db, `scans/${leafHash}`);
// // // //       const snapshot = await get(scanRef);

// // // //       if (snapshot.exists()) {
// // // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // // //         setIsAlreadyUsed(true);
// // // //         setError(`Security Alert: Verified on ${scanTime}.`);
// // // //         setVerifying(false);
// // // //         return; 
// // // //       }
      
// // // //       // 3. BLOCKCHAIN FETCH: Batch Details
// // // //       // BigInt use kiya hai uint256 compatibility ke liye
// // // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// // // //       // 4. IPFS FETCH: Manifest Details
// // // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // // //       if (!unit) throw new Error("Fraud: Unit not found in manufacturer records!");

// // // //       // 5. 🔥 ON-CHAIN VERIFY: Merkle Proof (Gasless View Call)
// // // //       const isValid = await product.verifySerial(
// // // //         data.p,           
// // // //         BigInt(data.b),   
// // // //         unit.leaf,        
// // // //         unit.proof        
// // // //       );

// // // //       if (isValid) {
// // // //         // 6. 🔥 FIREBASE UPDATE: Mark as Scanned
// // // //         await set(scanRef, {
// // // //           timestamp: Date.now(),
// // // //           productId: data.p,
// // // //           batchId: data.b,
// // // //           verified: true
// // // //         });

// // // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // // //       } else {
// // // //         throw new Error("Blockchain: Cryptographic signature mismatch!");
// // // //       }
      
// // // //     } catch (err) {
// // // //       console.error("Verification Error:", err);
// // // //       setError(err.reason || err.message || "Connection to Blockchain failed.");
// // // //     } finally {
// // // //       setVerifying(false);
// // // //     }
// // // //   };

// // // //   // ======================== SCANNER SETUP ========================
// // // //   useEffect(() => {
// // // //     let html5QrCode;
// // // //     const setupScanner = async () => {
// // // //       const element = document.getElementById("reader");
// // // //       if (!element) return;

// // // //       html5QrCode = new Html5Qrcode("reader");
// // // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // // //       try {
// // // //         if (!scanResult) {
// // // //           await html5QrCode.start(
// // // //             { facingMode: "environment" }, 
// // // //             qrConfig,
// // // //             (text) => {
// // // //               setScanResult(text);
// // // //               html5QrCode.stop().then(() => handleVerify(text));
// // // //             },
// // // //             () => {}
// // // //           );
// // // //         }
// // // //       } catch (err) {
// // // //         console.warn("Scanner failed to start:", err);
// // // //       }
// // // //     };

// // // //     const timer = setTimeout(setupScanner, 800); // Increased delay for stability
// // // //     return () => {
// // // //       clearTimeout(timer);
// // // //       if (html5QrCode && html5QrCode.isScanning) {
// // // //         html5QrCode.stop().catch(e => console.error(e));
// // // //       }
// // // //     };
// // // //   }, [scanResult]);

// // // //   return (
// // // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// // // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // // //         {/* State-driven Header */}
// // // //         <div className="text-center mb-8">
// // // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 transition-all
// // // //             ${!product ? 'bg-slate-300' : error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // // //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// // // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // // //              <ScanLine className="text-white" size={32} />}
// // // //           </div>
// // // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // // //             {!product ? "Initializing..." : verifying ? "Verifying..." : "MetaMark Scan"}
// // // //           </h2>
// // // //         </div>

// // // //         {!scanResult ? (
// // // //           <div className="space-y-4">
// // // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// // // //             {!product && (
// // // //               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
// // // //                 Connecting to Secure Node...
// // // //               </p>
// // // //             )}
// // // //           </div>
// // // //         ) : (
// // // //           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
// // // //             {/* Case: Duplicate */}
// // // //             {isAlreadyUsed && (
// // // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center">
// // // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // // //                 <h3 className="font-black text-amber-900 uppercase">Duplicate Alert</h3>
// // // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // // //               </div>
// // // //             )}

// // // //             {/* Case: General Error */}
// // // //             {error && !isAlreadyUsed && (
// // // //               <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center">
// // // //                 <AlertTriangle className="mx-auto text-red-500 mb-2" size={48} />
// // // //                 <h3 className="font-black text-red-900 uppercase italic">Error Detected</h3>
// // // //                 <p className="text-[10px] text-red-700 font-bold mt-2 uppercase">{error}</p>
// // // //               </div>
// // // //             )}

// // // //             {/* Case: Success */}
// // // //             {verificationData && (
// // // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm">
// // // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // // //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter text-lg">Authentic Product</h3>
// // // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold text-slate-600">
// // // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // // //                    <div className="flex justify-between"><span>Unit:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // // //                    <div className="flex justify-between"><span>Mfg:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
// // // //                    <div className="flex justify-between"><span>Exp:</span><span className="text-emerald-900">{verificationData.expiry_date}</span></div>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
// // // //               <RefreshCw size={20} /> Next Scan
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }



// // // import React, { useEffect, useState } from "react";
// // // import { Html5Qrcode } from "html5-qrcode";
// // // import { 
// // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // //   AlertTriangle, CheckCircle2, History, Beaker, SearchCheck 
// // // } from "lucide-react";
// // // import axios from "axios";

// // // // Firebase & Provider Imports
// // // import { db } from "../../../../../lib/firebase"; 
// // // import { ref, get, set } from "firebase/database";
// // // import { useUser } from "../../../../providers/UsersProvider"; 

// // // export default function ScanMe() {
// // //   const { product } = useUser();
// // //   const [scanResult, setScanResult] = useState(null);
// // //   const [verifying, setVerifying] = useState(false);
// // //   const [verificationData, setVerificationData] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // //   // ======================== STATIC TEST LOGIC ========================
// // //   const runStaticTest = () => {
// // //     const testPayload = {
// // //       p: "0xf30232bb749dde6f1b4162c8da86180ff1c0ff02eca78993629517de3ef4fb69", 
// // //       b: "6", 
// // //       l: "0x61ff620213671a8c988790c40c89d608a54f061eb3a793ee8efb5a84f055cb51" 
// // //     };
// // //     // Sirf state set karenge, verify automatically call nahi karenge
// // //     setScanResult(JSON.stringify(testPayload));
// // //   };

// // //   // ======================== VERIFICATION FLOW ========================
// // //   const handleVerify = async () => {
// // //     if (!scanResult) return;
    
// // //     setVerifying(true);
// // //     setError(null);
// // //     setIsAlreadyUsed(false);
    
// // //     try {
// // //       // 1. QR Data Parsing
// // //       const data = JSON.parse(scanResult);
// // //       const leafHash = data.l;

// // //       // 2. 🔥 FIREBASE CHECK: Double Scan Protection
// // //       const scanRef = ref(db, `scans/${leafHash}`);
// // //       const snapshot = await get(scanRef);

// // //       if (snapshot.exists()) {
// // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // //         setIsAlreadyUsed(true);
// // //         setError(`Security Alert: This product was already verified on ${scanTime}.`);
// // //         setVerifying(false);
// // //         return; 
// // //       }

// // //       // 3. BLOCKCHAIN FETCH: Batch Details
// // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// // //       // 4. IPFS FETCH: Manifest Details
// // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// // //       // 5. 🔥 ON-CHAIN VERIFY
// // //       const tx = await product.verifySerial(
// // //         data.p,           
// // //         BigInt(data.b),   
// // //         unit.leaf,        
// // //         unit.proof        
// // //       );

// // //       if (tx.wait) await tx.wait();

// // //       // 6. 🔥 FIREBASE UPDATE
// // //       await set(scanRef, {
// // //         timestamp: Date.now(),
// // //         productId: data.p,
// // //         batchId: data.b,
// // //         verified: true
// // //       });

// // //       setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
// // //     } catch (err) {
// // //       console.error("Verification Error:", err);
// // //       const reason = err.reason || err.message || "Blockchain Error";
// // //       setError(reason.includes("Already verified") ? "Unit already marked on-chain!" : reason);
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     let html5QrCode;
// // //     const setupScanner = async () => {
// // //       const element = document.getElementById("reader");
// // //       if (!element) return;

// // //       html5QrCode = new Html5Qrcode("reader");
// // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // //       try {
// // //         if (!scanResult) {
// // //           await html5QrCode.start(
// // //             { facingMode: "environment" }, 
// // //             qrConfig,
// // //             (text) => {
// // //               setScanResult(text);
// // //               html5QrCode.stop().catch(e => console.error(e));
// // //             },
// // //             () => {}
// // //           );
// // //         }
// // //       } catch (err) {
// // //         console.warn("Scanner start error:", err);
// // //       }
// // //     };

// // //     const timer = setTimeout(setupScanner, 500);
// // //     return () => {
// // //       clearTimeout(timer);
// // //       if (html5QrCode && html5QrCode.isScanning) {
// // //         html5QrCode.stop().catch(e => console.error(e));
// // //       }
// // //     };
// // //   }, [scanResult]);

// // //   return (
// // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans">
// // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // //         <div className="text-center mb-8">
// // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // //             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // //              <ScanLine className="text-white" size={32} />}
// // //           </div>
// // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Used Serial" : scanResult ? "Data Ready" : "Secure Scan"}
// // //           </h2>
// // //         </div>

// // //         {!scanResult ? (
// // //           <>
// // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
// // //             <button 
// // //               onClick={runStaticTest}
// // //               className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-indigo-100"
// // //             >
// // //               <Beaker size={18} /> Run Static Test (Batch 6)
// // //             </button>
// // //           </>
// // //         ) : (
// // //           <div className="space-y-6">
            
// // //             {/* Step 1: Data Scanned, Waiting for user click */}
// // //             {!verificationData && !error && !verifying && (
// // //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
// // //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-blue-900 uppercase tracking-tighter">QR Code Captured</h3>
// // //                 <p className="text-[10px] text-blue-700 font-bold mt-2 uppercase">Ready to verify on blockchain</p>
                
// // //                 <button 
// // //                   onClick={handleVerify}
// // //                   className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
// // //                 >
// // //                   Confirm & Verify
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {/* Error View */}
// // //             {error && (
// // //                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                  <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // //                  <h3 className="font-black text-amber-900 uppercase tracking-tighter">Verification Alert</h3>
// // //                  <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // //                </div>
// // //             )}

// // //             {/* Success View */}
// // //             {verificationData && (
// // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in">
// // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Product Authentic</h3>
// // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold text-slate-600">
// // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // //                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // //                    <div className="flex justify-between"><span>Mfg Date:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Button to scan another product (Show only when not verifying) */}
// // //             {!verifying && (
// // //               <button 
// // //                 onClick={() => window.location.reload()} 
// // //                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
// // //               >
// // //                 <RefreshCw size={20} /> New Scan
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // import React, { useEffect, useState } from "react";
// // // import { Html5Qrcode } from "html5-qrcode";
// // // import { 
// // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // //   AlertTriangle, CheckCircle2, History, SearchCheck 
// // // } from "lucide-react";
// // // import axios from "axios";

// // // // ✅ Firebase & Providers
// // // import { db } from "../../../../../lib/firebase"; 
// // // import { ref, get, set } from "firebase/database";
// // // import { useUser } from "../../../../providers/UsersProvider"; 
// // // import { useConnect } from "../../../../providers/ConnectProvider";

// // // export default function ScanMe() {
// // //   const { product } = useUser();
// // //   const { walletAddress } = useConnect(); // History tracking ke liye wallet address
  
// // //   const [scanResult, setScanResult] = useState(null);
// // //   const [verifying, setVerifying] = useState(false);
// // //   const [verificationData, setVerificationData] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // //   // ======================== VERIFICATION LOGIC ========================
// // //   // ======================== VERIFICATION FLOW (UPDATED) ========================
// // //   const handleVerify = async () => {
// // //     // 🛡️ Safety Guard: Contract aur Scan Result ka hona zaroori hai
// // //     if (!scanResult || !product) {
// // //       setError("Blockchain node is connecting... Please wait."); [cite = 13, 14]
// // //       return;
// // //     }
    
// // //     setVerifying(true);
// // //     setError(null);
// // //     setIsAlreadyUsed(false);
    
// // //     try {
// // //       // 1. QR Data Parsing
// // //       const data = JSON.parse(scanResult);
// // //       const leafHash = data.l;

// // //       // 2. 🔥 FIREBASE CHECK: Global Double Scan Protection
// // //       // Pehle check karein ki ye leafHash database mein hai ya nahi
// // //       const scanRef = ref(db, `scans/${leafHash}`);
// // //       const snapshot = await get(scanRef);

// // //       if (snapshot.exists()) {
// // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // //         setIsAlreadyUsed(true);
// // //         setError(`Security Alert: This unit was already verified on ${scanTime}.`); [cite= 14]
// // //         setVerifying(false);
// // //         return; // 🛑 Yahan return hona zaroori hai taaki 'set' call na ho
// // //       }

// // //       // 3. BLOCKCHAIN FETCH: Batch Details (C2 View Logic)
// // //       // BigInt use karein uint256 compatibility ke liye
// // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b)); [cite= 13, 14]
      
// // //       // 4. IPFS FETCH: Manifest se Unit details nikalna
// // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`); [cite= 14]
// // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // //       if (!unit) {
// // //         throw new Error("Fraud: Unit not found in official manifest!"); [cite= 14]
// // //       }

// // //       // 5. 🔥 ON-CHAIN VERIFY: Gasless View Call
// // //       // C2 logic ke mutabiq ye sirf boolean return karega, transaction nahi
// // //       const isValid = await product.verifySerial(
// // //         data.p,           
// // //         BigInt(data.b),   
// // //         unit.leaf,        
// // //         unit.proof        
// // //       ); [cite= 13, 14]

// // //       if (isValid) {
// // //         const now = Date.now();

// // //         // 6. 🔥 GLOBAL UPDATE: Mark as Scanned
// // //         // Rules: !data.exists() ki wajah se ye sirf tab chalega agar snapshot empty tha
// // //         await set(scanRef, {
// // //           timestamp: now,
// // //           verifiedBy: walletAddress || "Anonymous",
// // //           productId: data.p,
// // //           batchId: data.b
// // //         }); [cite= 13, 14]

// // //         // 7. ✅ USER HISTORY TRACKING: Wallet address ke basis par
// // //         if (walletAddress) {
// // //           const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
// // //           await set(historyRef, {
// // //             productId: data.p,
// // //             batchId: data.b,
// // //             mfg_date: unit.mfg_date,
// // //             timestamp: now,
// // //             status: "Authentic"
// // //           }); [cite= 13, 14]
// // //         }

// // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // //       } else {
// // //         throw new Error("Blockchain: Cryptographic signature mismatch!"); [cite= 14]
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Verification Error:", err);
// // //       // Detail error message for debugging
// // //       const reason = err.reason || err.message || "Connection failed";
// // //       setError(reason); [cite= 14]
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };
// // //   // ======================== SCANNER SETUP ========================
// // //   useEffect(() => {
// // //     let html5QrCode;
// // //     const setupScanner = async () => {
// // //       const element = document.getElementById("reader");
// // //       if (!element) return;

// // //       html5QrCode = new Html5Qrcode("reader");
// // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // //       try {
// // //         if (!scanResult) {
// // //           await html5QrCode.start(
// // //             { facingMode: "environment" }, 
// // //             qrConfig,
// // //             (text) => {
// // //               setScanResult(text);
// // //               html5QrCode.stop().catch(e => console.error(e));
// // //             }
// // //           );
// // //         }
// // //       } catch (err) {
// // //         console.warn("Scanner failed to start:", err);
// // //       }
// // //     };

// // //     const timer = setTimeout(setupScanner, 800);
// // //     return () => {
// // //       clearTimeout(timer);
// // //       if (html5QrCode && html5QrCode.isScanning) {
// // //         html5QrCode.stop().catch(e => console.error(e));
// // //       }
// // //     };
// // //   }, [scanResult]);

// // //   return (
// // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // //         {/* State-driven Header */}
// // //         <div className="text-center mb-8">
// // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // //             ${!product ? 'bg-slate-300' : error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // //              <ScanLine className="text-white" size={32} />}
// // //           </div>
// // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Duplicate" : scanResult ? "Data Captured" : "Secure Scan"}
// // //           </h2>
// // //         </div>

// // //         {!scanResult ? (
// // //           <div className="space-y-4">
// // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// // //             {!product && (
// // //               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
// // //                 Initializing Blockchain Node...
// // //               </p>
// // //             )}
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-6">
            
// // //             {/* Step: Confirm Verification */}
// // //             {!verificationData && !error && !verifying && (
// // //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
// // //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-blue-900 uppercase">Product Scanned</h3>
// // //                 <p className="text-[10px] text-blue-700 font-bold mt-2 uppercase">Ready for decentralized verification</p>
// // //                 <button 
// // //                   onClick={handleVerify}
// // //                   className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all"
// // //                 >
// // //                   Verify Now
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {/* Error View */}
// // //             {error && (
// // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-amber-900 uppercase">Verification Alert</h3>
// // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // //               </div>
// // //             )}

// // //             {/* Success View */}
// // //             {verificationData && (
// // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm animate-in fade-in">
// // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-emerald-900 text-center uppercase text-lg">Authentic Product</h3>
// // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold text-slate-600">
// // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // //                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // //                    <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600">Securely Tracked</span></div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {!verifying && (
// // //               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all">
// // //                 <RefreshCw size={20} /> Next Scan
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // import React, { useEffect, useState } from "react";
// // // import { Html5Qrcode } from "html5-qrcode";
// // // import { 
// // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // //   AlertTriangle, CheckCircle2, History, SearchCheck 
// // // } from "lucide-react";
// // // import axios from "axios";

// // // // ✅ Firebase & Providers
// // // import { db } from "../../../../../lib/firebase"; 
// // // import { ref, get, set } from "firebase/database";
// // // import { useUser } from "../../../../providers/UsersProvider"; 
// // // import { useConnect } from "../../../../providers/ConnectProvider";

// // // export default function ScanMe() {
// // //   const { product } = useUser();
// // //   const { walletAddress } = useConnect(); 
  
// // //   const [scanResult, setScanResult] = useState(null);
// // //   const [verifying, setVerifying] = useState(false);
// // //   const [verificationData, setVerificationData] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // //   // ======================== VERIFICATION LOGIC ========================
// // //   const handleVerify = async () => {
// // //     if (!scanResult || !product) {
// // //       setError("Blockchain node is connecting... Please wait.");
// // //       return;
// // //     }
    
// // //     setVerifying(true);
// // //     setError(null);
// // //     setIsAlreadyUsed(false);
    
// // //     try {
// // //       const data = JSON.parse(scanResult);
// // //       const leafHash = data.l;

// // //       // 1. Firebase Double Scan Check
// // //       const scanRef = ref(db, `scans/${leafHash}`);
// // //       const snapshot = await get(scanRef);

// // //       if (snapshot.exists()) {
// // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // //         setIsAlreadyUsed(true);
// // //         setError(`Security Alert: This unit was already verified on ${scanTime}.`);
// // //         setVerifying(false);
// // //         return; 
// // //       }

// // //       // 2. Blockchain Batch Details
// // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// // //       // 3. IPFS Fetch Manifest
// // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // //       const unit = response.data.units.find(u => u.leaf === leafHash);

// // //       if (!unit) {
// // //         throw new Error("Fraud: Unit not found in official manifest!");
// // //       }

// // //       // 4. On-Chain Gasless Verify
// // //       const isValid = await product.verifySerial(
// // //         data.p,           
// // //         BigInt(data.b),   
// // //         unit.leaf,        
// // //         unit.proof        
// // //       );

// // //       if (isValid) {
// // //         const now = Date.now();

// // //         // 5. Update Global Scan Node
// // //         await set(scanRef, {
// // //           timestamp: now,
// // //           verifiedBy: walletAddress || "Anonymous",
// // //           productId: data.p,
// // //           batchId: data.b
// // //         });

// // //         // 6. Update User History Node
// // //         if (walletAddress) {
// // //           const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
// // //           await set(historyRef, {
// // //             productId: data.p,
// // //             batchId: data.b,
// // //             mfg_date: unit.mfg_date,
// // //             timestamp: now,
// // //             status: "Authentic"
// // //           });
// // //         }

// // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // //       } else {
// // //         throw new Error("Blockchain: Cryptographic signature mismatch!");
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Verification Error:", err);
// // //       const reason = err.reason || err.message || "Connection failed";
// // //       setError(reason);
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };

// // //   // ======================== SCANNER SETUP ========================
// // //   useEffect(() => {
// // //     let html5QrCode;
// // //     const setupScanner = async () => {
// // //       const element = document.getElementById("reader");
// // //       if (!element) return;

// // //       html5QrCode = new Html5Qrcode("reader");
// // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // //       try {
// // //         if (!scanResult) {
// // //           await html5QrCode.start(
// // //             { facingMode: "environment" }, 
// // //             qrConfig,
// // //             (text) => {
// // //               setScanResult(text);
// // //               html5QrCode.stop().catch(e => console.error(e));
// // //             }
// // //           );
// // //         }
// // //       } catch (err) {
// // //         console.warn("Scanner failed to start:", err);
// // //       }
// // //     };

// // //     const timer = setTimeout(setupScanner, 800);
// // //     return () => {
// // //       clearTimeout(timer);
// // //       if (html5QrCode && html5QrCode.isScanning) {
// // //         html5QrCode.stop().catch(e => console.error(e));
// // //       }
// // //     };
// // //   }, [scanResult]);

// // //   return (
// // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // //         <div className="text-center mb-8">
// // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // //             ${!product ? 'bg-slate-300' : error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // //              <ScanLine className="text-white" size={32} />}
// // //           </div>
// // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // //             {verifying ? "Verifying..." : isAlreadyUsed ? "Duplicate" : scanResult ? "Data Captured" : "Secure Scan"}
// // //           </h2>
// // //         </div>

// // //         {!scanResult ? (
// // //           <div className="space-y-4">
// // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// // //             {!product && (
// // //               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
// // //                 Initializing Blockchain Node...
// // //               </p>
// // //             )}
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-6">
// // //             {!verificationData && !error && !verifying && (
// // //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
// // //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-blue-900 uppercase">Product Scanned</h3>
// // //                 <p className="text-[10px] text-blue-700 font-bold mt-2 uppercase">Ready for decentralized verification</p>
// // //                 <button 
// // //                   onClick={handleVerify}
// // //                   className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all"
// // //                 >
// // //                   Verify Now
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {error && (
// // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-amber-900 uppercase">Verification Alert</h3>
// // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // //               </div>
// // //             )}

// // //             {verificationData && (
// // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm animate-in fade-in">
// // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-emerald-900 text-center uppercase text-lg">Authentic Product</h3>
// // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold text-slate-600">
// // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // //                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
// // //                    <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600">Securely Tracked</span></div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {!verifying && (
// // //               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all">
// // //                 <RefreshCw size={20} /> Next Scan
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // import React, { useEffect, useState } from "react";
// // // import { Html5Qrcode } from "html5-qrcode";
// // // import { 
// // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // //   AlertTriangle, CheckCircle2, History, SearchCheck 
// // // } from "lucide-react";
// // // import axios from "axios";
// // // import { ethers } from "ethers";

// // // // ✅ Firebase & Providers
// // // import { db } from "../../../../../lib/firebase"; 
// // // import { ref, get, set } from "firebase/database";
// // // import { useUser } from "../../../../providers/UsersProvider"; 
// // // import { useConnect } from "../../../../providers/ConnectProvider";

// // // export default function ScanMe() {
// // //   const { product } = useUser();
// // //   const { walletAddress } = useConnect(); 
// // //   const [productName,setProductName] =useState()
// // //   const [scanResult, setScanResult] = useState(null);
// // //   const [verifying, setVerifying] = useState(false);
// // //   const [verificationData, setVerificationData] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// // //   // ======================== VERIFICATION LOGIC ========================
// // //   const handleVerify = async () => {
// // //     if (!scanResult || !product) {
// // //       setError("Blockchain node is connecting... Please wait.");
// // //       return;
// // //     }
    
// // //     setVerifying(true);
// // //     setError(null);
// // //     setIsAlreadyUsed(false);
    
// // //     try {
// // //       const data = JSON.parse(scanResult);
// // //       const leafHash = data.l;

// // //       // 1. Firebase Double Scan Check
// // //       const scanRef = ref(db, `scans/${leafHash}`);
// // //       const snapshot = await get(scanRef);

// // //       if (snapshot.exists()) {
// // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // //         setIsAlreadyUsed(true);
// // //         setError(`Security Alert: This unit was already verified on ${scanTime}.`);
// // //         setVerifying(false);
// // //         return; 
// // //       }

// // //       // 2. Blockchain Batch Details
// // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
// // //       const productDetails = await product.getProduct(batchInfo.productId);
// // //     const manufacturerAddr = productDetails.manufacturer; // 👈 Ye hai asali address
    
// // //       const proddet = await axios.get(`https://gateway.pinata.cloud/ipfs/${productDetails.details}`)
// // //       console.log("Details : ",proddet.data.productName)
// // //       setProductName(proddet.data.productName)



// // //       // 3. IPFS Fetch Manifest
// // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // //       console.log(response.data)
// // //       const manifest = response.data;
// // //       const unit = manifest.units.find(u => u.leaf === leafHash);
// // //       console.log("Manifest Signature : ",manifest.signature)
// // //       if (!unit) {
// // //         throw new Error("Fraud: Unit not found in official manifest!");
// // //       }

// // //       // 🔥 4. NEW: Cryptographic Signature Verification (The Extra Step)
// // //       // Wahi hash banayein jo manufacturer ne sign kiya tha
// // //       const messageHash = ethers.solidityPackedKeccak256(
// // //         ["bytes32", "uint256", "bytes32"],
// // //         [data.p, BigInt(data.b), batchInfo.merkleRoot]
// // //       );
      
// // //       const recoveredAddress = ethers.verifyMessage(
// // //         ethers.toBeArray(messageHash), 
// // //         manifest.signature
// // //       );
      
// // //       console.log("Batch Info : ",batchInfo)
// // //       // Check karein ki signature asali manufacturer ka hi hai
// // //       if (recoveredAddress.toLowerCase() !== manufacturerAddr.toLowerCase()) {
// // //         throw new Error("Security Alert: Manifest signature mismatch! Not authentic.");
// // //       }

// // //       // 5. On-Chain Gasless Verify (Merkle Proof)
// // //       const isValid = await product.verifySerial(
// // //         data.p,           
// // //         BigInt(data.b),   
// // //         unit.leaf,        
// // //         unit.proof        
// // //       );

// // //       if (isValid) {
// // //         const now = Date.now();

// // //         // 6. Update Global Scan Node
// // //         await set(scanRef, {
// // //           timestamp: now,
// // //           verifiedBy: walletAddress || "Anonymous",
// // //           productId: data.p,
// // //           batchId: data.b
// // //         });

// // //         // 7. Update User History Node
// // //         if (walletAddress) {
// // //           const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
// // //           await set(historyRef, {
// // //             productId: data.p,
// // //             batchId: data.b,
// // //             mfg_date: unit.mfg_date,
// // //             timestamp: now,
// // //             status: "Authentic"
// // //           });
// // //         }

// // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // //       } else {
// // //         throw new Error("Blockchain: Merkle proof verification failed!");
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Verification Error:", err);
// // //       const reason = err.reason || err.message || "Connection failed";
// // //       setError(reason);
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };

// // //   // ======================== SCANNER SETUP ========================
// // //   useEffect(() => {
// // //     let html5QrCode;
// // //     const setupScanner = async () => {
// // //       const element = document.getElementById("reader");
// // //       if (!element) return;

// // //       html5QrCode = new Html5Qrcode("reader");
// // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // //       try {
// // //         if (!scanResult) {
// // //           await html5QrCode.start(
// // //             { facingMode: "environment" }, 
// // //             qrConfig,
// // //             (text) => {
// // //               setScanResult(text);
// // //               html5QrCode.stop().catch(e => console.error(e));
// // //             }
// // //           );
// // //         }
// // //       } catch (err) {
// // //         console.warn("Scanner failed to start:", err);
// // //       }
// // //     };

// // //     const timer = setTimeout(setupScanner, 800);
// // //     return () => {
// // //       clearTimeout(timer);
// // //       if (html5QrCode && html5QrCode.isScanning) {
// // //         html5QrCode.stop().catch(e => console.error(e));
// // //       }
// // //     };
// // //   }, [scanResult]);

// // //   return (
// // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // //         <div className="text-center mb-8">
// // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // //             ${!product ? 'bg-slate-300' : error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // //              <ScanLine className="text-white" size={32} />}
// // //           </div>
// // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // //             {verifying ? "Verifying Signature..." : isAlreadyUsed ? "Duplicate" : scanResult ? "Authenticating" : "Secure Scan"}
// // //           </h2>
// // //         </div>

// // //         {!scanResult ? (
// // //           <div className="space-y-4">
// // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// // //             {!product && (
// // //               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
// // //                 Initializing Blockchain Node...
// // //               </p>
// // //             )}
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-6">
// // //             {!verificationData && !error && !verifying && (
// // //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
// // //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-blue-900 uppercase">Product Scanned</h3>
// // //                 <p className="text-[10px] text-blue-700 font-bold mt-2 uppercase">Ready for signature & blockchain check</p>
// // //                 <button 
// // //                   onClick={handleVerify}
// // //                   className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all"
// // //                 >
// // //                   Verify Now
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {error && (
// // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-amber-900 uppercase">Verification Alert</h3>
// // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
// // //               </div>
// // //             )}

// // //             {verificationData && (
// // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm animate-in fade-in">
// // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-emerald-900 text-center uppercase text-lg italic">Verified Authentic</h3>
// // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold text-slate-600">
// // //                     <div className="flex justify-between"><span>Product:</span><span className="text-emerald-600 font-black">{productName}</span></div>
// // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>

// // //                    <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600 font-black">Cryptographically Signed</span></div>
// // //                    <div className="flex justify-between"><span>Blockchain:</span><span className="text-emerald-600">Proof Validated</span></div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {!verifying && (
// // //               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all">
// // //                 <RefreshCw size={20} /> Next Scan
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // import React, { useEffect, useState } from "react";
// // // import { Html5Qrcode } from "html5-qrcode";
// // // import { 
// // //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// // //   AlertTriangle, CheckCircle2, History, SearchCheck 
// // // } from "lucide-react";
// // // import axios from "axios";
// // // import { ethers } from "ethers";

// // // // ✅ Firebase & Providers
// // // import { db } from "../../../../../lib/firebase"; 
// // // import { ref, get, set } from "firebase/database";
// // // import { useUser } from "../../../../providers/UsersProvider"; 
// // // import { useConnect } from "../../../../providers/ConnectProvider";

// // // export default function ScanMe() {
// // //   const { product,registry } = useUser();
// // //   const { walletAddress } = useConnect(); 
// // //   const [productName, setProductName] = useState("");
// // //   const [prodtype,setprodtype] = useState()
// // //   const [scanResult, setScanResult] = useState(null);
// // //   const [verifying, setVerifying] = useState(false);
// // //   const [verificationData, setVerificationData] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
// // //   const [compname,setcompname] = useState()
// // // const [manaddr,setmanaddr] = useState()


// // //   // ======================== VERIFICATION LOGIC ========================
// // //   const handleVerify = async () => {
// // //     if (!scanResult || !product) {
// // //       setError("Blockchain node is connecting... Please wait.");
// // //       return;
// // //     }
    
// // //     setVerifying(true);
// // //     setError(null);
// // //     setIsAlreadyUsed(false);
    
// // //     try {
// // //       const data = JSON.parse(scanResult);
// // //       const leafHash = data.l;

// // //       // 1. Firebase Double Scan Check
// // //       const scanRef = ref(db, `scans/${leafHash}`);
// // //       const snapshot = await get(scanRef);

// // //       if (snapshot.exists()) {
// // //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// // //         setIsAlreadyUsed(true);
// // //         setError(`Security Alert: Already verified on ${scanTime}.`);
// // //         setVerifying(false);
// // //         return; 
// // //       }

// // //       // 2. Blockchain Fetch (Batch + Product + Manufacturer)
// // //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
// // //       const productDetails = await product.getProduct(data.p);
// // //       const manufacturerAddr = productDetails.manufacturer; 


// // //       const manbyaddd = await registry.getManufacturer(manufacturerAddr)
// // //       console.log(manbyaddd.companyName.toUpperCase())
// // //       setcompname(manbyaddd.companyName.toUpperCase())

// // //       // Product Name Fetch from IPFS
// // //       const proddet = await axios.get(`https://gateway.pinata.cloud/ipfs/${productDetails.details}`);
// // //       setProductName(proddet.data.productName);
// // //       setprodtype(proddet.data.productType)

// // //       // 3. IPFS Fetch Manifest
// // //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// // //       const manifest = response.data;
// // //       const unit = manifest.units.find(u => u.leaf === leafHash);

// // //       if (!unit) {
// // //         throw new Error("Fraud: Unit not found in official manifest!");
// // //       }

// // //       // 🔥 4. FIX: Cryptographic Signature Verification
// // //       // messageHash wahi hona chahiye jo AddBatch mein sign hua tha
// // //       const messageHash = ethers.solidityPackedKeccak256(
// // //         ["bytes32", "uint256", "bytes32"],
// // //         [data.p, BigInt(data.b), batchInfo.merkleRoot]
// // //       );
      
// // //       // recoverAddress use karenge kyunki signMessage ne prefix add kiya tha
// // //       const recoveredAddress = ethers.recoverAddress(
// // //         ethers.hashMessage(ethers.toBeArray(messageHash)), 
// // //         manifest.signature
// // //       );
// // //       setmanaddr(manufacturerAddr)
// // //       if (recoveredAddress.toLowerCase() !== manufacturerAddr.toLowerCase()) {
// // //         throw new Error("Security Alert: Manifest signature mismatch! Not authentic.");
// // //       }

// // //       // 5. On-Chain Merkle Proof Verify
// // //       const isValid = await product.verifySerial(
// // //         data.p,           
// // //         BigInt(data.b),   
// // //         unit.leaf,        
// // //         unit.proof        
// // //       );

// // //       if (isValid) {
// // //         const now = Date.now();

// // //         // 6. Update Firebase Global Scans
// // //         await set(scanRef, {
// // //           timestamp: now,
// // //           verifiedBy: walletAddress || "Anonymous",
// // //           productId: data.p,
// // //           batchId: data.b
// // //         });

// // //         // 7. Update Firebase User History
// // //         if (walletAddress) {
// // //           const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
// // //           await set(historyRef, {
// // //             productId: data.p,
// // //             batchId: data.b,
// // //             productName: proddet.data.productName,
// // //             mfg_date: unit.mfg_date,
// // //             timestamp: now,
// // //             status: "Authentic"
// // //           });
// // //         }

// // //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// // //       } else {
// // //         throw new Error("Blockchain: Merkle proof verification failed!");
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Verification Error:", err);
// // //       const reason = err.reason || err.message || "Connection failed";
// // //       setError(reason);
// // //     } finally {
// // //       setVerifying(false);
// // //     }
// // //   };

// // //   // ======================== SCANNER SETUP ========================
// // //   useEffect(() => {
// // //     let html5QrCode;
// // //     const setupScanner = async () => {
// // //       const element = document.getElementById("reader");
// // //       if (!element) return;

// // //       html5QrCode = new Html5Qrcode("reader");
// // //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// // //       try {
// // //         if (!scanResult) {
// // //           await html5QrCode.start(
// // //             { facingMode: "environment" }, 
// // //             qrConfig,
// // //             (text) => {
// // //               setScanResult(text);
// // //               html5QrCode.stop().catch(e => console.error(e));
// // //             }
// // //           );
// // //         }
// // //       } catch (err) {
// // //         console.warn("Scanner failed to start:", err);
// // //       }
// // //     };

// // //     const timer = setTimeout(setupScanner, 800);
// // //     return () => {
// // //       clearTimeout(timer);
// // //       if (html5QrCode && html5QrCode.isScanning) {
// // //         html5QrCode.stop().catch(e => console.error(e));
// // //       }
// // //     };
// // //   }, [scanResult]);

// // //   return (
// // //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// // //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// // //         {/* Dynamic Header */}
// // //         <div className="text-center mb-8">
// // //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// // //             ${!product ? 'bg-slate-300' : error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// // //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// // //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// // //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// // //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// // //              <ScanLine className="text-white" size={32} />}
// // //           </div>
// // //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// // //             {verifying ? "Authenticating..." : isAlreadyUsed ? "Duplicate" : scanResult ? "Verify Data" : "Secure Scan"}
// // //           </h2>
// // //         </div>

// // //         {!scanResult ? (
// // //           <div className="space-y-4">
// // //             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-6">
// // //             {!verificationData && !error && !verifying && (
// // //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-blue-900 uppercase">QR Captured</h3>
// // //                 <p className="text-[10px] text-blue-700 font-bold mt-2 uppercase">Ready for signature & Merkle check</p>
// // //                 <button 
// // //                   onClick={handleVerify}
// // //                   className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all"
// // //                 >
// // //                   Verify Now
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {error && (
// // //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
// // //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-amber-900 uppercase italic">Verification Alert</h3>
// // //                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase leading-tight">{error}</p>
// // //               </div>
// // //             )}

// // //             {verificationData && (
// // //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm animate-in fade-in">
// // //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// // //                 <h3 className="font-black text-emerald-900 text-center uppercase text-lg italic tracking-tighter">Product Authentic</h3>
// // //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[15px] uppercase font-bold text-slate-600">
// // //                    <div className="flex justify-between"><span>Product:</span><span className="text-emerald-900">{productName}</span></div>
// // //                    <div className="flex justify-between"><span>Product Type:</span><span className="text-emerald-900">{prodtype}</span></div>
// // //                    <div className="flex justify-between"><span>Company Name:</span><span className="text-emerald-900">{compname}</span></div>
// // //                    <div className="flex justify-between items-center gap-4">
// // //   <span className="text-slate-500">Manufacturer:</span>
// // //   <span className="text-emerald-900 font-mono">
// // //     {manaddr ? `${manaddr.slice(0, 6)}...${manaddr.slice(-4)}` : "N/A"}
// // //   </span>
// // // </div>
// // //                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// // //                    {/* <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div> */}
// // //                    <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600 font-black">Signed 🛡️</span></div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {!verifying && (
// // //               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all">
// // //                 <RefreshCw size={20} /> Next Scan
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import React, { useEffect, useState } from "react";
// // import { Html5Qrcode } from "html5-qrcode";
// // import { 
// //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// //   AlertTriangle, CheckCircle2, History, SearchCheck 
// // } from "lucide-react";
// // import axios from "axios";
// // import { ethers } from "ethers";

// // // ✅ Firebase & Providers
// // import { db } from "../../../../../lib/firebase"; 
// // import { ref, get, set } from "firebase/database";
// // import { useUser } from "../../../../providers/UsersProvider"; 
// // import { useConnect } from "../../../../providers/ConnectProvider";

// // export default function ScanMe() {
// //   const { product, registry } = useUser();
// //   const { walletAddress } = useConnect(); 
// //   const [productName, setProductName] = useState("");
// //   const [prodtype, setprodtype] = useState("");
// //   const [scanResult, setScanResult] = useState(null);
// //   const [verifying, setVerifying] = useState(false);
// //   const [verificationData, setVerificationData] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
// //   const [compname, setcompname] = useState("");
// //   const [manaddr, setmanaddr] = useState("");

// //   const handleVerify = async () => {
// //     if (!scanResult || !product) {
// //       setError("Blockchain node is connecting... Please wait.");
// //       return;
// //     }
    
// //     setVerifying(true);
// //     setError(null);
// //     setIsAlreadyUsed(false);
    
// //     try {
// //       const data = JSON.parse(scanResult);
// //       const leafHash = data.l;

// //       // 1. 🔥 Pehle Blockchain aur IPFS se sara data fetch karein (Independent of Firebase)
// //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
// //       const productDetails = await product.getProduct(data.p);
// //       const manufacturerAddr = productDetails.manufacturer; 

// //       const manbyaddd = await registry.getManufacturer(manufacturerAddr);
// //       setcompname(manbyaddd.companyName.toUpperCase());

// //       const proddet = await axios.get(`https://gateway.pinata.cloud/ipfs/${productDetails.details}`);
// //       setProductName(proddet.data.productName);
// //       setprodtype(proddet.data.productType);
// //       setmanaddr(manufacturerAddr);

// //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// //       const manifest = response.data;
// //       const unit = manifest.units.find(u => u.leaf === leafHash);

// //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// //       // 2. Cryptographic Signature Verification
// //       const messageHash = ethers.solidityPackedKeccak256(
// //         ["bytes32", "uint256", "bytes32"],
// //         [data.p, BigInt(data.b), batchInfo.merkleRoot]
// //       );
      
// //       const recoveredAddress = ethers.recoverAddress(
// //         ethers.hashMessage(ethers.toBeArray(messageHash)), 
// //         manifest.signature
// //       );

// //       if (recoveredAddress.toLowerCase() !== manufacturerAddr.toLowerCase()) {
// //         throw new Error("Security Alert: Manifest signature mismatch!");
// //       }

// //       // 3. Merkle Proof Verify
// //       const isValid = await product.verifySerial(data.p, BigInt(data.b), unit.leaf, unit.proof);

// //       if (!isValid) throw new Error("Blockchain: Merkle proof verification failed!");

// //       // 4. 🛡️ FIREBASE CHECK: Ab check karein ki ye purana scan hai ya naya
// //       const scanRef = ref(db, `scans/${leafHash}`);
// //       const snapshot = await get(scanRef);

// //       if (snapshot.exists()) {
// //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// //         setIsAlreadyUsed(true);
// //         setError(`Security Alert: This unit was already verified on ${scanTime}.`);
// //         // Data show karne ke liye state update karein
// //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// //         setVerifying(false);
// //         return; 
// //       }

// //       // 5. Fresh Scan: Database Update karein
// //       const now = Date.now();
// //       await set(scanRef, {
// //         timestamp: now,
// //         verifiedBy: walletAddress || "Anonymous",
// //         productId: data.p,
// //         batchId: data.b
// //       });

// //       if (walletAddress) {
// //         const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
// //         await set(historyRef, {
// //           productId: data.p,
// //           batchId: data.b,
// //           productName: proddet.data.productName,
// //           mfg_date: unit.mfg_date,
// //           timestamp: now,
// //           status: "Authentic"
// //         });
// //       }

// //       setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
// //     } catch (err) {
// //       console.error("Verification Error:", err);
// //       setError(err.reason || err.message || "Connection failed");
// //     } finally {
// //       setVerifying(false);
// //     }
// //   };

// //   // Scanner useEffect remains same...
// //   useEffect(() => {
// //     let html5QrCode;
// //     const setupScanner = async () => {
// //       const element = document.getElementById("reader");
// //       if (!element) return;
// //       html5QrCode = new Html5Qrcode("reader");
// //       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
// //       try {
// //         if (!scanResult) {
// //           await html5QrCode.start({ facingMode: "environment" }, qrConfig, (text) => {
// //             setScanResult(text);
// //             html5QrCode.stop().catch(e => console.error(e));
// //           });
// //         }
// //       } catch (err) { console.warn(err); }
// //     };
// //     const timer = setTimeout(setupScanner, 800);
// //     return () => {
// //       clearTimeout(timer);
// //       if (html5QrCode && html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e));
// //     };
// //   }, [scanResult]);

// //   return (
// //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
// //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// //         {/* Dynamic Header */}
// //         <div className="text-center mb-8">
// //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// //             ${!product ? 'bg-slate-300' : error && !isAlreadyUsed ? 'bg-red-500' : isAlreadyUsed ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// //              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
// //              isAlreadyUsed ? <AlertTriangle className="text-white" size={32} /> :
// //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// //              <ScanLine className="text-white" size={32} />}
// //           </div>
// //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// //             {verifying ? "Checking..." : isAlreadyUsed ? "Already Scanned" : scanResult ? "Authenticated" : "Secure Scan"}
// //           </h2>
// //         </div>

// //         {!scanResult ? (
// //           <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
// //         ) : (
// //           <div className="space-y-6">
// //             {!verificationData && !error && !verifying && (
// //               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
// //                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
// //                 <h3 className="font-black text-blue-900 uppercase">QR Captured</h3>
// //                 <button onClick={handleVerify} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg">
// //                   Verify Now
// //                 </button>
// //               </div>
// //             )}

// //             {/* ERROR / ALERT DISPLAY */}
// //             {error && (
// //               <div className={`${isAlreadyUsed ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border-2 p-6 rounded-3xl text-center animate-in zoom-in`}>
// //                 <AlertTriangle className={`${isAlreadyUsed ? 'text-amber-500' : 'text-red-500'} mx-auto mb-2`} size={48} />
// //                 <h3 className={`font-black uppercase ${isAlreadyUsed ? 'text-amber-900' : 'text-red-900'}`}>
// //                   {isAlreadyUsed ? "Duplicate Scan Warning" : "Verification Failed"}
// //                 </h3>
// //                 <p className={`text-[10px] font-bold mt-2 uppercase ${isAlreadyUsed ? 'text-amber-700' : 'text-red-700'}`}>{error}</p>
// //               </div>
// //             )}

// //             {/* PRODUCT DATA DISPLAY (Shows for both Fresh and Already Scanned) */}
// //             {verificationData && (
// //               <div className={`bg-white border-2 ${isAlreadyUsed ? 'border-amber-100' : 'border-emerald-100'} p-6 rounded-3xl shadow-sm animate-in fade-in`}>
// //                 <div className="flex items-center justify-between mb-4">
// //                     <h3 className="font-black text-slate-900 uppercase text-lg italic">Product Details</h3>
// //                     {isAlreadyUsed ? <History className="text-amber-500" size={24} /> : <CheckCircle2 className="text-emerald-500" size={24} />}
// //                 </div>
// //                 <div className="space-y-2 border-t border-slate-100 pt-4 text-[14px] font-bold text-slate-600">
// //                    <div className="flex justify-between"><span>Product:</span><span className="text-slate-900">{productName}</span></div>
// //                    <div className="flex justify-between"><span>Type:</span><span className="text-slate-900">{prodtype}</span></div>
// //                    <div className="flex justify-between"><span>Company:</span><span className="text-slate-900">{compname}</span></div>
// //                    <div className="flex justify-between items-center gap-4">
// //                       <span>Manufacturer:</span>
// //                       <span className="text-blue-600 font-mono">{manaddr ? `${manaddr.slice(0, 6)}...${manaddr.slice(-4)}` : "N/A"}</span>
// //                    </div>
// //                    <div className="flex justify-between"><span>Batch:</span><span className="text-slate-900">#{verificationData.batchId}</span></div>
// //                    <div className="flex justify-between"><span>Status:</span><span className={isAlreadyUsed ? "text-amber-600" : "text-emerald-600"}>
// //                      {isAlreadyUsed ? "Previously Verified" : "Genuine & Signed 🛡️"}
// //                    </span></div>
// //                 </div>
// //               </div>
// //             )}

// //             {!verifying && (
// //               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all">
// //                 <RefreshCw size={20} /> Next Scan
// //               </button>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { 
//   ScanLine, ShieldCheck, RefreshCw, Loader2, 
//   AlertTriangle, CheckCircle2, History, SearchCheck 
// } from "lucide-react";
// import axios from "axios";
// import { ethers } from "ethers";

// // ✅ Firebase & Providers
// import { db } from "../../../../../lib/firebase"; 
// import { ref, get, set } from "firebase/database";
// import { useUser } from "../../../../providers/UsersProvider"; 
// import { useConnect } from "../../../../providers/ConnectProvider";

// export default function ScanMe() {
//   const { product, registry } = useUser();
//   const { walletAddress } = useConnect(); 
//   const [productName, setProductName] = useState("");
//   const [prodtype, setprodtype] = useState("");
//   const [scanResult, setScanResult] = useState(null);
//   const [verifying, setVerifying] = useState(false);
//   const [verificationData, setVerificationData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
//   const [compname, setcompname] = useState("");
//   const [manaddr, setmanaddr] = useState("");

//   const handleVerify = async () => {
//     if (!scanResult || !product) {
//       setError("Blockchain node is connecting... Please wait.");
//       return;
//     }
    
//     setVerifying(true);
//     setError(null);
//     setIsAlreadyUsed(false);
    
//     try {
//       const data = JSON.parse(scanResult);
//       const leafHash = data.l;

//       // 1. 🔥 BLOCKCHAIN & IPFS FETCH (Pehele data laao, chahe used ho ya na ho)
//       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
//       const productDetails = await product.getProduct(data.p);
//       const manufacturerAddr = productDetails.manufacturer; 

//       const manbyaddd = await registry.getManufacturer(manufacturerAddr);
//       setcompname(manbyaddd.companyName.toUpperCase());

//       const proddet = await axios.get(`https://gateway.pinata.cloud/ipfs/${productDetails.details}`);
//       setProductName(proddet.data.productName);
//       setprodtype(proddet.data.productType);
//       setmanaddr(manufacturerAddr);

//       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
//       const manifest = response.data;
//       const unit = manifest.units.find(u => u.leaf === leafHash);

//       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

//       // 2. Cryptographic Signature Verification
//       const messageHash = ethers.solidityPackedKeccak256(
//         ["bytes32", "uint256", "bytes32"],
//         [data.p, BigInt(data.b), batchInfo.merkleRoot]
//       );
      
//       const recoveredAddress = ethers.recoverAddress(
//         ethers.hashMessage(ethers.toBeArray(messageHash)), 
//         manifest.signature
//       );

//       if (recoveredAddress.toLowerCase() !== manufacturerAddr.toLowerCase()) {
//         throw new Error("Security Alert: Manifest signature mismatch!");
//       }

//       // 3. Merkle Proof Verify
//       const isValid = await product.verifySerial(data.p, BigInt(data.b), unit.leaf, unit.proof);
//       if (!isValid) throw new Error("Blockchain: Merkle proof verification failed!");

//       // 4. 🛡️ FIREBASE CHECK (Scan status check)
//       const scanRef = ref(db, `scans/${leafHash}`);
//       const snapshot = await get(scanRef);

//       if (snapshot.exists()) {
//         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
//         setIsAlreadyUsed(true);
//         setError(`Security Alert: This unit was already verified on ${scanTime}.`);
//         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
//         setVerifying(false);
//         return; 
//       }

//       // 5. SUCCESS: New Scan logic
//       const now = Date.now();
//       await set(scanRef, {
//         timestamp: now,
//         verifiedBy: walletAddress || "Anonymous",
//         productId: data.p,
//         batchId: data.b
//       });

//       if (walletAddress) {
//         const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
//         await set(historyRef, {
//           productId: data.p,
//           batchId: data.b,
//           productName: proddet.data.productName,
//           mfg_date: unit.mfg_date,
//           timestamp: now,
//           status: "Authentic"
//         });
//       }

//       setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
//     } catch (err) {
//       console.error("Verification Error:", err);
//       setError(err.reason || err.message || "Connection failed");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   useEffect(() => {
//     let html5QrCode;
//     const setupScanner = async () => {
//       const element = document.getElementById("reader");
//       if (!element) return;
//       html5QrCode = new Html5Qrcode("reader");
//       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
//       try {
//         if (!scanResult) {
//           await html5QrCode.start({ facingMode: "environment" }, qrConfig, (text) => {
//             setScanResult(text);
//             html5QrCode.stop().catch(e => console.error(e));
//           });
//         }
//       } catch (err) { console.warn(err); }
//     };
//     const timer = setTimeout(setupScanner, 800);
//     return () => {
//       clearTimeout(timer);
//       if (html5QrCode && html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e));
//     };
//   }, [scanResult]);

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
//       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
//         {/* Dynamic Header */}
//         <div className="text-center mb-8">
//           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 transition-all duration-500
//             ${!product ? 'bg-slate-300' : error && !isAlreadyUsed ? 'bg-red-500' : isAlreadyUsed ? 'bg-amber-500 shadow-amber-200/50' : verificationData ? 'bg-emerald-600 shadow-emerald-200/50' : 'bg-blue-600 shadow-blue-200/50'}`}>
//             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
//              !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
//              isAlreadyUsed ? <AlertTriangle className="text-white" size={32} /> :
//              verificationData ? <CheckCircle2 className="text-white" size={32} /> :
//              <ScanLine className="text-white" size={32} />}
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
//             {verifying ? "Verifying..." : isAlreadyUsed ? "Already Scanned" : scanResult ? "Authenticated" : "Secure Scan"}
//           </h2>
//         </div>

//         {!scanResult ? (
//           <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
//         ) : (
//           <div className="space-y-6">
//             {!verificationData && !error && !verifying && (
//               <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
//                 <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
//                 <h3 className="font-black text-blue-900 uppercase">QR Captured</h3>
//                 <button onClick={handleVerify} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95">
//                   Verify Now
//                 </button>
//               </div>
//             )}

//             {/* ALERT BOX */}
//             {error && (
//               <div className={`${isAlreadyUsed ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border-2 p-6 rounded-3xl text-center animate-in zoom-in duration-300`}>
//                 <AlertTriangle className={`${isAlreadyUsed ? 'text-amber-500' : 'text-red-500'} mx-auto mb-2`} size={48} />
//                 <h3 className={`font-black uppercase tracking-tight ${isAlreadyUsed ? 'text-amber-900' : 'text-red-900'}`}>
//                   {isAlreadyUsed ? "Duplicate Scan Found" : "Fraud Detected"}
//                 </h3>
//                 <p className={`text-[10px] font-bold mt-2 uppercase leading-tight ${isAlreadyUsed ? 'text-amber-700' : 'text-red-700'}`}>{error}</p>
//               </div>
//             )}

//             {/* PRODUCT DETAILS CARD */}
//             {verificationData && (
//               <div className={`bg-white border-2 ${isAlreadyUsed ? 'border-amber-100 shadow-amber-50' : 'border-emerald-100 shadow-emerald-50'} p-6 rounded-3xl shadow-xl animate-in fade-in duration-500`}>
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="font-black text-slate-900 uppercase text-lg italic tracking-tight">Product Profile</h3>
//                     {isAlreadyUsed ? <History className="text-amber-500" size={24} /> : <ShieldCheck className="text-emerald-500" size={24} />}
//                 </div>
//                 <div className="space-y-3 border-t border-slate-100 pt-4 text-[13px] font-bold text-slate-600">
//                    <div className="flex justify-between"><span>Name:</span><span className="text-slate-900">{productName}</span></div>
//                    <div className="flex justify-between"><span>Category:</span><span className="text-slate-900 uppercase">{prodtype}</span></div>
//                    <div className="flex justify-between"><span>Manufacturer:</span><span className="text-slate-900">{compname}</span></div>
//                    <div className="flex justify-between items-center gap-4">
//                       <span>Address:</span>
//                       <span className="text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded text-[11px]">{manaddr ? `${manaddr.slice(0, 6)}...${manaddr.slice(-4)}` : "N/A"}</span>
//                    </div>
//                    <div className="flex justify-between border-t border-slate-50 pt-2"><span>Batch Code:</span><span className="text-slate-900 font-mono">#{verificationData.batchId}</span></div>
//                    <div className="flex justify-between"><span>Status:</span>
//                     <span className={`px-2 rounded uppercase text-[10px] ${isAlreadyUsed ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
//                       {isAlreadyUsed ? "Pre-Scanned" : "Original & Secure 🛡️"}
//                     </span>
//                    </div>
//                 </div>
//               </div>
//             )}

//             {!verifying && (
//               <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
//                 <RefreshCw size={20} /> Reset Scanner
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {ScrollArea} from '../../../../../components/ui/scroll-area'

import { 
  ScanLine, ShieldCheck, RefreshCw, Loader2, 
  AlertTriangle, CheckCircle2, History, SearchCheck,
  Copy, Check
} from "lucide-react";
import axios from "axios";
import { ethers } from "ethers";

// ✅ Firebase & Providers
import { db } from "../../../../../lib/firebase"; 
import { ref, get, set } from "firebase/database";
import { useUser } from "../../../../providers/UsersProvider"; 
import { useConnect } from "../../../../providers/ConnectProvider";

export default function ScanMe() {
  const { product, registry } = useUser();
  const { walletAddress } = useConnect(); 

  // --- States ---
  const [productName, setProductName] = useState("");
  const [prodtype, setprodtype] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);
  const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
  const [compname, setcompname] = useState("");
  const [manaddr, setmanaddr] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // --- Copy Logic ---
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- Verification Flow ---
  const handleVerify = async () => {
    if (!scanResult || !product) {
      setError("Blockchain node is connecting... Please wait.");
      return;
    }
    
    setVerifying(true);
    setError(null);
    setIsAlreadyUsed(false);
    
    try {
      const data = JSON.parse(scanResult);
      const leafHash = data.l;

      // 1. 🔥 BLOCKCHAIN & IPFS FETCH (Data gathering phase)
      const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      const productDetails = await product.getProduct(data.p);
      const manufacturerAddr = productDetails.manufacturer; 

      const manbyaddd = await registry.getManufacturer(manufacturerAddr);
      setcompname(manbyaddd.companyName.toUpperCase());

      const proddet = await axios.get(`https://gateway.pinata.cloud/ipfs/${productDetails.details}`);
      setProductName(proddet.data.productName);
      setprodtype(proddet.data.productType);
      setmanaddr(manufacturerAddr);

      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
      const manifest = response.data;
      const unit = manifest.units.find(u => u.leaf === leafHash);

      if (!unit) throw new Error("Fraud: Unit not found in manufacturer records!");

      // 2. Cryptographic Signature Verification
      const messageHash = ethers.solidityPackedKeccak256(
        ["bytes32", "uint256", "bytes32"],
        [data.p, BigInt(data.b), batchInfo.merkleRoot]
      );
      
      const recoveredAddress = ethers.recoverAddress(
        ethers.hashMessage(ethers.toBeArray(messageHash)), 
        manifest.signature
      );

      if (recoveredAddress.toLowerCase() !== manufacturerAddr.toLowerCase()) {
        throw new Error("Security Alert: Manifest signature mismatch!");
      }

      // 3. On-Chain Merkle Proof Verification
      const isValid = await product.verifySerial(data.p, BigInt(data.b), unit.leaf, unit.proof);
      if (!isValid) throw new Error("Blockchain: Merkle proof verification failed!");

      // 4. 🛡️ FIREBASE CHECK (Double Scan Protection)
      const scanRef = ref(db, `scans/${leafHash}`);
      const snapshot = await get(scanRef);

      if (snapshot.exists()) {
        const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
        setIsAlreadyUsed(true);
        setError(`Security Warning: Verified on ${scanTime}. QR may be cloned.`);
        setVerificationData({ ...unit, productId: data.p, batchId: data.b });
        setVerifying(false);
        return; 
      }

      // 5. SUCCESS: First-time Scan
      const now = Date.now();
      await set(scanRef, {
        timestamp: now,
        verifiedBy: walletAddress || "Anonymous",
        productId: data.p,
        batchId: data.b
      });

      if (walletAddress) {
        const historyRef = ref(db, `user_history/${walletAddress}/scans/${leafHash}`);
        await set(historyRef, {
          productId: data.p,
          batchId: data.b,
          productName: proddet.data.productName,
          mfg_date: unit.mfg_date,
          timestamp: now,
          status: "Authentic"
        });
      }

      setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.reason || err.message || "Connection failed");
    } finally {
      setVerifying(false);
    }
  };

  // --- Scanner Initialization ---
  useEffect(() => {
    let html5QrCode;
    const setupScanner = async () => {
      const element = document.getElementById("reader");
      if (!element) return;
      html5QrCode = new Html5Qrcode("reader");
      const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
      try {
        if (!scanResult) {
          await html5QrCode.start({ facingMode: "environment" }, qrConfig, (text) => {
            setScanResult(text);
            html5QrCode.stop().catch(e => console.error(e));
          });
        }
      } catch (err) { console.warn(err); }
    };
    const timer = setTimeout(setupScanner, 800);
    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e));
    };
  }, [scanResult]);

  return (
    <ScrollArea className="h-screen">
    <div className=" bg-[#f8fafc] flex flex-col items-center p-6 font-sans select-none">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
        {/* Dynamic Header State */}
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 transition-all duration-500
            ${!product ? 'bg-slate-300' : error && !isAlreadyUsed ? 'bg-red-500' : isAlreadyUsed ? 'bg-amber-500 shadow-amber-200/50' : verificationData ? 'bg-emerald-600 shadow-emerald-200/50' : 'bg-blue-600 shadow-blue-200/50'}`}>
            {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
             !product ? <RefreshCw className="text-white animate-spin" size={32} /> :
             isAlreadyUsed ? <AlertTriangle className="text-white" size={32} /> :
             verificationData ? <ShieldCheck className="text-white" size={32} /> :
             <ScanLine className="text-white" size={32} />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            {verifying ? "Verifying..." : isAlreadyUsed ? "Duplicate Scan" : scanResult ? "Authentic" : "Secure Scan"}
          </h2>
        </div>

        {!scanResult ? (
          <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square shadow-inner"></div>
        ) : (
          <div className="space-y-6">
            {!verificationData && !error && !verifying && (
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
                <SearchCheck className="mx-auto text-blue-500 mb-2" size={48} />
                <h3 className="font-black text-blue-900 uppercase">QR Captured</h3>
                <button onClick={handleVerify} className="mt-6 w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                  Verify Now
                </button>
              </div>
            )}

            {/* Error/Alert Display */}
            {error && (
              <div className={`${isAlreadyUsed ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border-2 p-6 rounded-3xl text-center animate-in zoom-in duration-300`}>
                <AlertTriangle className={`${isAlreadyUsed ? 'text-amber-500' : 'text-red-500'} mx-auto mb-2`} size={48} />
                <h3 className={`font-black uppercase tracking-tight ${isAlreadyUsed ? 'text-amber-900' : 'text-red-900'}`}>
                  {isAlreadyUsed ? "Unit Pre-Verified" : "Security Alert"}
                </h3>
                <p className={`text-[10px] font-bold mt-2 uppercase leading-tight ${isAlreadyUsed ? 'text-amber-700' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Product Details Display */}
            {verificationData && (
              <div className={`bg-white border-2 ${isAlreadyUsed ? 'border-amber-100 shadow-amber-50' : 'border-emerald-100 shadow-emerald-50'} p-6 rounded-3xl shadow-xl animate-in fade-in duration-500`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-900 uppercase text-lg italic tracking-tight">Product Profile</h3>
                    {isAlreadyUsed ? <History className="text-amber-500" size={24} /> : <CheckCircle2 className="text-emerald-500" size={24} />}
                </div>
                <div className="space-y-3 border-t border-slate-100 pt-4 text-[13px] font-bold text-slate-600">
                   <div className="flex justify-between"><span>Name:</span><span className="text-slate-900">{productName}</span></div>
                   <div className="flex justify-between"><span>Category:</span><span className="text-slate-900 uppercase">{prodtype}</span></div>
                   <div className="flex justify-between"><span>Manufacturer:</span><span className="text-slate-900">{compname}</span></div>
                   
                   {/* ✅ COPYABLE ADDRESS SECTION */}
                   <div className="flex justify-between items-center gap-4 relative">
                      <span>Address:</span>
                      <button 
                        onClick={() => handleCopy(manaddr)}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all active:scale-95 group relative"
                      >
                        <span className="text-blue-600 font-mono text-[11px]">
                          {manaddr ? `${manaddr.slice(0, 6)}...${manaddr.slice(-4)}` : "N/A"}
                        </span>
                        {isCopied ? (
                          <Check size={12} className="text-emerald-500 animate-in zoom-in" />
                        ) : (
                          <Copy size={12} className="text-blue-400 opacity-50 group-hover:opacity-100" />
                        )}
                        {isCopied && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl animate-bounce">
                            COPIED!
                          </div>
                        )}
                      </button>
                   </div>

                   <div className="flex justify-between border-t border-slate-50 pt-2"><span>Batch:</span><span className="text-slate-900 font-mono">#{verificationData.batchId}</span></div>
                   <div className="flex justify-between"><span>Result:</span>
                    <span className={`px-2 py-0.5 rounded uppercase text-[10px] ${isAlreadyUsed ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {isAlreadyUsed ? "Duplicate Detected" : "Blockchain Verified 🛡️"}
                    </span>
                   </div>
                </div>
              </div>
            )}

            {!verifying && (
              <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
                <RefreshCw size={18} /> New Scan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </ScrollArea>
  );
}