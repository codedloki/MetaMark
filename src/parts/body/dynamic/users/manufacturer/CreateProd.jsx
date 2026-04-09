// import { useEffect, useState } from "react";
// import axios from 'axios';
// import { useUser } from "../../../../providers/UsersProvider";
// import { useConnect } from "../../../../providers/ConnectProvider";
// import { Loader2, PackagePlus } from "lucide-react";

// function CreateProd() {
//   const { walletAddress } = useConnect();
//   const { product } = useUser();
  
//   const [formData, setFormData] = useState({
//     productName: "",
//     productType: "",
//     productDescription: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const isValid =
//     formData.productName.trim().length >= 3 &&
//     formData.productType &&
//     formData.productDescription.trim().length >= 10;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const uploadtoIpfs = async () => {
//     try {
//       const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", formData, {
//         headers: {
//           pinata_api_key: import.meta.env.VITE_PINATA_API,
//           pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
//         }
//       });
//       return res.data['IpfsHash'];
//     } catch (error) {
//       console.error("IPFS Error:", error);
//       throw new Error("IPFS Upload Failed");
//     }
//   };

//   const saveToBlock = async (hash) => {
//     try {
//       const tx = await product.registerProduct(hash, Math.floor(Math.random() * 1000000));
//       const receipt = await tx.wait();
      
//       const event = receipt.logs
//         .map(log => {
//           try { return product.interface.parseLog(log); } catch (e) { return null; }
//         })
//         .find(e => e && e.name === "ProductRegistered");

//       return event ? event.args.productId : null;
//     } catch (error) {
//       console.error("Blockchain Error:", error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isValid || loading) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       const hash = await uploadtoIpfs();
//       await saveToBlock(hash);

//       alert("Product Registered on Blockchain! 🚀");
//       setFormData({ productName: "", productType: "", productDescription: "" });
//     } catch (err) {
//       alert("Error: " + (err.reason || "Transaction failed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//             <div style={styles.iconBox}>
//                 <PackagePlus size={24} color="#60A5FA" />
//             </div>
//             <h2 style={styles.title}>Add Product</h2>
//             <p style={styles.subtitle}>
//               Securely register assets on the blockchain ledger
//             </p>
//         </div>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <Label text="Product Name" />
//             <input
//               type="text"
//               name="productName"
//               placeholder="e.g. Paracetamol 500mg"
//               value={formData.productName}
//               onChange={handleChange}
//               style={styles.input}
//             />
//             {errors.productName && <p style={styles.error}>{errors.productName}</p>}
//           </div>

//           <div style={styles.inputGroup}>
//             <Label text="Product Category" />
//             <select
//               name="productType"
//               value={formData.productType}
//               onChange={handleChange}
//               style={styles.input}
//             >
//               <option value="" style={styles.option}>Select Type</option>
//               <option value="tablet" style={styles.option}>Tablet</option>
//               <option value="cream" style={styles.option}>Cream</option>
//               <option value="liquid" style={styles.option}>Liquid</option>
//             </select>
//           </div>

//           <div style={styles.inputGroup}>
//             <Label text="Detailed Description" />
//             <textarea
//               name="productDescription"
//               placeholder="Describe components, usage, and safety..."
//               value={formData.productDescription}
//               onChange={handleChange}
//               rows="3"
//               style={styles.textarea}
//             />
//             {errors.productDescription && <p style={styles.error}>{errors.productDescription}</p>}
//           </div>

//           <button
//             type="submit"
//             disabled={!isValid || loading}
//             style={isValid && !loading ? styles.button : styles.buttonDisabled}
//           >
//             {loading ? (
//               <span style={styles.loaderContent}>
//                 <Loader2 className="animate-spin" size={18} /> Syncing with Chain...
//               </span>
//             ) : "Register Product"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const Label = ({ text }) => (
//     <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', marginBottom: '6px', display: 'block', textTransform: 'uppercase', tracking: '0.05em' }}>
//         {text}
//     </label>
// );

