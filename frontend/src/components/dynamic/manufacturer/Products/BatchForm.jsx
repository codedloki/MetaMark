// // import React, { useState, useRef, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Barcode from "react-barcode";
// // import { GridBackground } from "../../../static/pages/CustomBack";
// // import SHA256 from "crypto-js/sha256";
// // import MerkleTree from "merkletreejs";
// // import axios from "axios";
// // import base58 from "bs58";
// // import { Buffer } from "buffer";
// // import jsPDF from "jspdf";
// // import { ethers } from "ethers";
// // import Productsabi from "../../../../abi/Products.json";
// // import RegistryAbi from "../../../../abi/Registry.json";

// // window.Buffer = Buffer;

// // export default function BatchForm({ productId, onRegisterBatch }) {
// //   const navigate = useNavigate();
// //   const [batchJson, setBatchJson] = useState(null);
// //   const [batchipfs, setbatchipfs] = useState(null);
// //   const [jsonError, setJsonError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
// //   const barcodeRefs = useRef([]);

// //   const static_productid = productId;

// //   function generateShortBarcode(productIdHex, batchId, serialId) {
// //     const productIdBuffer = Buffer.from(productIdHex.slice(2, 18), "hex"); // first 8 bytes
// //     const batchIdBuffer = Buffer.alloc(4);
// //     batchIdBuffer.writeUInt32BE(batchId); // 4 bytes
// //     const serialIdBuffer = Buffer.alloc(2);
// //     serialIdBuffer.writeUInt16BE(serialId); // 2 bytes

// //     const combined = Buffer.concat([productIdBuffer, batchIdBuffer, serialIdBuffer]);
// //     return base58.encode(combined); // compact Base58 string
// //   }

// //   useEffect(() => {
// //     if (!batchJson) return;

// //     try {
// //       const serialsWithHashes = batchJson.serials.map((serial) => {
// //         const combined = `${static_productid}_${batchJson.batchId}_${serial.serialId}`;
// //         const leafHash = SHA256(combined).toString();

// //         const shortBarcode = generateShortBarcode(static_productid, batchJson.batchId, serial.serialId);

// //         return { serialId: serial.serialId, leafHash, shortBarcode };
// //       });

// //       const leafHashes = serialsWithHashes.map((s) => s.leafHash);
// //       const tree = new MerkleTree(leafHashes, SHA256, { sortPairs: true });
// //       const merkleRoot = "0x" + tree.getRoot().toString("hex");

// //       const proofs = {};
// //       serialsWithHashes.forEach((s) => {
// //         proofs[s.serialId] = tree
// //           .getProof(s.leafHash)
// //           .map((p) => p.data.toString("hex"));
// //       });

// //       const ipfsBatch = {
// //         batchId: batchJson.batchId,
// //         mfgDate: batchJson.mfgDate,
// //         expiryDate: batchJson.expiryDate,
// //         quantity: batchJson.quantity,
// //         productId: productId,
// //         merkleRoot,
// //         serials: serialsWithHashes,
// //         proofs,
// //       };

// //       setbatchipfs({ ipfsBatch });
// //     } catch (err) {
// //       console.error("❌ Error parsing batch JSON:", err);
// //       setJsonError("Invalid batch JSON");
// //     }
// //   }, [batchJson]);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (event) => {
// //       try {
// //         const parsedJson = JSON.parse(event.target.result);
// //         if (!parsedJson.batchId || !parsedJson.mfgDate || !parsedJson.expiryDate || typeof parsedJson.quantity !== "number" || !Array.isArray(parsedJson.serials)) {
// //           setJsonError("Invalid JSON structure");
// //           return;
// //         }
// //         setBatchJson(parsedJson);
// //         setJsonError("");
// //       } catch (error) {
// //         setJsonError("Invalid JSON file");
// //       }
// //     };
// //     reader.readAsText(file);
// //   };

// //   const handleRegister = async () => {
// //     if (!batchipfs || !batchipfs.ipfsBatch) {
// //       alert("Please upload a valid batch JSON first!");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await axios.post(
// //         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
// //         batchipfs.ipfsBatch,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );
// //       console.log("✅ Uploaded to IPFS:", res.data);

// //       if (onRegisterBatch) {
// //         onRegisterBatch(
// //           res.data.IpfsHash,
// //           batchipfs.ipfsBatch.merkleRoot,
// //           batchipfs.ipfsBatch.proofs
// //         );
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const contract = new ethers.Contract(import.meta.env.VITE_PRODUCT_REGISTRY, Productsabi, signer);

