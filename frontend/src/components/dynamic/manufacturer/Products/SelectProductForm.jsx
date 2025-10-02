import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import ProductsAbi from "../../../../abi/Products.json";
import RegistryAbi from "../../../../abi/Registry.json";
import BatchForm from "./BatchForm";

export default function SelectProductForm({
  selectedProductId,
  setSelectedProductId,
  onBack,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask is not installed");
          return;
        }

        setLoading(true);

        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const productRegistryAddress =
          import.meta.env.VITE_PRODUCT_REGISTRY;
        const productRegistryContract = new ethers.Contract(
          productRegistryAddress,
          ProductsAbi,
          signer
        );

        const registryAddress = import.meta.env.VITE_REGISTRY_CONTRACT;
        const registryContract = new ethers.Contract(
          registryAddress,
          RegistryAbi,
          signer
        );

        const isManufacturer = await registryContract.isManufacturer(account);
        if (!isManufacturer) {
          alert("❌ You are not a registered manufacturer.");
          setLoading(false);
          return;
        }

        const productIds =
          await productRegistryContract.getProductsByManufacturer();

        const fetchedProducts = [];
        for (const productId of productIds) {
          try {
            const product = await productRegistryContract.getProduct(productId);
            const ipfsHash = product[0];

            let productName = "Unnamed Product";
            try {
              const response = await axios.get(
                `https://ipfs.io/ipfs/${ipfsHash}`
              );
              productName = response.data.productName || productName;
            } catch (ipfsError) {
              console.error(
                `Failed to fetch IPFS data for product ID ${productId}:`,
                ipfsError
              );
            }

            fetchedProducts.push({
              id: productId,
              name: productName,
              manufacturer: product[1],
              isActive: product[2],
            });
          } catch (error) {
            console.error(
              `Failed to fetch product details for product ID ${productId}:`,
              error
            );
          }
        }

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (showBatchForm) {
    return (
      <BatchForm
        productId={selectedProductId}
        onBack={() => setShowBatchForm(false)}
      />
    );
  }

  return (
    <form
      className="bg-white text-black p-6 rounded shadow text-lg"
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedProductId) setShowBatchForm(true);
      }}
    >
      <div>
        <label className="block mb-2">Select Product</label>
        <select
          className="border p-2 w-full mb-4"
          value={selectedProductId || ""}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select Product --</option>
          {loading ? (
            <option disabled>Loading products...</option>
          ) : products.length > 0 ? (
            products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))
          ) : (
            <option disabled>No products available</option>
          )}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            !selectedProductId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedProductId}
        >
          Next
        </button>
      </div>
    </form>
  );
}
