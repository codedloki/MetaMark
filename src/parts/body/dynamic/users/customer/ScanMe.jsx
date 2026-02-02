// // import React, { useEffect, useState } from "react";
// // import { Html5Qrcode } from "html5-qrcode";
// // import { 
// //   ScanLine, ShieldCheck, RefreshCw, Loader2, 
// //   AlertTriangle, CheckCircle2, History 
// // } from "lucide-react";
// // import axios from "axios";

// // // ✅ Firebase & Provider Imports
// // import { db } from "../../../../../lib/firebase"; 
// // import { ref, get, set } from "firebase/database";
// // import { useUser } from "../../../../providers/UsersProvider"; 

// // export default function ScanMe() {
// //   const { product } = useUser();
// //   const [scanResult, setScanResult] = useState(null);
// //   const [verifying, setVerifying] = useState(false);
// //   const [verificationData, setVerificationData] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

// //   // ======================== VERIFICATION FLOW ========================
// //   const handleVerify = async (decodedText) => {
// //     setVerifying(true);
// //     setError(null);
// //     setIsAlreadyUsed(false);
    
// //     try {
// //       // 1. QR Data Parsing
// //       const data = JSON.parse(decodedText);
// //       const leafHash = data.l;

// //       // 2. 🔥 FIREBASE CHECK: Kya ye leaf pehle scan ho chuki hai?
// //       const scanRef = ref(db, `scans/${leafHash}`);
// //       const snapshot = await get(scanRef);

// //       if (snapshot.exists()) {
// //         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
// //         setIsAlreadyUsed(true);
// //         setError(`Security Alert: This product was already verified on ${scanTime}.`);
// //         setVerifying(false);
// //         return; 
// //       }

// //       // 3. BLOCKCHAIN FETCH: Batch IPFS Hash nikalna
// //       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
// //       // 4. IPFS FETCH: Manifest se unit details nikalna
// //       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
// //       const unit = response.data.units.find(u => u.leaf === leafHash);

// //       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

// //       // 5. ON-CHAIN VERIFY: Merkle Proof verification (Gasless View Call)
// //       const isValid = await product.verify(batchInfo.merkleRoot, unit.leaf, unit.proof);

// //       if (isValid) {
// //         // 🔥 FIREBASE UPDATE: Success hone par DB mein save karein
// //         await set(scanRef, {
// //           timestamp: Date.now(),
// //           productId: data.p,
// //           batchId: data.b,
// //           verified: true
// //         });

// //         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
// //       } else {
// //         throw new Error("Blockchain mismatch: Not an authentic product!");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.message || "Invalid QR Code format.");
// //     } finally {
// //       setVerifying(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const html5QrCode = new Html5Qrcode("reader");
// //     const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// //     if (!scanResult) {
// //       html5QrCode.start(
// //         { facingMode: "environment" }, 
// //         qrConfig,
// //         (text) => {
// //           setScanResult(text);
// //           html5QrCode.stop();
// //           handleVerify(text); 
// //         },
// //         () => {}
// //       );
// //     }

// //     return () => {
// //       if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e));
// //     };
// //   }, [scanResult]);

// //   return (
// //     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans">
// //       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
// //         {/* Dynamic Header based on state */}
// //         <div className="text-center mb-8">
// //           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
// //             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
// //             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
// //              isAlreadyUsed ? <History className="text-white" size={32} /> :
// //              verificationData ? <ShieldCheck className="text-white" size={32} /> :
// //              <ScanLine className="text-white" size={32} />}
// //           </div>
// //           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
// //             {verifying ? "Verifying..." : isAlreadyUsed ? "Cloned QR?" : "Secure Scan"}
// //           </h2>
// //         </div>

// //         {!scanResult ? (
// //           <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
// //         ) : (
// //           <div className="space-y-6">
            
