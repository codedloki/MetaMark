import React, { useState } from "react";
import axios from "axios";
import Productsabi from "../../../../abi/Products.json";
import { ethers } from "ethers";
import RegistryAbi from '../../../../abi/Registry.json';

export default function AddProductForm({ onBack }) {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    sideEffects: ""
  });

  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
            "Content-Type": "application/json"
          }
        }
      );

      const ipfsHash = res.data.IpfsHash;
      setHash(ipfsHash);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(import.meta.env.VITE_PRODUCT_REGISTRY, Productsabi, signer);

      const registry = new ethers.Contract(import.meta.env.VITE_REGISTRY_CONTRACT, RegistryAbi, signer);
      const signerAddress = await signer.getAddress();
      const isManufacturer = await registry.getRole();

      if (Number(isManufacturer) !== 1) {
        alert("❌ You are not a registered manufacturer.");
        setLoading(false);
        return;
      }

      const nonce = Math.floor(Math.random() * 100000);
      const tx = await contract.registerProduct(ipfsHash, nonce, { gasLimit: 1000000 });
      const receipt = await tx.wait();

      let productId = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === "ProductRegistered") {
            productId = parsedLog.args.productId;
            break;
          }
        } catch {
          continue;
        }
      }

      if (productId) {
        alert(`✅ Product registered successfully! Product ID: ${productId}`);
      } else {
        alert("✅ Product registered, but could not retrieve Product ID from events");
      }

    } catch (error) {
      console.error("❌ Error:", error);
      if (error.reason) {
        alert(`❌ Transaction failed: ${error.reason}`);
      } else if (error.message.includes("revert")) {
        alert("❌ Transaction reverted. Check contract compatibility.");
      } else {
        alert("❌ Upload or blockchain transaction failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white text-black p-6 rounded shadow-lg w-full max-w-xl mx-auto sm:p-8"
      onSubmit={handleUpload}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

      {/* Product Name */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Product Name</label>
        <input
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
          required
        ></textarea>
      </div>

      {/* Side Effects */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Side Effects</label>
        <input
          name="sideEffects"
          value={formData.sideEffects}
          onChange={handleChange}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter side effects"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={onBack}
        >
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded w-full sm:w-auto text-white ${loading ? "bg-gray-500" : "bg-blue-600"}`}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
