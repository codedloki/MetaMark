import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { keccak256, ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScannerIcon from "@mui/icons-material/QrCodeScanner";
import ProductIcon from "@mui/icons-material/Inventory";

// --- BIGINT SERIALIZATION FIX ---
// This function tells JSON.stringify how to handle BigInts by converting them to strings.
function jsonStringifyReplacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

// Override the global JSON.stringify to use the replacer. 
// This fixes the "Do not know how to serialize a BigInt" error.
const originalStringify = JSON.stringify;
JSON.stringify = (value, replacer, space) => {
  return originalStringify(value, replacer || jsonStringifyReplacer, space);
};
// --- END BIGINT SERIALIZATION FIX ---


// --- Replace with your actual ABIs and Contract Addresses ---
import Productsabi from "../../../abi/Products.json";

const PRODUCT_REGISTRY_ADDRESS = import.meta.env.VITE_PRODUCT_REGISTRY || "0xYourProductRegistryAddress";
const SALT = "PHARMA_SECURE_SALT";
const defaultProvider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL || "http://localhost:8545"); 
// -----------------------------------------------------------


export default function BarcodeVerifier() {
  const [scanResult, setScanResult] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("idle"); // idle, scanning, verifying, valid, invalid, error
  const [verificationMessage, setVerificationMessage] = useState("Scan a product barcode to begin verification.");
  const [productDetails, setProductDetails] = useState(null); // { productId, batchId, serialId }

  /**
   * Parses the structured barcode string: 'productShortId_batchId_serialId'
   * Note: This is now adapted to handle the actual format '41c4f2-789_1001' which uses '-' and '_'
   */
  const parseBarcodeData = (data) => {
    // Check for the mixed delimiter format: 'productShortId-batchId_serialId'
    if (data.includes('-') && data.includes('_')) {
        const parts = data.split('_');
        if (parts.length !== 2) {
            throw new Error("Invalid barcode format. Expected 'productInfo_serialId'.");
        }

        const productInfo = parts[0]; // e.g., '41c4f2-789'
        console.log(`Product :${productInfo}`)
  //      const serialId = parts[1];    // e.g., '1001'
    //  console.log(`serial id ${serialId}`)

        const productParts = productInfo.split('-');
        if (productParts.length !== 2) {
            throw new Error("Invalid product info format. Expected 'productShortId-batchId'.");
        }

        const productShortId = productParts[0]; // e.g., '41c4f2'
        const batchId = productParts[1]; // e.g., '789'
        const serialId = productParts[2]
      console.log(serialId)

        // Reconstruct full 32-byte productId (64 hex characters) for contract interaction
        const fullProductId = "0x" + productShortId.padEnd(64, '0');
        
        return {
          productId: fullProductId,
          batchId: batchId,
          serialId: serialId,
          productShortId: productShortId
        };
    }
    
    // Fallback/Original check for simple underscore format: 'productShortId_batchId_serialId'
    const parts = data.split("_");
    if (parts.length !== 3) {
      throw new Error("Invalid barcode format. Expected 'productShortId-batchId_serialId' or 'productShortId_batchId_serialId'.");
    }

    const productShortId = parts[0]; 
    const batchId = parts[1];
    const serialId = parts[2];
    const dummyProductId = "0x4200000000000000000000000000000000000000000000000000000000000000"; 
    
    return {
      productId: dummyProductId, 
      batchId: batchId,
      serialId: serialId,
      productShortId: productShortId
    };
  };

  // Main verification logic
  const verifySerialOnChain = async (data) => {
    setVerificationStatus("verifying");
    setVerificationMessage("🔍 Initializing blockchain connection...");

    try {
      // 1. Parse Barcode Data
      const { productId, batchId, serialId } = parseBarcodeData(data);
      setProductDetails({ productId, batchId, serialId });
      
      const contract = new ethers.Contract(PRODUCT_REGISTRY_ADDRESS, Productsabi, defaultProvider);
      
      // 2. Hash Batch ID to match contract storage key (uint256)
      setVerificationMessage("📡 Fetching batch data from blockchain...");
      const batchIdHash = keccak256(ethers.toUtf8Bytes(batchId));
      console.log(`Batch Id ;${batchId}`)
      const batchIdUint256 = ethers.toBigInt(batchId); // BigInt is correctly handled by the global fi
    console.log(batchIdUint256)
      console.log(serialId)
      console.log(`Product Id:${productId}`)
      const batchids = await contract.getProductBatchIds('0x159ea306f30520523dcdc91baa6889ff3d5e90e1ff319eb9026870405e920978')
      console.log(` batchids :${batchids}`)
      // 3. Get Batch Merkle Root and IPFS Hash from the contract
      //
      //
      const batchIdHash1 = keccak256(ethers.toUtf8Bytes('790')); 
      const batchIdUint2561  = ethers.toBigInt(batchIdHash1); 
      console.log(` Batch Id :${batchIdUint2561}`);
      const batch = await contract.getBatch('0xe448c4b69e733f02e3fbcebe5a060904f83ff063f6f3db3708bfd6efc816c6b2', batchIdUint2561);
      console.log(`Batch Retreived :${batch[2]}`)
   
      if (!batch.exists) {
        throw new Error(`Batch ID ${batchId} not found for Product ID ${productId}.`);
      }

      
      const merkleRootOnChain = batch[3];
      const ipfsHash = batch[2];
      
      setVerificationMessage(`☁️ Fetching batch details from IPFS (${ipfsHash})...`);

      // 4. Fetch the IPFS data to get the Merkle Proof for the serial
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`; 
      const ipfsRes = await axios.get(ipfsUrl);
      console.log(ipfsRes)
      const batchDataIPFS = ipfsRes.data;

      const serialProof = batchDataIPFS.proofs[serialId];

      console.log(`Proof :${serialProof}`)
      if (!serialProof) {
          throw new Error(`Serial ID ${serialId} is not present in the batch's IPFS data.`);
      }

      // 5. Prepare the leaf hash (must match the contract's logic)
      const leafHash = keccak256(ethers.toUtf8Bytes(serialId + SALT));
      console.log(leafHash)
      
      // 6. Check if the serial has already been verified/used
      setVerificationMessage("📝 Checking serial usage status on blockchain...");
      const isUsed = await contract.isSerialUsed(serialId);

      if (isUsed) {
        setVerificationStatus("invalid");
        setVerificationMessage("🚨 SERIAL ALREADY USED: This product has been previously verified and marked as used. It may be counterfeit or resold.");
        return;
      }
      
      // 7. Final On-Chain Verification (requires Signer/Wallet connection)
      setVerificationMessage("✅ Final Merkle Proof verification on-chain...");

      // Local check (Optional, good for quick pre-validation)
      const isLocalProofValid = MerkleTree.verify(serialProof, leafHash, merkleRootOnChain);
      console.log(serialProof,leafHash,merkleRootOnChain)
      console.log(isLocalProofValid)
      if (isLocalProofValid) {
          throw new Error("Merkle proof failed local verification (Data tamper attempt).");
      }

      if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractWithSigner = new ethers.Contract(PRODUCT_REGISTRY_ADDRESS, Productsabi, signer);
          
          setVerificationMessage("💰 Requesting wallet signature to finalize verification (marks serial as used)...");

          // Send transaction to verify and mark as used
          const tx = await contractWithSigner.verifySerial(
            '0xe448c4b69e733f02e3fbcebe5a060904f83ff063f6f3db3708bfd6efc816c6b2',
            batchIdUint2561,
            serialId,
            serialProof
          );
        console.log(tx)
          setVerificationMessage("⏳ Waiting for transaction confirmation...");
          await tx.wait();

          setVerificationStatus("valid");
          setVerificationMessage("🎉 VERIFICATION SUCCESSFUL: This is an authentic product. The serial has been marked as used on the blockchain.");
      } else {
        setVerificationStatus("valid");
        setVerificationMessage("⚠️ READ-ONLY VALIDATION SUCCESS: Serial is valid against the Merkle Root, but **could not be marked as used** on-chain because no wallet was connected.");
      }

    } catch (error) {
      console.error("Verification Error:", error);
      let message = "An unknown error occurred during verification.";
      
      // Improved error message parsing
      if (error.message.includes("Invalid barcode format")) {
          message = error.message;
      } else if (error.message.includes("Batch ID not found") || error.message.includes("exists")) {
          message = "INVALID BATCH: The scanned batch is not registered on the blockchain.";
      } else if (error.message.includes("is not present in the batch")) {
          message = "INVALID SERIAL: The serial number is not part of the registered batch (Tampered data).";
      } else if (error.message.includes("Invalid Merkle proof")) {
          message = "INVALID PROOF: Merkle verification failed. The serial data is compromised.";
      } else if (error.code === 'CALL_EXCEPTION' && error.reason) {
          message = `Blockchain Revert: ${error.reason}`;
      } else if (error.message.includes("user rejected transaction")) {
          message = "Transaction rejected by user. Verification incomplete.";
      }
      
      setVerificationStatus("error"); 
      setVerificationMessage(`❌ VERIFICATION FAILED: ${message}`);
    }
  };

  const handleScan = (data) => {
    if (data && data.text) {
      setScanResult(data.text);
      verifySerialOnChain(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setVerificationStatus("error");
    setVerificationMessage("Camera Error: Please ensure your device's camera is available and permissions are granted.");
  };
  
  const resetScanner = () => {
    setScanResult("");
    setVerificationStatus("idle");
    setVerificationMessage("Scan a product barcode to begin verification.");
    setProductDetails(null);
  };

  // Determine styling based on status
  const statusColor = {
    idle: "bg-blue-100 border-blue-400 text-blue-800",
    scanning: "bg-yellow-100 border-yellow-400 text-yellow-800",
    verifying: "bg-indigo-100 border-indigo-400 text-indigo-800",
    valid: "bg-green-100 border-green-400 text-green-800",
    invalid: "bg-red-100 border-red-400 text-red-800",
    error: "bg-red-100 border-red-400 text-red-800",
  }[verificationStatus];
  
  // Custom button class for Tailwind gradient
  const primaryButtonClass = "text-white px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg " + 
                             (verificationStatus === 'verifying' ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700");

  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="p-8 space-y-6 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
        
        <Box className="flex justify-between items-center border-b pb-4 mb-4 border-gray-200 dark:border-gray-700">
          <Typography variant="h4" className="font-extrabold text-gray-900 dark:text-white" style={{
            background: 'linear-gradient(to right, #4F46E5, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            <ScannerIcon className="align-middle mr-2" fontSize="inherit" />
            Product Verifier
          </Typography>
          <Button onClick={resetScanner} variant="outlined" className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300">
            Reset
          </Button>
        </Box>

        {/* --- Barcode Scanner/Reader Area --- */}
        <Box className="flex justify-center mb-6">
          <div className="w-full max-w-sm border-4 border-dashed border-gray-300 dark:border-gray-600 p-2 rounded-xl bg-gray-50 dark:bg-gray-700">
            <Typography variant="caption" className="block text-center mb-2 text-gray-500 dark:text-gray-400">
              Scan Area
            </Typography>
            <div className="overflow-hidden rounded-lg">
              {verificationStatus !== 'verifying' && verificationStatus !== 'valid' && verificationStatus !== 'invalid' && (
                  <QrReader
                    onResult={handleScan}
                    onError={handleError}
                    constraints={{ facingMode: "environment" }} // Use back camera
                    scanDelay={500}
                    style={{ width: "100%" }}
                  />
              )}
              {/* Manual input fallback */}
              {verificationStatus !== 'verifying' && (
                <Box className="p-4">
                  <input
                    type="text"
                    value={scanResult}
                    onChange={(e) => setScanResult(e.target.value)}
                    placeholder="Or enter barcode manually: ShortID-BatchID_SerialID"
                    className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                  />
                  <Button
                    onClick={() => verifySerialOnChain(scanResult)}
                    disabled={!scanResult || verificationStatus === 'verifying'}
                    className={primaryButtonClass + " mt-3 w-full"}
                  >
                    {verificationStatus === 'verifying' ? <CircularProgress size={24} color="inherit" /> : 'Verify Manual Code'}
                  </Button>
                </Box>
              )}
            </div>
          </div>
        </Box>

        {/* --- Verification Status Box --- */}
        <Alert severity={
          verificationStatus === 'valid' ? "success" : 
          (verificationStatus === 'invalid' || verificationStatus === 'error' ? "error" : "info")
        } 
        className={`w-full transition duration-300 ease-in-out ${statusColor}`}
        iconMapping={{
          success: <CheckCircleIcon fontSize="inherit" />,
          error: <CancelIcon fontSize="inherit" />,
          info: verificationStatus === 'verifying' ? <CircularProgress size={24} /> : <ScannerIcon fontSize="inherit" />,
        }}
        >
          <AlertTitle className="font-bold">Verification Status: {verificationStatus.toUpperCase()}</AlertTitle>
          {verificationMessage}
        </Alert>

        {/* --- Product Details Card --- */}
        {productDetails && (
          <Card className="mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardContent>
              <Typography variant="h6" className="font-bold text-gray-700 dark:text-gray-300 mb-3">
                <ProductIcon className="align-text-bottom mr-2" />
                Scanned Data
              </Typography>
              <div className="space-y-2 text-sm">
                <p className="dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Full Barcode:</strong> <span className="break-all">{scanResult}</span></p>
                <p className="dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Product ID (assumed):</strong> <span className="break-all">{productDetails.productId}</span></p>
                <p className="dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Batch ID:</strong> {productDetails.batchId}</p>
                <p className="dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Serial ID:</strong> {productDetails.serialId}</p>
              </div>
            </CardContent>
          </Card>
        )}

      </Paper>
    </Container>
  );
}