// //             {/* ⚠️ Case 1: Already Scanned (Double Scan Protection) */}
// //             {isAlreadyUsed && (
// //               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl animate-in zoom-in">
// //                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
// //                 <h3 className="font-black text-amber-900 text-center uppercase">Duplicate Scan</h3>
// //                 <p className="text-[10px] text-amber-700 font-bold mt-2 text-center uppercase leading-tight">
// //                   {error}
// //                 </p>
// //               </div>
// //             )}

// //             {/* ❌ Case 2: Fraud / Error */}
// //             {error && !isAlreadyUsed && (
// //               <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center">
// //                 <AlertTriangle className="mx-auto text-red-500 mb-2" size={48} />
// //                 <h3 className="font-black text-red-900 uppercase italic">Verification Failed</h3>
// //                 <p className="text-[10px] text-red-700 font-bold mt-2 uppercase">{error}</p>
// //               </div>
// //             )}

// //             {/* ✅ Case 3: Success */}
// //             {verificationData && (
// //               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in">
// //                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
// //                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Authentic Product</h3>
// //                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
// //                   <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
// //                   <div className="flex justify-between"><span>Mfg:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
// //                   <div className="flex justify-between"><span>Exp:</span><span className="text-emerald-900">{verificationData.expiry_date}</span></div>
// //                 </div>
// //               </div>
// //             )}

// //             <button 
// //               onClick={() => window.location.reload()}
// //               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
// //             >
// //               <RefreshCw size={20} /> New Scan
// //             </button>
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
//   AlertTriangle, CheckCircle2, History, Beaker 
// } from "lucide-react";
// import axios from "axios";

// import { db } from "../../../../../lib/firebase"; 
// import { ref, get, set } from "firebase/database";
// import { useUser } from "../../../../providers/UsersProvider"; 

// export default function ScanMe() {
//   const { product } = useUser();
//   const [scanResult, setScanResult] = useState(null);
//   const [verifying, setVerifying] = useState(false);
//   const [verificationData, setVerificationData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

//   const runStaticTest = () => {
//     const testPayload = {
//       p: "0xf30232bb749dde6f1b4162c8da86180ff1c0ff02eca78993629517de3ef4fb69",
//       b: "3",
//       l: "0x0d333f9c989d839383532e1b10aa4673c76d1f874a1fbb5b2ffb0ea30e8ab449"
//     };
//     setScanResult(JSON.stringify(testPayload));
//     handleVerify(JSON.stringify(testPayload));
//   };

//   const handleVerify = async (decodedText) => {
//     setVerifying(true);
//     setError(null);
//     setIsAlreadyUsed(false);
    
//     try {
//       const data = JSON.parse(decodedText);
//       const leafHash = data.l;

//       const scanRef = ref(db, `scans/${leafHash}`);
//       const snapshot = await get(scanRef);

//       if (snapshot.exists()) {
//         const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
//         setIsAlreadyUsed(true);
//         setError(`Security Alert: This product was already verified on ${scanTime}.`);
//         setVerifying(false);
//         return; 
//       }

//       const batchInfo = await product.getBatch(data.p, BigInt(data.b));
//       const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
//       const unit = response.data.units.find(u => u.leaf === leafHash);

//       if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

//       const isValid = await product.verifySerial(batchInfo.merkleRoot, unit.leaf, unit.proof);

//       if (isValid) {
//         await set(scanRef, {
//           timestamp: Date.now(),
//           productId: data.p,
//           batchId: data.b,
//           verified: true
//         });
//         setVerificationData({ ...unit, productId: data.p, batchId: data.b });
//       } else {
//         throw new Error("Blockchain mismatch: Not an authentic product!");
//       }
//     } catch (err) {
//       setError(err.message || "Invalid Data format.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   useEffect(() => {
//     let html5QrCode;

//     // ✅ FIX: Timeout use kar rahe hain taaki DOM element 'reader' render ho jaye
//     const setupScanner = async () => {
//       const element = document.getElementById("reader");
//       if (!element) return;