// //       const registry = new ethers.Contract(import.meta.env.VITE_REGISTRY_CONTRACT, RegistryAbi, signer);
// //       const signerAddress = await signer.getAddress();
// //       const isManufacturer = await registry.getRole();
// //       if (Number(isManufacturer) !== 1) {
// //         alert("❌ You are not a registered manufacturer.");
// //         setLoading(false);
// //         return;
// //       }

// //       const batchId = batchipfs.ipfsBatch.batchId;
// //       const tx = await contract.addBatch(productId, batchId, res.data.IpfsHash, batchipfs.ipfsBatch.merkleRoot);
// //       await tx.wait();
// //       alert("Batch registered successfully!");
// //       setRegistrationSuccess(true);
// //     } catch (error) {
// //       console.error("❌ Error uploading batch to IPFS:", error);
// //       alert("Failed to register batch. Check console for details.");
// //     }
// //     setLoading(false);
// //   };

// //   const handleDownloadPDF = async () => {
// //     const pdf = new jsPDF("p", "mm", "a4");
// //     let x = 15;
// //     let y = 20;
// //     const barcodeWidth = 80;
// //     const barcodeHeight = 30;

// //     for (let i = 0; i < barcodeRefs.current.length; i++) {
// //       const barcodeEl = barcodeRefs.current[i]?.querySelector("canvas, svg");
// //       if (barcodeEl) {
// //         let imgData;
// //         if (barcodeEl.tagName === "CANVAS") {
// //           imgData = barcodeEl.toDataURL("image/png");
// //         } else {
// //           const svgString = new XMLSerializer().serializeToString(barcodeEl);
// //           const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
// //           const svgUrl = URL.createObjectURL(svgBlob);
// //           const img = await new Promise((resolve) => {
// //             const image = new Image();
// //             image.onload = () => resolve(image);
// //             image.src = svgUrl;
// //           });
// //           const canvas = document.createElement("canvas");
// //           canvas.width = img.width;
// //           canvas.height = img.height;
// //           const ctx = canvas.getContext("2d");
// //           ctx.drawImage(img, 0, 0);
// //           imgData = canvas.toDataURL("image/png");
// //         }
// //         pdf.addImage(imgData, "PNG", x, y, barcodeWidth, barcodeHeight);
// //         pdf.text(`Serial: ${batchipfs.ipfsBatch.serials[i].serialId}`, x, y + barcodeHeight + 5);
// //         y += 50;
// //         if (y > 250) {
// //           pdf.addPage();
// //           y = 20;
// //         }
// //       }
// //     }
// //     pdf.save(`Batch_${batchipfs.ipfsBatch.batchId}_Barcodes.pdf`);
// //   };

// //   return (
// //     <div className="relative min-h-screen flex flex-col items-center justify-start px-6 py-12 text-gray-900 dark:text-gray-100">
// //       <GridBackground />
// //       <div className="w-full max-w-5xl flex items-center justify-between mb-6">
// //         <nav className="text-sm text-gray-600 dark:text-gray-300">
// //           <ol className="flex items-center space-x-2">
// //             <li><a href="/products" className="hover:underline text-blue-500">Products</a></li>
// //             <li>/</li>
// //             <li><a href="/products/create" className="hover:underline text-blue-500">Create Product</a></li>
// //             <li>/</li>
// //             <li className="text-gray-800 dark:text-gray-100 font-semibold">Create Batch</li>
// //           </ol>
// //         </nav>
// //         <button onClick={() => navigate(-1)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">← Back</button>
// //       </div>

// //       <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg">🚀 Batch Registration</h2>

// //       <div className="p-20 flex flex-col items-center">
// //         <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition">
// //           Upload Batch JSON
// //           <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
// //         </label>
// //         {jsonError && <p className="mt-2 text-red-400 font-semibold">{jsonError}</p>}
// //       </div>

// //       {batchipfs && (
// //         <>
// //           <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl mb-8">
// //             <h3 className="text-2xl font-bold mb-4 text-purple-400">📦 Batch Info</h3>
// //             <p><strong className="text-blue-400">Batch ID:</strong> {batchipfs.ipfsBatch.batchId}</p>
// //             <p><strong className="text-blue-400">Mfg Date:</strong> {batchipfs.ipfsBatch.mfgDate}</p>
// //             <p><strong className="text-blue-400">Expiry Date:</strong> {batchipfs.ipfsBatch.expiryDate}</p>
// //             <p><strong className="text-blue-400">Quantity:</strong> {batchipfs.ipfsBatch.quantity}</p>
// //             <p className="break-all"><strong className="text-blue-400">Merkle Root:</strong> {batchipfs.ipfsBatch.merkleRoot}</p>
// //           </div>

