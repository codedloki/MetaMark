import { useEffect, useState } from "react";
import axios from 'axios';
import { useUser } from "../../../../providers/UsersProvider";
import { useConnect } from "../../../../providers/ConnectProvider";
import { Loader2, PackagePlus } from "lucide-react";

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

  // Validation Logic
  const isValid =
    formData.productName.trim().length >= 3 &&
    formData.productType &&
    formData.productDescription.trim().length >= 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadtoIpfs = async () => {
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", formData, {
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
        }
      });
      return res.data['IpfsHash'];
    } catch (error) {
      console.error("IPFS Error:", error);
      throw new Error("IPFS Upload Failed");
    }
  };

  const saveToBlock = async (hash) => {
    try {
      const tx = await product.registerProduct(hash, Math.floor(Math.random() * 1000000));
      const receipt = await tx.wait();
      
      const event = receipt.logs
        .map(log => {
          try { return product.interface.parseLog(log); } catch (e) { return null; }
        })
        .find(e => e && e.name === "ProductRegistered");

      return event ? event.args.productId : null;
    } catch (error) {
      console.error("Blockchain Error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setErrors({});

    try {
      const hash = await uploadtoIpfs();
      await saveToBlock(hash);

      alert("Product Registered on Blockchain! 🚀");
      setFormData({ productName: "", productType: "", productDescription: "" });
    } catch (err) {
      alert("Error: " + (err.reason || "Transaction failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
            <div style={styles.iconBox}>
                <PackagePlus size={24} color="#2563EB" />
            </div>
            <h2 style={styles.title}>Add Product</h2>
            <p style={styles.subtitle}>
              Register your product assets on the MetaMark Ledger
            </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <Label text="Product Name" />
            <input
              type="text"
              name="productName"
              placeholder="e.g. Paracetamol 500mg"
              value={formData.productName}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.productName && <p style={styles.error}>{errors.productName}</p>}
          </div>

          <div style={styles.inputGroup}>
            <Label text="Product Category" />
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Type</option>
              <option value="tablet">Tablet</option>
              <option value="cream">Cream</option>
              <option value="liquid">Liquid</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <Label text="Detailed Description" />
            <textarea
              name="productDescription"
              placeholder="Describe components, usage, and safety..."
              value={formData.productDescription}
              onChange={handleChange}
              rows="3"
              style={styles.textarea}
            />
            {errors.productDescription && <p style={styles.error}>{errors.productDescription}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            style={isValid && !loading ? styles.button : styles.buttonDisabled}
          >
            {loading ? (
              <span style={styles.loaderContent}>
                <Loader2 className="animate-spin" size={18} /> Processing...
              </span>
            ) : "Register Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

const Label = ({ text }) => (
    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px', display: 'block' }}>
        {text}
    </label>
);

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%", // ✅ FIXED: changed from 200vh to 100%
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9", // Soft slate background
    padding: "20px",
    boxSizing: "border-box"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    borderRadius: "24px", // More modern rounded corners
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  iconBox: {
    width: '48px',
    height: '48px',
    backgroundColor: '#EFF6FF',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px'
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1E293B",
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748B",
    lineHeight: '1.4'
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    fontSize: "14px",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    outline: 'none',
    transition: 'border 0.2s',
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    resize: "none",
    fontSize: "14px",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    outline: 'none',
  },
  button: {
    marginTop: "8px",
    padding: "14px",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
  },
  buttonDisabled: {
    marginTop: "8px",
    padding: "14px",
    backgroundColor: "#CBD5E1",
    color: "#94A3B8",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "not-allowed",
  },
  loaderContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  error: {
    color: "#EF4444",
    fontSize: "11px",
    fontWeight: '600',
    marginTop: "4px",
  },
};

export default CreateProd;