//       html5QrCode = new Html5Qrcode("reader");
//       const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

//       try {
//         if (!scanResult) {
//           await html5QrCode.start(
//             { facingMode: "environment" }, 
//             qrConfig,
//             (text) => {
//               setScanResult(text);
//               html5QrCode.stop().then(() => handleVerify(text));
//             },
//             () => {}
//           );
//         }
//       } catch (err) {
//         console.warn("Scanner start error:", err);
//       }
//     };

//     const timer = setTimeout(setupScanner, 500); // 0.5 sec wait for DOM

//     return () => {
//       clearTimeout(timer);
//       if (html5QrCode && html5QrCode.isScanning) {
//         html5QrCode.stop().catch(e => console.error(e));
//       }
//     };
//   }, [scanResult]);

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6">
//       <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
//         <div className="text-center mb-8">
//           <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
//             ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
//             {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
//              isAlreadyUsed ? <History className="text-white" size={32} /> :
//              verificationData ? <ShieldCheck className="text-white" size={32} /> :
//              <ScanLine className="text-white" size={32} />}
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
//             {verifying ? "Verifying..." : isAlreadyUsed ? "Cloned QR?" : "Secure Scan"}
//           </h2>
//         </div>

//         {!scanResult ? (
//           <>
//             {/* ✅ Yeh div hona zaroori hai scanner ke liye */}
//             <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
//             <button 
//               onClick={runStaticTest}
//               className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2"
//             >
//               <Beaker size={18} /> Run Static Test
//             </button>
//           </>
//         ) : (
//           <div className="space-y-6">
//             {/* Result Displays (Same as before) */}
//             {error && (
//                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center">
//                  <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
//                  <p className="text-[10px] text-amber-700 font-bold uppercase">{error}</p>
//                </div>
//             )}
//             {verificationData && (
//               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
//                 <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
//                 <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Authentic</h3>
//                 <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
//                    <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
//                    <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
//                 </div>
//               </div>
//             )}
//             <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
//               <RefreshCw size={20} className="inline mr-2" /> New Scan
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { 
  ScanLine, ShieldCheck, RefreshCw, Loader2, 
  AlertTriangle, CheckCircle2, History, Beaker 
} from "lucide-react";
import axios from "axios";

// Firebase & Provider Imports
import { db } from "../../../../../lib/firebase"; 
import { ref, get, set } from "firebase/database";
import { useUser } from "../../../../providers/UsersProvider"; 