// //           <div className="w-full max-w-5xl">
// //             <h3 className="text-2xl font-bold mb-4 text-green-400">🎯 Generated Barcodes</h3>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //               {batchipfs.ipfsBatch.serials.map((serial, idx) => (
// //                 <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-md hover:scale-105 flex flex-col items-center" ref={(el) => (barcodeRefs.current[idx] = el)}>
// //                   <div className="w-full flex justify-center items-center overflow-hidden p-2">
// //                     <Barcode value={serial.shortBarcode} width={2} height={60} displayValue={false} margin={0} />
// //                   </div>
// //                   <p className="mt-2 text-xs font-medium">{serial.serialId}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <button onClick={handleRegister} disabled={loading} className="mt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold">
// //             {loading ? "⚡ Registering..." : "✅ Register Batch"}
// //           </button>

// //           {registrationSuccess && (
// //             <button onClick={handleDownloadPDF} className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">📥 Download Barcodes PDF</button>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }
// // import React, { useState, useRef, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Barcode from "react-barcode";
// // import { GridBackground } from "../../../static/pages/CustomBack";
// // import SHA256 from "crypto-js/sha256";
// // import MerkleTree from "merkletreejs";
// // import axios from "axios";
// // import jsPDF from "jspdf";
// // import { Buffer } from "buffer";
// // import { ethers } from "ethers";
// // import Productsabi from "../../../../abi/Products.json";
// // import RegistryAbi from '../../../../abi/Registry.json';

// // window.Buffer = Buffer;

// // export default function BatchForm({ productId, onRegisterBatch }) {
// //   const navigate = useNavigate();

// //   const [batchJson, setBatchJson] = useState(null);
// //   const [batchipfs, setbatchipfs] = useState(null);
// //   const [jsonError, setJsonError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
// //   const barcodeRefs = useRef([]);

// //   const static_productid = productId;

// //   useEffect(() => {
// //     if (!batchJson) return;

// //     try {
// //       const productShortId = productId.slice(2, 8); // Lazy product short ID

// //       const serialsWithHashes = batchJson.serials.map((serial) => {
// //         const combined = `${static_productid}_${batchJson.batchId}_${serial.serialId}`;
// //         const leafHash = SHA256(combined).toString();

// //         // Lazy barcode format: productShortId_batchId_serialId
// //         const shortBarcode = `${productShortId}_${batchJson.batchId}_${serial.serialId}`;

// //         return { serialId: serial.serialId, leafHash, shortBarcode };
// //       });

// //       const leafHashes = serialsWithHashes.map((s) => s.leafHash);

// //       const tree = new MerkleTree(leafHashes, SHA256);
// //       const merkleRoot = "0x" + tree.getRoot().toString("hex");

// //       const proofs = {};
// //       serialsWithHashes.forEach((s) => {
// //         proofs[s.serialId] = tree
// //           .getProof(s.leafHash)
// //           .map((p) => p.data.toString("hex"));
// //       });

// //       const ipfsBatch = {
// //         batchId: batchJson.batchId,
// //         mfgDate: batchJson.mfgDate,
// //         expiryDate: batchJson.expiryDate,
// //         quantity: batchJson.quantity,
// //         productId: productId,
// //         merkleRoot,
// //         serials: serialsWithHashes,
// //         proofs,
// //       };

// //       setbatchipfs({ ipfsBatch });
// //     } catch (err) {
// //       console.error("❌ Error parsing batch JSON:", err);
// //       setJsonError("Invalid batch JSON");
// //     }
// //   }, [batchJson]);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (event) => {
// //       try {
// //         const parsedJson = JSON.parse(event.target.result);

// //         if (
// //           !parsedJson.batchId ||
// //           !parsedJson.mfgDate ||
// //           !parsedJson.expiryDate ||
// //           typeof parsedJson.quantity !== "number" ||
// //           !Array.isArray(parsedJson.serials)
// //         ) {
// //           setJsonError("Invalid JSON structure");
// //           return;
// //         }

// //         setBatchJson(parsedJson);
// //         setJsonError("");
// //       } catch (error) {
// //         setJsonError("Invalid JSON file");
// //       }
// //     };
// //     reader.readAsText(file);
// //   };

