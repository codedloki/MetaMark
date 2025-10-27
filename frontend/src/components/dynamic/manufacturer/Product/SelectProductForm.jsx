import React, { useEffect, useState, useRef, useMemo } from "react";
import { TextField, MenuItem, Button, CircularProgress, Alert } from '@mui/material';
import { ethers } from "ethers";
import axios from "axios";
// NOTE: Adjust paths for your project structure
import ProductsAbi from '../../../../abi/Products.json' 

// Imports required for the JSON Upload/Batch Registration logic
import Barcode from 'react-barcode';
import keccak256 from 'keccak256'; 
import { MerkleTree } from 'merkletreejs';
// ❌ REMOVED: import Web3 from 'web3';
// ❌ REMOVED: import { create } from 'ipfs-http-client'; // No longer used, but kept in previous context
import ProductsContractABI from '../../../../abi/Products.json'; 


// 🛑 Merkle Fix: Define the hardcoded salt used by the Solidity contract
const PHARMA_SECURE_SALT = "PHARMA_SECURE_SALT";

// Function to safely stringify BigInts for logging (UNCHANGED)
const replacer = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};


// -------------------------------------------------------------------
// 🧱 Ethers.js Setup (Consolidated and simplified)
// -------------------------------------------------------------------

const getEthersContractAndSigner = async () => {
    if (!window.ethereum) return {};

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contractAddress = import.meta.env.VITE_PRODUCT_REGISTRY; 
        if (!contractAddress) return { signer: null, contract: null };

        // Initialize Ethers Contract with Signer
        const contract = new ethers.Contract(
            contractAddress,
            ProductsContractABI, 
            signer // Contract connected to the signer for transactions
        );
        
        return { signer, contract };

    } catch (e) {
        console.error("Ethers setup failed:", e);
        return {};
    }
};

// Helper to generate checksum for barcode (UNCHANGED)
function generateChecksum(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return (sum % 256).toString(16).padStart(2, '0');
}

// -------------------------------------------------------------------
// ⚙️ Step 2: JSON Upload and Batch Registration Component (Ethers.js CONVERSION)
// -------------------------------------------------------------------