export default function ScanMe() {
  const { product } = useUser();
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);
  const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);

  // ======================== STATIC TEST LOGIC ========================
  const runStaticTest = () => {
    const testPayload = {
      p: "0xf30232bb749dde6f1b4162c8da86180ff1c0ff02eca78993629517de3ef4fb69", // productId
      b: "3", // batchId
      l: "0x0d333f9c989d839383532e1b10aa4673c76d1f874a1fbb5b2ffb0ea30e8ab449" // leaf
    };
    setScanResult(JSON.stringify(testPayload));
    handleVerify(JSON.stringify(testPayload));
  };

  // ======================== VERIFICATION FLOW ========================
  const handleVerify = async (decodedText) => {
    setVerifying(true);
    setError(null);
    setIsAlreadyUsed(false);
    
    try {
      // 1. QR Data Parsing
      const data = JSON.parse(decodedText);
      const leafHash = data.l;

      // 2. 🔥 FIREBASE CHECK: Double Scan Protection
      const scanRef = ref(db, `scans/${leafHash}`);
      const snapshot = await get(scanRef);

      if (snapshot.exists()) {
        const scanTime = new Date(snapshot.val().timestamp).toLocaleString();
        setIsAlreadyUsed(true);
        setError(`Security Alert: This product was already verified on ${scanTime}.`);
        setVerifying(false);
        return; 
      }

      console.log("Product Data",data.p)
      
      // 3. BLOCKCHAIN FETCH: Batch Details
      const batchInfo = await product.getBatch(data.p, BigInt(data.b));
      
      // 4. IPFS FETCH: Manifest Details
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${batchInfo.ipfsHash}`);
      const unit = response.data.units.find(u => u.leaf === leafHash);

      if (!unit) throw new Error("Fraud: Unit not found in official manifest!");

      // 5. 🔥 ON-CHAIN VERIFY: Matching your Contract signature
      // function verifySerial(bytes32 _productId, uint256 _batchId, bytes32 _leaf, bytes32[] calldata _merkleProof)
      const tx = await product.verifySerial(
        data.p,           // bytes32 _productId
        BigInt(data.b),   // uint256 _batchId
        unit.leaf,        // bytes32 _leaf
        unit.proof        // bytes32[] _merkleProof
      );

      // Agar ye transaction hai, toh wait karna padega
      if (tx.wait) await tx.wait();

      // 6. 🔥 FIREBASE UPDATE: Mark as Scanned
      await set(scanRef, {
        timestamp: Date.now(),
        productId: data.p,
        batchId: data.b,
        verified: true
      });

      setVerificationData({ ...unit, productId: data.p, batchId: data.b });
      
    } catch (err) {
      console.error("Verification Error:", err);
      // Handling Contract Revert Reasons
      const reason = err.reason || err.message || "Blockchain Error";
      setError(reason.includes("Already verified") ? "Unit already marked on-chain!" : reason);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    let html5QrCode;
    const setupScanner = async () => {
      const element = document.getElementById("reader");
      if (!element) return;

      html5QrCode = new Html5Qrcode("reader");
      const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

      try {
        if (!scanResult) {
          await html5QrCode.start(
            { facingMode: "environment" }, 
            qrConfig,
            (text) => {
              setScanResult(text);
              html5QrCode.stop().then(() => handleVerify(text));
            },
            () => {}
          );
        }
      } catch (err) {
        console.warn("Scanner start error:", err);
      }
    };

    const timer = setTimeout(setupScanner, 500);
    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(e => console.error(e));
      }
    };
  }, [scanResult]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 mt-10">
        
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 
            ${error ? 'bg-amber-500' : verificationData ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            {verifying ? <Loader2 className="text-white animate-spin" size={32} /> : 
             isAlreadyUsed ? <History className="text-white" size={32} /> :
             verificationData ? <ShieldCheck className="text-white" size={32} /> :
             <ScanLine className="text-white" size={32} />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            {verifying ? "Verifying..." : isAlreadyUsed ? "Used Serial" : "Secure Scan"}
          </h2>
        </div>

        {!scanResult ? (
          <>
            <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-100 bg-black aspect-square"></div>
            <button 
              onClick={runStaticTest}
              className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-indigo-100"
            >
              <Beaker size={18} /> Run Static Test (Batch 3)
            </button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Error View */}
            {error && (
               <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center animate-in zoom-in">
                 <AlertTriangle className="mx-auto text-amber-500 mb-2" size={48} />
                 <h3 className="font-black text-amber-900 uppercase">Verification Alert</h3>
                 <p className="text-[10px] text-amber-700 font-bold mt-2 uppercase">{error}</p>
               </div>
            )}

            {/* Success View */}
            {verificationData && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in">
                <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={48} />
                <h3 className="font-black text-emerald-900 text-center uppercase tracking-tighter">Product Authentic</h3>
                <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4 text-[10px] uppercase font-bold">
                   <div className="flex justify-between"><span>Batch:</span><span className="text-emerald-900">#{verificationData.batchId}</span></div>
                   <div className="flex justify-between"><span>Serial:</span><span className="text-emerald-900">{verificationData.serial_no}</span></div>
                   <div className="flex justify-between"><span>Mfg:</span><span className="text-emerald-900">{verificationData.mfg_date}</span></div>
                </div>
              </div>
            )}

            <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
              <RefreshCw size={20} /> New Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}