// //   const handleRegister = async () => {
// //     if (!batchipfs || !batchipfs.ipfsBatch) {
// //       alert("Please upload a valid batch JSON first!");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await axios.post(
// //         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
// //         batchipfs.ipfsBatch,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (onRegisterBatch) {
// //         onRegisterBatch(
// //           res.data.IpfsHash,
// //           batchipfs.ipfsBatch.merkleRoot,
// //           batchipfs.ipfsBatch.proofs
// //         );
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const contract = new ethers.Contract(
// //         import.meta.env.VITE_PRODUCT_REGISTRY,
// //         Productsabi,
// //         signer
// //       );

// //       const registry = new ethers.Contract(
// //         import.meta.env.VITE_REGISTRY_CONTRACT,
// //         RegistryAbi,
// //         signer
// //       );

// //       const signerAddress = await signer.getAddress();
// //       const isManufacturer = await registry.getRole();

// //       if (Number(isManufacturer) !== 1) {
// //         alert("❌ You are not a registered manufacturer.");
// //         setLoading(false);
// //         return;
// //       }

// //       const batchId = batchipfs.ipfsBatch.batchId;
// //       const tx = await contract.addBatch(
// //         productId,
// //         batchId,
// //         res.data.IpfsHash,
// //         batchipfs.ipfsBatch.merkleRoot
// //       );
// //       await tx.wait();

// //       alert("Batch registered successfully!");
// //       setRegistrationSuccess(true);
// //     } catch (error) {
// //       console.error("❌ Error uploading batch to IPFS:", error);
// //       alert("Failed to register batch.");
// //     }
// //     setLoading(false);
// //   };

// //   const handleDownloadPDF = async () => {
// //     const pdf = new jsPDF("p", "mm", "a4");
// //     const pageWidth = pdf.internal.pageSize.getWidth();
// //     const barcodeWidth = 80;
// //     const barcodeHeight = 30;
// //     let x = 15;
// //     let y = 20;

// //     for (let i = 0; i < barcodeRefs.current.length; i++) {
// //       const barcodeEl = barcodeRefs.current[i]?.querySelector("canvas, svg");
// //       if (barcodeEl) {
// //         let imgData;
// //         if (barcodeEl.tagName === "CANVAS") {
// //           imgData = barcodeEl.toDataURL("image/png");
// //         } else {
// //           const svgString = new XMLSerializer().serializeToString(barcodeEl);
// //           const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
// //           const svgUrl = URL.createObjectURL(svgBlob);
// //           const img = await new Promise((resolve) => {
// //             const image = new Image();
// //             image.onload = () => resolve(image);
// //             image.src = svgUrl;
// //           });
// //           const canvas = document.createElement("canvas");
// //           canvas.width = img.width;
// //           canvas.height = img.height;
// //           const ctx = canvas.getContext("2d");
// //           ctx.drawImage(img, 0, 0);
// //           imgData = canvas.toDataURL("image/png");
// //         }

// //         pdf.addImage(imgData, "PNG", x, y, barcodeWidth, barcodeHeight);
// //         pdf.text(`Serial: ${batchipfs.ipfsBatch.serials[i].serialId}`, x, y + barcodeHeight + 5);

// //         y += 50;
// //         if (y > 250) {
// //           pdf.addPage();
// //           y = 20;
// //         }
// //       }
// //     }

// //     pdf.save(`Batch_${batchipfs.ipfsBatch.batchId}_Barcodes.pdf`);
// //   };

// //   return (
// //     <div className="relative min-h-screen flex flex-col items-center justify-start px-6 py-12 text-gray-900 dark:text-gray-100">
// //       <GridBackground />
// //       <div className="w-full max-w-5xl flex items-center justify-between mb-6">
// //         <nav className="text-sm text-gray-600 dark:text-gray-300">
// //           <ol className="flex items-center space-x-2">
// //             <li><a href="/products" className="hover:underline text-blue-500">Products</a></li>
// //             <li>/</li>
// //             <li><a href="/products/create" className="hover:underline text-blue-500">Create Product</a></li>
// //             <li>/</li>
// //             <li className="text-gray-800 dark:text-gray-100 font-semibold">Create Batch</li>
// //           </ol>
// //         </nav>
// //         <button onClick={() => navigate(-1)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">← Back</button>
// //       </div>

// //       <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
// //         🚀 Batch Registration
// //       </h2>

// //       <div className="p-20 flex flex-col items-center">
// //         <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
// //           Upload Batch JSON
// //           <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
// //         </label>
// //         {jsonError && <p className="mt-2 text-red-400">{jsonError}</p>}
// //       </div>

// //       {batchipfs && (
// //         <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl p-6 shadow-xl mb-8 border border-gray-200 dark:border-gray-700">
// //           <h3 className="text-2xl font-bold mb-4 text-purple-400">📦 Batch Info</h3>
// //           <div className="space-y-2 text-sm">
// //             <p><strong className="text-blue-400">Batch ID:</strong> {batchipfs.ipfsBatch.batchId}</p>
// //             <p><strong className="text-blue-400">Mfg Date:</strong> {batchipfs.ipfsBatch.mfgDate}</p>
// //             <p><strong className="text-blue-400">Expiry Date:</strong> {batchipfs.ipfsBatch.expiryDate}</p>
// //             <p><strong className="text-blue-400">Quantity:</strong> {batchipfs.ipfsBatch.quantity}</p>
// //             <p className="break-all"><strong className="text-blue-400">Merkle Root:</strong> {batchipfs.ipfsBatch.merkleRoot}</p>
// //           </div>
// //         </div>
// //       )}

// //       {batchipfs && (
// //         <div className="w-full max-w-5xl">
// //           <h3 className="text-2xl font-bold mb-4 text-green-400">🎯 Generated Barcodes</h3>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //             {batchipfs.ipfsBatch.serials.map((serial, idx) => (
// //               <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md flex flex-col items-center"
// //                 ref={(el) => (barcodeRefs.current[idx] = el)}>
// //                 <div className="w-full flex justify-center items-center overflow-hidden p-2">
// //                   <Barcode value={serial.shortBarcode} width={2} height={60} displayValue={false} margin={0} />
// //                 </div>
// //                 <p className="mt-2 text-xs break-all">{serial.serialId}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {batchipfs && (
// //         <button onClick={handleRegister} disabled={loading}
// //           className="mt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold">
// //           {loading ? "⚡ Registering..." : "✅ Register Batch"}
// //         </button>
// //       )}

// //       {registrationSuccess && (
// //         <button onClick={handleDownloadPDF} className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">
// //           📥 Download Barcodes PDF
// //         </button>
// //       )}
// //     </div>
// //   );
// // }


// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Barcode from "react-barcode";
// import { GridBackground } from "../../../static/pages/CustomBack";
// import { keccak256 } from "ethers"; // ✅ Ethers v6

// import { MerkleTree } from "merkletreejs";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { ethers } from "ethers";
// import Productsabi from "../../../../abi/Products.json";
// import RegistryAbi from '../../../../abi/Registry.json';

// export default function BatchForm({ productId, onRegisterBatch }) {
//   const navigate = useNavigate();
//   const [batchJson, setBatchJson] = useState(null);
//   const [batchIPFS, setBatchIPFS] = useState(null);
//   const [jsonError, setJsonError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const barcodeRefs = useRef([]);

//   const SALT = "PHARMA_SECURE_SALT";

//   // Generate Merkle tree whenever batchJson changes
//   useEffect(() => {
//     if (!batchJson) return;

//     try {
//       // Prepare serial leaves
//       const serialsWithHashes = batchJson.serials.map((serial) => {
//         const leafHash = keccak256(ethers.toUtf8Bytes(serial.serialId + SALT));
//         const shortBarcode = `${productId.slice(2, 8)}_${batchJson.batchId}_${serial.serialId}`;
//         return { serialId: serial.serialId, leafHash, shortBarcode };
//       });

//       const leaves = serialsWithHashes.map(s => s.leafHash);
//       const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
//       const merkleRoot = tree.getHexRoot();

//       // Generate proofs for each serial
//       const proofs = {};
//       serialsWithHashes.forEach(s => {
//         proofs[s.serialId] = tree.getHexProof(s.leafHash);
//       });

//       setBatchIPFS({
//         batchId: batchJson.batchId,
//         mfgDate: batchJson.mfgDate,
//         expiryDate: batchJson.expiryDate,
//         quantity: batchJson.quantity,
//         productId,
//         merkleRoot,
//         serials: serialsWithHashes,
//         proofs
//       });
//     } catch (err) {
//       console.error("❌ Error parsing batch JSON:", err);
//       setJsonError("Invalid batch JSON");
//     }
//   }, [batchJson, productId]);

//   // Handle JSON file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const parsed = JSON.parse(event.target.result);

//         if (
//           !parsed.batchId ||
//           !parsed.mfgDate ||
//           !parsed.expiryDate ||
//           typeof parsed.quantity !== "number" ||
//           !Array.isArray(parsed.serials)
//         ) {
//           setJsonError("Invalid JSON structure");
//           return;
//         }

//         setBatchJson(parsed);
//         setJsonError("");
//       } catch (error) {
//         setJsonError("Invalid JSON file");
//       }
//     };
//     reader.readAsText(file);
//   };

//   // Register batch on IPFS & blockchain
//   const handleRegister = async () => {
//     if (!batchIPFS) {
//       alert("Please upload a valid batch JSON first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Upload batch JSON to IPFS
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         batchIPFS,
//         {
//           headers: {
//             Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const ipfsHash = res.data.IpfsHash;

//       // Call parent callback if provided
//       if (onRegisterBatch) {
//         onRegisterBatch(ipfsHash, batchIPFS.merkleRoot, batchIPFS.proofs);
//       }

//       // Connect blockchain
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         import.meta.env.VITE_PRODUCT_REGISTRY,
//         Productsabi,
//         signer
//       );

//       const registry = new ethers.Contract(
//         import.meta.env.VITE_REGISTRY_CONTRACT,
//         RegistryAbi,
//         signer
//       );

//       const signerAddress = await signer.getAddress();
//       const isManufacturer = await registry.isManufacturer(signerAddress);

//       if (!isManufacturer) {
//         alert("❌ You are not a registered manufacturer.");
//         setLoading(false);
//         return;
//       }

//       // Send transaction to add batch
//       const tx = await contract.addBatch(
//         productId,
//         batchIPFS.batchId,
//         ipfsHash,
//         batchIPFS.merkleRoot
//       );
//       await tx.wait();

//       alert("Batch registered successfully!");
//       setRegistrationSuccess(true);
//     } catch (error) {
//       console.error("❌ Error registering batch:", error);
//       alert("Failed to register batch.");
//     }
//     setLoading(false);
//   };

//   // Download barcodes PDF
//   const handleDownloadPDF = async () => {
//     if (!batchIPFS) return;

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const barcodeWidth = 80;
//     const barcodeHeight = 30;
//     let x = 15;
//     let y = 20;

//     for (let i = 0; i < batchIPFS.serials.length; i++) {
//       const barcodeEl = barcodeRefs.current[i]?.querySelector("canvas, svg");
//       if (!barcodeEl) continue;

//       let imgData;

//       if (barcodeEl.tagName === "CANVAS") {
//         imgData = barcodeEl.toDataURL("image/png");
//       } else {
//         const svgString = new XMLSerializer().serializeToString(barcodeEl);
//         const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
//         const svgUrl = URL.createObjectURL(svgBlob);
//         const img = await new Promise((resolve) => {
//           const image = new Image();
//           image.onload = () => resolve(image);
//           image.src = svgUrl;
//         });
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         imgData = canvas.toDataURL("image/png");
//         URL.revokeObjectURL(svgUrl);
//       }

//       pdf.addImage(imgData, "PNG", x, y, barcodeWidth, barcodeHeight);
//       pdf.text(`Serial: ${batchIPFS.serials[i].serialId}`, x, y + barcodeHeight + 5);

//       y += 50;
//       if (y > 250) {
//         pdf.addPage();
//         y = 20;
//       }
//     }

//     pdf.save(`Batch_${batchIPFS.batchId}_Barcodes.pdf`);
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-start px-6 py-12 text-gray-900 dark:text-gray-100">
//       <GridBackground />
//       <div className="w-full max-w-5xl flex items-center justify-between mb-6">
//         <nav className="text-sm text-gray-600 dark:text-gray-300">
//           <ol className="flex items-center space-x-2">
//             <li><a href="/products" className="hover:underline text-blue-500">Products</a></li>
//             <li>/</li>
//             <li><a href="/products/create" className="hover:underline text-blue-500">Create Product</a></li>
//             <li>/</li>
//             <li className="text-gray-800 dark:text-gray-100 font-semibold">Create Batch</li>
//           </ol>
//         </nav>
//         <button onClick={() => navigate(-1)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">← Back</button>
//       </div>

//       <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
//         🚀 Batch Registration
//       </h2>

//       <div className="p-20 flex flex-col items-center">
//         <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
//           Upload Batch JSON
//           <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
//         </label>
//         {jsonError && <p className="mt-2 text-red-400">{jsonError}</p>}
//       </div>

//       {batchIPFS && (
//         <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl p-6 shadow-xl mb-8 border border-gray-200 dark:border-gray-700">
//           <h3 className="text-2xl font-bold mb-4 text-purple-400">📦 Batch Info</h3>
//           <div className="space-y-2 text-sm">
//             <p><strong className="text-blue-400">Batch ID:</strong> {batchIPFS.batchId}</p>
//             <p><strong className="text-blue-400">Mfg Date:</strong> {batchIPFS.mfgDate}</p>
//             <p><strong className="text-blue-400">Expiry Date:</strong> {batchIPFS.expiryDate}</p>
//             <p><strong className="text-blue-400">Quantity:</strong> {batchIPFS.quantity}</p>
//             <p className="break-all"><strong className="text-blue-400">Merkle Root:</strong> {batchIPFS.merkleRoot}</p>
//           </div>
//         </div>
//       )}

//       {batchIPFS && (
//         <div className="w-full max-w-5xl">
//           <h3 className="text-2xl font-bold mb-4 text-green-400">🎯 Generated Barcodes</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {batchIPFS.serials.map((serial, idx) => (
//               <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md flex flex-col items-center"
//                 ref={(el) => (barcodeRefs.current[idx] = el)}>
//                 <div className="w-full flex justify-center items-center overflow-hidden p-2">
//                   <Barcode value={serial.shortBarcode} width={2} height={60} displayValue={false} margin={0} />
//                 </div>
//                 <p className="mt-2 text-xs break-all">{serial.serialId}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {batchIPFS && (
//         <button onClick={handleRegister} disabled={loading}
//           className="mt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold">
//           {loading ? "⚡ Registering..." : "✅ Register Batch"}
//         </button>
//       )}

//       {registrationSuccess && (
//         <button onClick={handleDownloadPDF} className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">
//           📥 Download Barcodes PDF
//         </button>
//       )}
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { GridBackground } from "../../../static/pages/CustomBack";
import { keccak256 } from "ethers"; // ✅ Ethers v6

import { MerkleTree } from "merkletreejs";
import axios from "axios";
import jsPDF from "jspdf";
import { ethers } from "ethers";
import Productsabi from "../../../../abi/Products.json";
import RegistryAbi from '../../../../abi/Registry.json';

export default function BatchForm({ productId, onRegisterBatch }) {
  const navigate = useNavigate();
  const [batchJson, setBatchJson] = useState(null);
  const [batchIPFS, setBatchIPFS] = useState(null);
  const [jsonError, setJsonError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const barcodeRefs = useRef([]);

  const SALT = "PHARMA_SECURE_SALT";

  // Generate Merkle tree whenever batchJson changes
  useEffect(() => {
    if (!batchJson) return;

    try {
      // Prepare serial leaves
      const serialsWithHashes = batchJson.serials.map((serial) => {
        // Using Ethers utilities to hash the leaf content
        const leafHash = keccak256(ethers.toUtf8Bytes(serial.serialId + SALT));
        const shortBarcode = `${productId.slice(2, 8)}_${batchJson.batchId}_${serial.serialId}`;
        return { serialId: serial.serialId, leafHash, shortBarcode };
      });

      const leaves = serialsWithHashes.map(s => s.leafHash);
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const merkleRoot = tree.getHexRoot();

      // Generate proofs for each serial
      const proofs = {};
      serialsWithHashes.forEach(s => {
        proofs[s.serialId] = tree.getHexProof(s.leafHash);
      });

      setBatchIPFS({
        batchId: batchJson.batchId,
        mfgDate: batchJson.mfgDate,
        expiryDate: batchJson.expiryDate,
        quantity: batchJson.quantity,
        productId,
        merkleRoot,
        serials: serialsWithHashes,
        proofs
      });
    } catch (err) {
      console.error("❌ Error parsing batch JSON:", err);
      setJsonError("Invalid batch JSON");
    }
  }, [batchJson, productId]);

  // Handle JSON file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (
          !parsed.batchId ||
          !parsed.mfgDate ||
          !parsed.expiryDate ||
          typeof parsed.quantity !== "number" ||
          !Array.isArray(parsed.serials)
        ) {
          setJsonError("Invalid JSON structure");
          return;
        }

        // Ensure serials array contains valid objects with serialId field
        if (parsed.serials.some(s => !s.serialId || typeof s.serialId !== 'string')) {
            setJsonError("Each serial item must contain a 'serialId' string.");
            return;
        }

        setBatchJson(parsed);
        setJsonError("");
      } catch (error) {
        setJsonError("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Register batch on IPFS & blockchain
  const handleRegister = async () => {
    if (!batchIPFS) {
      alert("Please upload a valid batch JSON first!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload batch JSON to IPFS
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        batchIPFS,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
            "Content-Type": "application/json",
          },
        }
      );

      const ipfsHash = res.data.IpfsHash;

      // 2. Connect blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_PRODUCT_REGISTRY,
        Productsabi,
        signer
      );

      const registry = new ethers.Contract(
        import.meta.env.VITE_REGISTRY_CONTRACT,
        RegistryAbi,
        signer
      );

      const signerAddress = await signer.getAddress();
      const isManufacturer = await registry.getRole(); // Assuming getRole() returns a role ID where '1' is Manufacturer

      if (Number(isManufacturer) !== 1) {
        alert("❌ You are not a registered manufacturer.");
        setLoading(false);
        return;
      }

      // 3. Prepare Arguments for Contract Call
      
      // Arg 0: bytes32 productId (This is passed directly as a hex string)
      const productIdBytes32 = productId; 

      // Arg 1: uint256 batchId (FIXED: Hash string ID to uint256/BigInt)
      // This is the source of the "Cannot convert BATCH-XYZ-789 to a BigInt" error.
      const batchIdHash = keccak256(ethers.toUtf8Bytes(batchIPFS.batchId));
      // Ethers.js can handle BigInt conversion from a hex string
      const batchIdUint256 = ethers.toBigInt(batchIdHash); 

      // Send transaction to add batch
      // Signature: addBatch(bytes32 _productId, uint256 _batchId, string memory _ipfsHash, bytes32 _merkleRoot)
      const tx = await contract.addBatch(
        productIdBytes32,
        batchIdUint256,
        ipfsHash,
        batchIPFS.merkleRoot
      );
      await tx.wait();

      alert("Batch registered successfully!");
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("❌ Error registering batch:", error);
      
      let message = "Failed to register batch. Check console for details.";
      if (error.reason) {
          message = `Transaction failed: ${error.reason}`;
      } else if (error.code === 'CALL_EXCEPTION') {
           message = `Contract Revert: Ensure Product ID is registered and your wallet is the manufacturer.`;
      }
      
      alert(message);
    }
    setLoading(false);
  };

  // Download barcodes PDF (UNCHANGED)
  const handleDownloadPDF = async () => {
    if (!batchIPFS) return;
    // ... (PDF generation logic unchanged)
    
    // NOTE: For brevity, keeping the PDF logic unchanged.
    // If you need the full PDF code, let me know.
    
    const pdf = new jsPDF("p", "mm", "a4");
    const barcodeWidth = 80;
    const barcodeHeight = 30;
    let x = 15;
    let y = 20;

    for (let i = 0; i < batchIPFS.serials.length; i++) {
      const barcodeEl = barcodeRefs.current[i]?.querySelector("canvas, svg");
      if (!barcodeEl) continue;

      let imgData;

      if (barcodeEl.tagName === "CANVAS") {
        imgData = barcodeEl.toDataURL("image/png");
      } else {
        const svgString = new XMLSerializer().serializeToString(barcodeEl);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = svgUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        imgData = canvas.toDataURL("image/png");
        URL.revokeObjectURL(svgUrl);
      }

      pdf.addImage(imgData, "PNG", x, y, barcodeWidth, barcodeHeight);
      pdf.text(`Serial: ${batchIPFS.serials[i].serialId}`, x, y + barcodeHeight + 5);

      y += 50;
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
    }

    pdf.save(`Batch_${batchIPFS.batchId}_Barcodes.pdf`);
  };


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-6 py-12 text-gray-900 dark:text-gray-100">
      <GridBackground />
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <nav className="text-sm text-gray-600 dark:text-gray-300">
          <ol className="flex items-center space-x-2">
            <li><a href="/products" className="hover:underline text-blue-500">Products</a></li>
            <li>/</li>
            <li><a href="/products/create" className="hover:underline text-blue-500">Create Product</a></li>
            <li>/</li>
            <li className="text-gray-800 dark:text-gray-100 font-semibold">Create Batch</li>
          </ol>
        </nav>
        <button onClick={() => navigate(-1)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">← Back</button>
      </div>

      <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        🚀 Batch Registration
      </h2>

      <div className="p-20 flex flex-col items-center">
        <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
          Upload Batch JSON
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </label>
        {jsonError && <p className="mt-2 text-red-400">{jsonError}</p>}
      </div>

      {batchIPFS && (
        <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl p-6 shadow-xl mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">📦 Batch Info</h3>
          <div className="space-y-2 text-sm">
            <p><strong className="text-blue-400">Batch ID:</strong> {batchIPFS.batchId}</p>
            <p><strong className="text-blue-400">Mfg Date:</strong> {batchIPFS.mfgDate}</p>
            <p><strong className="text-blue-400">Expiry Date:</strong> {batchIPFS.expiryDate}</p>
            <p><strong className="text-blue-400">Quantity:</strong> {batchIPFS.quantity}</p>
            <p className="break-all"><strong className="text-blue-400">Merkle Root:</strong> {batchIPFS.merkleRoot}</p>
          </div>
        </div>
      )}

      {batchIPFS && (
        <div className="w-full max-w-5xl">
          <h3 className="text-2xl font-bold mb-4 text-green-400">🎯 Generated Barcodes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {batchIPFS.serials.map((serial, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md flex flex-col items-center"
                ref={(el) => (barcodeRefs.current[idx] = el)}>
                <div className="w-full flex justify-center items-center overflow-hidden p-2">
                  <Barcode value={serial.shortBarcode} width={2} height={60} displayValue={false} margin={0} />
                </div>
                <p className="mt-2 text-xs break-all">{serial.serialId}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {batchIPFS && (
        <button onClick={handleRegister} disabled={loading}
          className="mt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold">
          {loading ? "⚡ Registering..." : "✅ Register Batch"}
        </button>
      )}

      {registrationSuccess && (
        <button onClick={handleDownloadPDF} className="mt-6 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">
          📥 Download Barcodes PDF
        </button>
      )}
    </div>
  );
}