// const styles = {
//   page: {
//     minHeight: "100vh",
//     width: "100%",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#020617", // Deep Navy Dark
//     backgroundImage: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
//     padding: "20px",
//     boxSizing: "border-box"
//   },
//   card: {
//     width: "100%",
//     maxWidth: "420px",
//     padding: "32px",
//     backgroundColor: "rgba(30, 41, 59, 0.5)", // Semi-transparent Slate
//     backdropFilter: "blur(12px)", // Glassmorphism
//     borderRadius: "28px",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '32px'
//   },
//   iconBox: {
//     width: '56px',
//     height: '56px',
//     backgroundColor: 'rgba(37, 99, 235, 0.15)',
//     borderRadius: '16px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 auto 16px',
//     border: "1px solid rgba(96, 165, 250, 0.2)"
//   },
//   title: {
//     fontSize: "26px",
//     fontWeight: "800",
//     color: "#F8FAFC",
//     margin: '0 0 6px 0',
//     letterSpacing: '-0.02em'
//   },
//   subtitle: {
//     fontSize: "13px",
//     color: "#94A3B8",
//     lineHeight: '1.5'
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column'
//   },
//   input: {
//     padding: "14px 18px",
//     borderRadius: "14px",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     fontSize: "14px",
//     backgroundColor: "#0F172A", // Dark Input
//     color: "#F1F5F9",
//     outline: 'none',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   },
//   option: {
//     backgroundColor: "#0F172A",
//     color: "#F1F5F9",
//   },
//   textarea: {
//     padding: "14px 18px",
//     borderRadius: "14px",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     resize: "none",
//     fontSize: "14px",
//     backgroundColor: "#0F172A",
//     color: "#F1F5F9",
//     outline: 'none',
//     transition: 'all 0.3s',
//   },
//   button: {
//     marginTop: "12px",
//     padding: "16px",
//     backgroundColor: "#3B82F6",
//     color: "#FFFFFF",
//     border: "none",
//     borderRadius: "16px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "700",
//     boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
//     transition: 'transform 0.2s, background 0.2s'
//   },
//   buttonDisabled: {
//     marginTop: "12px",
//     padding: "16px",
//     backgroundColor: "#1E293B",
//     color: "#475569",
//     border: "none",
//     borderRadius: "16px",
//     fontSize: "16px",
//     cursor: "not-allowed",
//   },
//   loaderContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '10px'
//   },
//   error: {
//     color: "#FB7185",
//     fontSize: "11px",
//     fontWeight: '600',
//     marginTop: "6px",
//   },
// };

// export default CreateProd;

import { useEffect, useState } from "react";
import axios from 'axios';
import { ethers } from "ethers";
import { useUser } from "../../../../providers/UsersProvider";
import { useConnect } from "../../../../providers/ConnectProvider";
import { Loader2, PackagePlus, AlertCircle, CheckCircle } from "lucide-react";


