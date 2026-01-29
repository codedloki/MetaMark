import { useEffect, useState } from "react";
import  axios  from 'axios'
import { useUser } from "../../../../providers/UsersProvider";

function CreateProd() {
  const {registry,product} = useUser()
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    productDescription: "",
  });

  const [ipfshash,setipfshash] = useState('')

  const [errors, setErrors] = useState({});
  




  const uploadtoIpfs = async() =>{
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS",formData,
        {
          headers:{
            pinata_api_key: import.meta.env.VITE_PINATA_API,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
          }
        }
      )
      console.log(res.data['IpfsHash'])
      setipfshash(res.data['IpfsHash'])
      return res.data['IpfsHash']
    } catch (error) {
      console.error(error)
      
    }
  }
const saveToBlock = async (hash) => {

  try {
    console.log(hash)
    const tx = await product.registerProduct(hash, 1);
    const receipt = await tx.wait();
    console.log(tx)

    // Find the ProductRegistered event
    const event = receipt.logs
      .map(log => product.interface.parseLog(log))
      .find(e => e.name === "ProductRegistered");

    const productId = event.args.productId;

    console.log("Product ID:", productId);

    // Now fetch product correctly
    const productData = await product.getProduct(productId);

    console.log("isActive:", productData.isActive); // ✅ true
  } catch (error) {
    console.error("Error Occurred:", error);
  }
};


  const getproduct =async()=>{
    try {
      const productids  = await product.getProductsByManufacturer()
      const products = []
      for (const productid of productids){
        const prod = await product.getProduct(productid)
        products.push({
          productid,
          ipfshash:prod.details,
          isActive:prod.isActive
        })
      }
      console.log(products)
    } catch (error) {
      console.error("Error :",error)
      
    }

  }

  useEffect(()=>{
    getproduct()
  },[product])


  // useEffect(()=>{
  //   saveToBlock(ipfshash)
  // },[ipfshash])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Derived validity (SOURCE OF TRUTH)
  const isValid =
    formData.productName.trim().length >= 3 &&
    formData.productType &&
    formData.productDescription.trim().length >= 10;

  const handleSubmit = async(e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product Name is required";
    } else if (formData.productName.length < 3) {
      newErrors.productName = "Product Name must be at least 3 characters";
    }

    if (!formData.productType) {
      newErrors.productType = "Product Type is required";
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "Product Description is required";
    } else if (formData.productDescription.length < 10) {
      newErrors.productDescription =
        "Description must be at least 10 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    const hash = await  uploadtoIpfs()
    console.log("Hash Received:",hash)
    await saveToBlock(hash)

    alert("Product Added Successfully!");

    

    

    console.log(formData);

    setFormData({
      productName: "",
      productType: "",
      productDescription: "",
    });
    setErrors({});
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Product</h2>
        <p style={styles.subtitle}>
          Enter product details to register on MetaMark
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.productName && (
            <p style={styles.error}>{errors.productName}</p>
          )}

          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Product Type</option>
            <option value="tablet">Tablet</option>
            <option value="cream">Cream</option>
            <option value="liquid">Liquid</option>
          </select>
          {errors.productType && (
            <p style={styles.error}>{errors.productType}</p>
          )}

          <textarea
            name="productDescription"
            placeholder="Product Description"
            value={formData.productDescription}
            onChange={handleChange}
            rows="4"
            style={styles.textarea}
          />
          {errors.productDescription && (
            <p style={styles.error}>{errors.productDescription}</p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            style={isValid ? styles.button : styles.buttonDisabled}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProd;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useUser } from "../../../../providers/UsersProvider";
// import { useConnect } from "../../../../providers/ConnectProvider";
// function CreateProd() {
  
//   const { registry, product } = useUser();
//   const {walletAddress} = useConnect()

//   const [formData, setFormData] = useState({
//     productName: "",
//     productType: "",
//     productDescription: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false); // tx lock




//   /* -------------------- IPFS -------------------- */
//   const uploadtoIpfs = async () => {
//     try {
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         formData,
//         {
//           headers: {
//             pinata_api_key: import.meta.env.VITE_PINATA_API,
//             pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
//           },
//         }
//       );

//       const hash = res.data.IpfsHash;
//       console.log("IPFS HASH:", hash);
//       return hash;
//     } catch (error) {
//       console.error("IPFS ERROR:", error);
//       throw error;
//     }
//   };

//   /* -------------------- BLOCKCHAIN -------------------- */


//   useEffect(()=>{
//     const verifyMan=async()=>{
//       // if (!registry) return null;
//       const res = await registry.isManufacturer(walletAddress)
//       console.log("Response :",res)
//     }
//     verifyMan()
//   },[])

//   const saveToBlock = async (hash) => {
//     try {
//       console.log("Saving to chain:", hash);
//       const nonce = crypto.randomUUID(); 

//       const tx = await product.registerProduct(hash, 1);
//       console.log("TX SENT:", tx.hash);

//       const receipt = await tx.wait();
//       console.log("TX CONFIRMED:", receipt.transactionHash);

//       const event = receipt.logs
//         .map((log) => product.interface.parseLog(log))
//         .find((e) => e.name === "ProductRegistered");

//       if (!event) throw new Error("ProductRegistered event not found");

//       const productId = event.args.productId;
//       console.log("Product ID:", productId.toString());

//       const productData = await product.getProduct(productId);
//       console.log("isActive:", productData.isActive);
//     } catch (error) {
//       console.error("BLOCKCHAIN ERROR:", error);
//       throw error;
//     }
//   };

//   /* -------------------- READ PRODUCTS -------------------- */
//   const getproduct = async () => {
//     try {
//       if (!product) return;

//       const productids = await product.getProductsByManufacturer();
//       const products = [];

//       for (const productid of productids) {
//         const prod = await product.getProduct(productid);
//         products.push({
//           productid: productid.toString(),
//           ipfshash: prod.details,
//           isActive: prod.isActive,
//         });
//       }

//       console.log("PRODUCTS:", products);
//     } catch (error) {
//       console.error("FETCH ERROR:", error);
//     }
//   };

//   useEffect(() => {
//     getproduct();
//   }, [product]);

//   /* -------------------- FORM -------------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const isValid =
//     formData.productName.trim().length >= 3 &&
//     formData.productType &&
//     formData.productDescription.trim().length >= 10;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) return; // hard tx lock
//     setIsSubmitting(true);

//     const newErrors = {};

//     if (!formData.productName.trim())
//       newErrors.productName = "Product Name is required";
//     else if (formData.productName.length < 3)
//       newErrors.productName = "Product Name must be at least 3 characters";

//     if (!formData.productType)
//       newErrors.productType = "Product Type is required";

//     if (!formData.productDescription.trim())
//       newErrors.productDescription = "Product Description is required";
//     else if (formData.productDescription.length < 10)
//       newErrors.productDescription = "Description must be at least 10 characters";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // Step 1: IPFS
//       const hash = await uploadtoIpfs();

//       // Step 2: Blockchain
//       await saveToBlock(hash);

//       alert("Product Added Successfully!");

//       setFormData({
//         productName: "",
//         productType: "",
//         productDescription: "",
//       });
//       setErrors({});
//     } catch (err) {
//       console.error("PIPELINE ERROR:", err);
//       alert("Transaction failed. Check console.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* -------------------- UI -------------------- */
//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Add Product</h2>
//         <p style={styles.subtitle}>
//           Enter product details to register on MetaMark
//         </p>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             name="productName"
//             placeholder="Product Name"
//             value={formData.productName}
//             onChange={handleChange}
//             style={styles.input}
//           />
//           {errors.productName && <p style={styles.error}>{errors.productName}</p>}

//           <select
//             name="productType"
//             value={formData.productType}
//             onChange={handleChange}
//             style={styles.input}
//           >
//             <option value="">Select Product Type</option>
//             <option value="tablet">Tablet</option>
//             <option value="cream">Cream</option>
//             <option value="liquid">Liquid</option>
//           </select>
//           {errors.productType && <p style={styles.error}>{errors.productType}</p>}

//           <textarea
//             name="productDescription"
//             placeholder="Product Description"
//             value={formData.productDescription}
//             onChange={handleChange}
//             rows="4"
//             style={styles.textarea}
//           />
//           {errors.productDescription && (
//             <p style={styles.error}>{errors.productDescription}</p>
//           )}

//           <button
//             type="submit"
//             disabled={!isValid || isSubmitting}
//             style={
//               isValid && !isSubmitting
//                 ? styles.button
//                 : styles.buttonDisabled
//             }
//           >
//             {isSubmitting ? "Submitting..." : "Add Product"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateProd;



const styles = {
  page: {
    minHeight: "100vh",
    width: "200vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DBDBDB",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(18, 17, 17, 0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: "6px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#111",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #DBDBDB",
    fontSize: "14px",
    backgroundColor: "#FFFFFF", // ✅ white background
    color: "#000000",           // ✅ black text
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #DBDBDB",
    resize: "none",
    fontSize: "14px",
     backgroundColor: "#FFFFFF", // ✅ white background
     color: "#000000", 
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
  buttonDisabled: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#A5B4FC",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "not-allowed",
  },
  error: {
    color: "#EF4444",
    fontSize: "12px",
    marginTop: "-8px",
    marginBottom: "8px",
  },
};