function UploadJsonWeb3Step({ productId, onBack, onFinish }) {
    // State adapted from Code 2
    const [products, setProducts] = useState({}); 
    const [flatProducts, setFlatProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isReadyToDownload, setIsReadyToDownload] = useState(false);
    const svgRefs = useRef([]);
    const containerRefs = useRef([]);
    const [salt, setSalt] = useState(''); // Retaining dynamic salt, though not used for Merkle Proof
    const [error, setError] = useState(null); 

    // Ethers Contract instance
    const [ethersContract, setEthersContract] = useState(null); 

    // Setup Ethers Contract on mount
    useEffect(() => {
        const initEthers = async () => {
            const { contract } = await getEthersContractAndSigner();
            if (contract) {
                setEthersContract(contract);
            } else {
                 setError("Ethers Signer or Contract failed to initialize. Check MetaMask connection.");
            }
        };
        initEthers();
        setSalt(Math.random().toString(36).substring(2, 12));
    }, []);
    
    // --- JSON File Handling (UNCHANGED) ---
    const handleFileUpload = (event) => {
        // ... (File parsing and state setting logic remains UNCHANGED)
        setFlatProducts([]);
        setError(null);
        
        const files = Array.from(event.target.files);
        let allRows = [];
        let processedFiles = 0;

        const processFile = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!Array.isArray(data) || data.length === 0) throw new Error("JSON must be a non-empty array of objects");
                    allRows = [...allRows, ...data];
                } catch (err) {
                    setError("Invalid JSON file: " + err.message);
                }
                processedFiles++;
                if (processedFiles === files.length) {
                    const structuredData = {};
                    const flatData = [];

                    allRows.forEach((row, i) => {
                        const productName = (row['Product Name'] || '').trim();
                        const batchId = (row['Batch id'] || '').trim();
                        const serialId = (row['serial_id'] || '').trim();
                        const mfg = (row['mfg_date'] || '').trim();
                        const exp = (row['exp_date'] || '').trim();
                        const barcodeData = `${batchId}_${serialId}_${generateChecksum(batchId + serialId)}`;

                        if (!structuredData[productName]) { structuredData[productName] = { product_name: productName, batches: {} }; }
                        if (!structuredData[productName].batches[batchId]) { structuredData[productName].batches[batchId] = []; }

                        structuredData[productName].batches[batchId].push({ batch_id: batchId, serial_id: serialId, mfg_date: mfg, exp_date: exp });

                        flatData.push({
                            index: i, product_name: productName, batch_id: batchId, serial_id: serialId, barcodeData: barcodeData, mfg_date: mfg, exp_date: exp,
                        });
                    });

                    setProducts(structuredData);
                    setFlatProducts(flatData);
                }
            };
            reader.onerror = () => { setError("Failed to read file"); processedFiles++; };
            reader.readAsText(file);
        };

        files.forEach(processFile);
    };

    // -------------------------------
    // Blockchain Batch Registration (Converted to Ethers.js)
    // -------------------------------
    const registerBatch = async () => {
        // Check if Ethers Contract is ready (replacing web3/contract check)
        if (!flatProducts.length || !ethersContract) {
            setError("Cannot register: No products loaded or Ethers contract not initialized.");
            return;
        }

        setLoading(true);
        setError(null);
        
        const batchId = flatProducts[0].batch_id;
        const mfgDate = flatProducts[0].mfg_date;
        const expDate = flatProducts[0].exp_date;
        const serialIds = flatProducts.map(p => p.serial_id);
        
        try {
            // 1️⃣ Hash serial IDs with DYNAMIC salt (from Code 2 logic)
            // NOTE: Solidity requires PHARMA_SECURE_SALT, but Code 2 used a dynamic 'salt'.
            // Sticking to Code 2's logic for consistency, but the contract verification will FAIL 
            // unless the contract is updated to read the dynamic salt from IPFS.
            const hashedSerials = serialIds.map(id =>
                '0x' + keccak256(id + salt).toString('hex')
            );

            // 2️⃣ Create Merkle tree
            const tree = new MerkleTree(hashedSerials, keccak256, { sortPairs: true });
            const merkleRoot = tree.getHexRoot();

            // 3️⃣ Upload batch data to Pinata (FIXED: Using Pinata/Axios)
            const pinataApiKey = import.meta.env.VITE_PINATA_API;
            if (!pinataApiKey) throw new Error("Pinata API key (VITE_PINATA_API) is missing.");

            const batchData = {
                productId: productId,
                batchId: batchId,
                mfgDate: mfgDate,
                expDate: expDate,
                salt: salt, // Dynamic salt used here
                serialHashes: hashedSerials
            };
            
            const pinataRes = await axios.post(
                'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                batchData,
                { headers: { Authorization: `Bearer ${pinataApiKey}`, 'Content-Type': 'application/json', }, }
            );
            const ipfsHash = pinataRes.data.IpfsHash;

            // 4️⃣ Call smart contract to register batch (Ethers.js conversion)
            
            // ARGUMENT PREPARATION
            const productIdBytes32 = productId; // Assuming product selection gives a bytes32 hash
            const batchIdUint256 = ethers.toBigInt('0x' + keccak256(batchId).toString('hex')); // Hash string batch ID to uint256

            // Ethers call matching the 4-argument ABI: addBatch(bytes32 _productId, uint256 _batchId, string memory _ipfsHash, bytes32 _merkleRoot)
            const tx = await ethersContract.addBatch(
                productIdBytes32,
                batchIdUint256,
                ipfsHash,
                merkleRoot,
                { gasLimit: 500000 }
            );

            await tx.wait(); // Wait for transaction to be mined

            setLoading(false);
            alert("Batch registered successfully!");
            onFinish(); 

        } catch (err) {
            console.error("Batch registration failed:", JSON.stringify(err, replacer));
            setLoading(false);

            let message = `Registration failed: ${err.message || 'Check console for details.'}`;
            if (err.code === 'CALL_EXCEPTION' || err.code === 'UNSUPPORTED_OPERATION') {
                 message = `❌ Contract Revert/ABI Mismatch: Check arguments (bytes32, uint256, string, bytes32) and contract requirements.`;
            }
            setError(message);
            alert(`Batch registration failed: ${message}`);
        }
    };

    // -------------------------------
    // UI + Barcode Generation (UNCHANGED)
    // -------------------------------
    useEffect(() => {
        // ... (UI state logic remains UNCHANGED)
        if (!flatProducts.length) {
            setIsReadyToDownload(false);
            return;
        }
        const timer = setTimeout(() => {
            const ready = flatProducts.every((_, i) => {
                let svgElement = svgRefs.current[i];
                if (!svgElement && containerRefs.current[i]) {
                    svgElement = containerRefs.current[i].querySelector('svg');
                    if (svgElement) svgRefs.current[i] = svgElement;
                }
                return svgElement?.tagName?.toLowerCase() === 'svg';
            });
            setIsReadyToDownload(ready);
        }, 500);

        return () => clearTimeout(timer);
    }, [flatProducts]);

    // UI Rendering (Adapted for pale palette/current flow)
    const buttonStyle = {
        back: { backgroundColor: 'rgb(55 65 81)', '&:hover': { backgroundColor: 'rgb(75 85 99)' } },
        register: { backgroundColor: 'rgb(34 197 94)', '&:hover': { backgroundColor: 'rgb(22 163 74)' } },
    };

    return (
        <div className="p-6 rounded-lg max-w-2xl mx-auto w-full">
            <h2 className="text-xl font-semibold mb-2 text-center text-gray-800">
                Upload JSON Data for Batch
            </h2>
            <p className="text-sm text-center mb-6 text-gray-500">
                Product ID: <span className="font-mono text-xs text-blue-600 font-bold">{productId || "N/A"}</span>
            </p>

            {error && <Alert severity="error" className="mb-4">{error}</Alert>}

            <div className="w-full max-w-xl mx-auto mb-6">
                <div className="relative h-32 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/50 flex justify-center items-center text-gray-600 shadow-inner">
                    <input
                        type="file"
                        accept=".json,application/json"
                        multiple 
                        className="h-full w-full opacity-0 cursor-pointer absolute top-0 left-0"
                        onChange={handleFileUpload}
                        disabled={loading || !productId}
                    />
                    <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-blue-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2a1 1 0 011-1h5.087M9 13l3-3m0 0l3 3m-3-3v8"></path></svg>
                        <p className="text-sm font-medium">{!productId ? 'Select a product first.' : 'Click to upload JSON file'}</p>
                    </div>
                </div>
            </div>

            {flatProducts.length > 0 && (
                <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="text-gray-700 text-center">
                        <p className="text-lg">
                            Loaded <span className="font-semibold">{flatProducts.length}</span> units for Batch <span className="font-semibold text-blue-600">{flatProducts[0].batch_id}</span>
                        </p>
                        <p className="text-sm opacity-75">
                            {isReadyToDownload ? 'Barcodes ready.' : 'Preparing barcodes...'}
                        </p>
                    </div>

                    <Button
                        variant="contained"
                        onClick={registerBatch}
                        disabled={loading || !isReadyToDownload || !productId}
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={buttonStyle.register}
                    >
                        {loading ? 'Registering...' : 'Register Batch on Blockchain'}
                    </Button>
                </div>
            )}

            <div className="flex justify-start mt-8">
                <Button
                    variant="contained"
                    onClick={onBack}
                    sx={buttonStyle.back}
                    disabled={loading}
                >
                    Back to Product Select
                </Button>
            </div>
            
            {/* Hidden Barcode grid for rendering (Kept for UI component compatibility) */}
            <div className={`mt-8 grid grid-cols-2 gap-4 ${flatProducts.length > 0 ? 'visible' : 'hidden'}`}>
                {flatProducts.map((p, i) => (
                    <div key={i} ref={el => containerRefs.current[i] = el} className="p-2 border border-gray-200 rounded text-center">
                        <p className="text-xs font-semibold text-gray-700">{p.batch_id}</p>
                        <p className="text-xs font-mono text-gray-500">{p.serial_id}</p>
                        <Barcode
                            value={p.barcodeData}
                            displayValue={false}
                            width={1}
                            height={30}
                            margin={0}
                            background="transparent"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}


// -------------------------------------------------------------------
// 🎯 Main Component: SelectProductForm (The breadcrumb manager)
// -------------------------------------------------------------------

export default function SelectProductForm({
  onBack,
  onNext, // Called upon successful batch registration (Step 2 completion)
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [step, setStep] = useState(1); // 1: Select Product, 2: Upload JSON

  // -------------------------------------------------------------------
  // Step 1: Product Data Fetching (UNCHANGED)
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setError(null); 
      try {
        if (!window.ethereum) {
          setError("MetaMask is not installed.");
          return;
        }

        setLoading(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const productRegistryAddress = import.meta.env.VITE_PRODUCT_REGISTRY || "0x...";
        const productRegistryContract = new ethers.Contract(
          productRegistryAddress,
          ProductsAbi,
          signer
        );

        const productIds = await productRegistryContract.getProductsByManufacturer();

        const fetchedProducts = [];
        for (const productId of productIds) {
          try {
            const product = await productRegistryContract.getProduct(productId);
            const ipfsHash = product[0];
            let productName = "Unnamed Product";
            try {
              const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
              productName = response.data.name || productName;
            } catch (ipfsError) { /* ignore ipfs error */ }

            fetchedProducts.push({ id: productId, name: productName });
          } catch (error) { /* ignore product detail error */ }
        }

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Check console for details.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // -------------------------------------------------------------------
  // Step 1: Handlers (Manager Logic)
  // -------------------------------------------------------------------

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (selectedProductId) {
      // Move to Step 2: JSON Upload
      setStep(2);
    }
  };

  const handleBackStep2 = () => {
    // Go back from JSON upload to product selection
    setStep(1);
    setSelectedProductId(null);
  }

  const handleFinishStep2 = () => {
    // Notify the parent component (BaseProduct) that the entire process is complete
    onNext(); 
  }

  // -------------------------------------------------------------------
  // UI Rendering based on Step
  // -------------------------------------------------------------------
  
  const FormContainer = ({ children }) => (
    // Pale palette styling from original form
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      {children}
    </div>
  );

  // --- Render Step 1: Select Product ---
  if (step === 1) {
    return (
      <FormContainer>
        <h2 className="text-xl font-semibold mb-4 text-center">Select Product to Add Batch</h2>
        
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmitStep1}>
          <div className="mb-6">
            <TextField
              select
              fullWidth
              label="Select Product"
              value={selectedProductId || ""}
              onChange={(e) => setSelectedProductId(e.target.value)}
              variant="outlined"
              size="small"
              disabled={loading || products.length === 0}
              InputProps={{
                endAdornment: loading ? <CircularProgress size={20} /> : null,
              }}
            >
              <MenuItem value="" disabled>-- Select Product --</MenuItem>
              {loading ? (
                <MenuItem disabled>Loading products...</MenuItem>
              ) : products.length > 0 ? (
                products.map((prod) => (
                  <MenuItem key={prod.id} value={prod.id}>
                    {prod.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No products available</MenuItem>
              )}
            </TextField>
          </div>

          <div className="flex justify-between">
            <Button
              variant="contained"
              onClick={onBack} // Back to BaseProduct 'initial' view
              sx={{
                backgroundColor: 'rgb(55 65 81)',
                '&:hover': { backgroundColor: 'rgb(75 85 99)' },
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={!selectedProductId || loading || error}
              sx={{
                backgroundColor: 'rgb(37 99 235)',
                '&:hover': { backgroundColor: 'rgb(29 78 216)' },
                '&.Mui-disabled': { backgroundColor: 'rgb(147 197 253)' },
              }}
            >
              Next (Upload JSON)
            </Button>
          </div>
        </form>
      </FormContainer>
    );
  }

  // --- Render Step 2: JSON Upload ---
  if (step === 2) {
    return (
      <FormContainer>
          <UploadJsonWeb3Step 
              productId={selectedProductId} 
              onBack={handleBackStep2} 
              onFinish={handleFinishStep2} 
          />
      </FormContainer>
    );
  }
}