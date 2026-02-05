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
                <PackagePlus size={24} color="#60A5FA" />
            </div>
            <h2 style={styles.title}>Add Product</h2>
            <p style={styles.subtitle}>
              Securely register assets on the blockchain ledger
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
              <option value="" style={styles.option}>Select Type</option>
              <option value="tablet" style={styles.option}>Tablet</option>
              <option value="cream" style={styles.option}>Cream</option>
              <option value="liquid" style={styles.option}>Liquid</option>
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
                <Loader2 className="animate-spin" size={18} /> Syncing with Chain...
              </span>
            ) : "Register Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

const Label = ({ text }) => (
    <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', marginBottom: '6px', display: 'block', textTransform: 'uppercase', tracking: '0.05em' }}>
        {text}
    </label>
);

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617", // Deep Navy Dark
    backgroundImage: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
    padding: "20px",
    boxSizing: "border-box"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    backgroundColor: "rgba(30, 41, 59, 0.5)", // Semi-transparent Slate
    backdropFilter: "blur(12px)", // Glassmorphism
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
    backgroundColor: "#0F172A", // Dark Input
    color: "#F1F5F9",
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  option: {
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
  },
  textarea: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    resize: "none",
    fontSize: "14px",
    backgroundColor: "#0F172A",
    color: "#F1F5F9",
    outline: 'none',
    transition: 'all 0.3s',
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
    transition: 'transform 0.2s, background 0.2s'
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
  },
  loaderContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  error: {
    color: "#FB7185",
    fontSize: "11px",
    fontWeight: '600',
    marginTop: "6px",
  },
};

export default CreateProd;