function CreateProd() {

  const { walletAddress } = useConnect();
  const { product } = useUser();
  

  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    productDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);  // 🆕 Transaction hash store करने के लिए
  const [successMsg, setSuccessMsg] = useState(null);  // 🆕 Success message


  // 🔧 Enhanced validation
  const isValid =
    formData.productName.trim().length >= 3 &&
    formData.productType &&
    formData.productDescription.trim().length >= 10;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };


  // 🆕 Client-side validation करो submit करने से पहले
  const validateForm = () => {
    const newErrors = {};

    if (formData.productName.trim().length < 3) {
      newErrors.productName = "Product name must be at least 3 characters";
    }

    if (!formData.productType) {
      newErrors.productType = "Please select a category";
    }

    if (formData.productDescription.trim().length < 10) {
      newErrors.productDescription = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const uploadtoIpfs = async () => {
    try {
      // 🆕 Validation check करो
      if (!import.meta.env.VITE_PINATA_API || !import.meta.env.VITE_PINATA_API_SECRET) {
        throw new Error("Pinata API keys are not configured. Check your .env file");
      }

      console.log("📤 Uploading to IPFS...");
      
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS", 
        formData,
        {
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
          }
        }
      );

      if (!res.data.IpfsHash) {
        throw new Error("Invalid IPFS response - no hash returned");
      }

      console.log("✅ IPFS Upload successful:", res.data.IpfsHash);
      return res.data.IpfsHash;

    } catch (error) {
      console.error("❌ IPFS Error:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Pinata authentication failed - check your API keys");
      } else if (error.message.includes("Network")) {
        throw new Error("Network error - please check your internet connection");
      }
      
      throw new Error(error.message || "IPFS Upload Failed");
    }
  };


  // 🔧 Enhanced blockchain interaction with better error handling
  const saveToBlock = async (hash) => {
    try {
      // 🆕 Check if product contract exists
      if (!product || !product.registerProduct) {
        throw new Error("Product contract not initialized. Please reload the page");
      }

      // 🆕 Check wallet connection
      if (!walletAddress) {
        throw new Error("Wallet not connected. Please connect MetaMask");
      }

      const maxPriorityFeePerGas = ethers.parseUnits("50", "gwei");
      const maxFeePerGas = ethers.parseUnits("120", "gwei");
      const gasLimit = 300000;

      console.log("📊 Gas Configuration (Polygon):");
      console.log("- Max Priority Fee (Tip):", ethers.formatUnits(maxPriorityFeePerGas, "gwei"), "Gwei");
      console.log("- Max Fee Per Gas:", ethers.formatUnits(maxFeePerGas, "gwei"), "Gwei");
      console.log("- Gas Limit:", gasLimit);
      console.log("- IPFS Hash:", hash);

      console.log("🔄 Sending transaction to Polygon...");

      const tx = await product.registerProduct(
        hash, 
        Math.floor(Math.random() * 1000000),
        {
          gasLimit: gasLimit,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas
        }
      );

      console.log("✅ Transaction sent:", tx.hash);
      setTxHash(tx.hash);  // 🆕 Store transaction hash

      console.log("⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      
      // 🆕 Check if transaction was successful
      if (!receipt) {
        throw new Error("Transaction receipt not received");
      }

      if (receipt.status === 0) {
        throw new Error("Transaction failed - status 0");
      }

      console.log("✅ Transaction confirmed!");
      console.log("Block Number:", receipt.blockNumber);
      console.log("Gas Used:", receipt.gasUsed.toString());

      // 🆕 Better event parsing with error handling
      const event = receipt.logs
        .map(log => {
          try { 
            return product.interface.parseLog(log); 
          } catch (e) { 
            return null; 
          }
        })
        .find(e => e && e.name === "ProductRegistered");

      if (!event) {
        console.warn("⚠️ ProductRegistered event not found in logs");
        return null;
      }

      const productId = event.args.productId;
      console.log("🎉 Product ID:", productId);
      
      return productId;

    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      
      // 🆕 Enhanced error handling with specific messages
      if (error.code === "INSUFFICIENT_FUNDS") {
        throw new Error("Insufficient MATIC balance - please add funds to your wallet");
      } else if (error.code === "CALL_EXCEPTION") {
        throw new Error("Contract call failed - please check your manufacturer status");
      } else if (error.message.includes("user rejected")) {
        throw new Error("Transaction rejected by user");
      } else if (error.message.includes("gas")) {
        throw new Error("Gas price issue - Polygon network might be congested. Try again in a few minutes");
      } else if (error.reason) {
        throw new Error(error.reason);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Unknown blockchain error occurred");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🆕 Validate before attempting
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    if (loading) return;

    setLoading(true);
    setErrors({});
    setTxHash(null);
    setSuccessMsg(null);

    try {
      console.log("🚀 Starting product registration...");
      
      const hash = await uploadtoIpfs();
      const productId = await saveToBlock(hash);

      const successMessage = `🎉 Product Registered Successfully!\n\nProduct ID: ${productId || "Processing"}\nNetwork: Polygon Mainnet`;
      setSuccessMsg(successMessage);
      
      // Show alert with transaction details
      alert(successMessage + "\n\nYour product is now on the blockchain!");
      
      // Reset form
      setFormData({ productName: "", productType: "", productDescription: "" });

    } catch (err) {
      console.error("❌ Error details:", err);
      
      let errorMessage = "❌ Error: ";
      
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Transaction failed";
      }

      // 🆕 More user-friendly error display
      alert(errorMessage);

      // Also show in console for debugging
      if (txHash) {
        console.log(`View transaction: https://polygonscan.com/tx/${txHash}`);
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>
            <div style={styles.iconBox}>
                <PackagePlus size={24} color="#60A5FA" />
            </div>
            <h2 style={styles.title}>Add Product</h2>
            <p style={styles.subtitle}>
              Securely register assets on Polygon blockchain ledger
            </p>
        </div>

        {/* 🆕 Success message display */}
        {successMsg && (
          <div style={styles.successAlert}>
            <CheckCircle size={20} color="#10B981" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* 🆕 Transaction hash display */}
        {txHash && (
          <div style={styles.infoAlert}>
            <p style={{ margin: "8px 0" }}>
              <strong>Transaction Hash:</strong><br/>
              <code style={{ fontSize: "11px", wordBreak: "break-all" }}>{txHash}</code>
            </p>
            <a 
              href={`https://polygonscan.com/tx/${txHash}`} 
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              View on PolygonScan →
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>
            <Label text="Product Name" required />
            <input
              type="text"
              name="productName"
              placeholder="e.g. Paracetamol 500mg"
              value={formData.productName}
              onChange={handleChange}
              disabled={loading}
              style={{...styles.input, opacity: loading ? 0.6 : 1}}
              maxLength="100"
            />
            {errors.productName && (
              <p style={styles.error}>
                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.productName}
              </p>
            )}
            <span style={styles.charCount}>{formData.productName.length}/100</span>
          </div>

          <div style={styles.inputGroup}>
            <Label text="Product Category" required />
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              disabled={loading}
              style={{...styles.input, opacity: loading ? 0.6 : 1}}
            >
              <option value="" style={styles.option}>Select Type</option>
              <option value="tablet" style={styles.option}>Tablet</option>
              <option value="cream" style={styles.option}>Cream</option>
              <option value="liquid" style={styles.option}>Liquid</option>
              <option value="capsule" style={styles.option}>Capsule</option>
              <option value="injection" style={styles.option}>Injection</option>
              <option value="powder" style={styles.option}>Powder</option>
            </select>
            {errors.productType && (
              <p style={styles.error}>
                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.productType}
              </p>
            )}
          </div>

          <div style={styles.inputGroup}>
            <Label text="Detailed Description" required />
            <textarea
              name="productDescription"
              placeholder="Describe components, usage, and safety..."
              value={formData.productDescription}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              style={{...styles.textarea, opacity: loading ? 0.6 : 1}}
              maxLength="500"
            />
            {errors.productDescription && (
              <p style={styles.error}>
                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.productDescription}
              </p>
            )}
            <span style={styles.charCount}>{formData.productDescription.length}/500</span>
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            style={isValid && !loading ? styles.button : styles.buttonDisabled}
            title={!walletAddress ? "Please connect your wallet first" : ""}
          >
            {loading ? (
              <span style={styles.loaderContent}>
                <Loader2 className="animate-spin" size={18} /> Syncing with Polygon...
              </span>
            ) : "Register Product"}
          </button>

          {/* 🆕 Helpful info text */}
          <div style={styles.infoText}>
            <p>💡 <strong>Tip:</strong> Make sure you have at least 0.1 MATIC in your wallet</p>
          </div>

        </form>

      </div>
    </div>
  );
}


const Label = ({ text, required }) => (
    <label style={{ 
      fontSize: '11px', 
      fontWeight: '800', 
      color: '#94A3B8', 
      marginBottom: '6px', 
      display: 'block', 
      textTransform: 'uppercase', 
      letterSpacing: '0.05em'
    }}>
        {text} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
);


const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
    backgroundImage: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
    padding: "20px",
    boxSizing: "border-box"
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "32px",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    backdropFilter: "blur(12px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },

  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },

  iconBox: {
    width: '56px',
    height: '56px',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    border: "1px solid rgba(96, 165, 250, 0.2)"
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#F8FAFC",
    margin: '0 0 6px 0',
    letterSpacing: '-0.02em'
  },

  subtitle: {
    fontSize: "13px",
    color: "#94A3B8",
    lineHeight: '1.5'
  },

  // 🆕 Alert styles
  successAlert: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#10B981",
    fontSize: "13px"
  },

  infoAlert: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "20px",
    color: "#60A5FA",
    fontSize: "12px"
  },

  link: {
    color: "#60A5FA",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },

  input: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "14px",
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "inherit"
  },

  option: {
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
  },

  textarea: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    resize: "vertical",
    fontSize: "14px",
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: "inherit"
  },

  // 🆕 Character count style
  charCount: {
    fontSize: "11px",
    color: "#64748B",
    marginTop: "4px",
    textAlign: "right"
  },

  button: {
    marginTop: "12px",
    padding: "16px",
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
    transition: 'transform 0.2s, background 0.2s',
    fontFamily: "inherit"
  },

  buttonDisabled: {
    marginTop: "12px",
    padding: "16px",
    backgroundColor: "#1E293B",
    color: "#475569",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    cursor: "not-allowed",
    fontFamily: "inherit"
  },

  loaderContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },

  error: {
    color: "#FB7185",
    fontSize: "12px",
    fontWeight: '600',
    marginTop: "6px",
    display: "flex",
    alignItems: "center"
  },

  infoText: {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "12px",
    color: "#94A3B8",
    margin: "16px 0 0 0"
  }
};


export default CreateProd;