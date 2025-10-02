import React from "react";
import axios from "axios";
import { useState } from "react";
import Productsabi from "../../../abi/Products.json";
import { ethers } from "ethers";
import RegistryAbi from '../../../abi/Registry.json' 
import { GridBackground } from "../../static/pages/CustomBack";
import AnimatedList from "../../custom/AnimatedItem";
export default function ProductList() {
    const [products, setProducts] = useState([]);
    const getProducts = async() => {
        try {
            if (!window.ethereum) {
                console.error("MetaMask is not installed");
                return;
            }
    
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await  provider.getSigner();
            

            const productRegistryAddress = import.meta.env.VITE_PRODUCT_REGISTRY;
            const productRegistryContract = new ethers.Contract(productRegistryAddress, Productsabi, signer);

            const registryAddress = import.meta.env.VITE_REGISTRY_CONTRACT;
            const registryContract = new ethers.Contract(registryAddress, RegistryAbi, signer);

            const isManufacturer = await registryContract.getRole();
    console.log("Is Manufacturer:", Number(isManufacturer));
    
    if (Number(isManufacturer) !== 1) {
      alert("❌ You are not a registered manufacturer.");
      setLoading(false);
      return;
    }

            const productIds = await productRegistryContract.getProductsByManufacturer();
            console.log("Product IDs:", productIds);
            // const productscon = await productRegistryContract.getProduct(productIds[0]);
            // console.log("Product Details:", productscon[0]);
            const fetchedProducts = [];
            for (const productId of productIds) {
                try {
                    // Fetch product details from contract
                    const product = await productRegistryContract.getProduct(productId);
                    console.log("Product Details:", product);
                    // Optionally fetch IPFS details if needed (replace hash as needed)
                    // Adjust the index below if your IPFS hash is at a different index
                    let ipfsHash = product[0];
                    try {
                        const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
                        fetchedProducts.push({ ...product, details: response.data });
                    } catch (ipfsError) {
                        console.error(`Failed to fetch IPFS data for product ID ${productId}:`, ipfsError);
                        fetchedProducts.push({ ...product, details: null });
                    }
                } catch (error) {
                    console.error(`Failed to fetch product details for product ID ${productId}:`, error);
                }
            }
            console.log("Products:", fetchedProducts);
            setProducts(fetchedProducts);

            console.log("Final Products:",products)
            
    
    
        }catch(error){
            console.error(error)
        }
    }
    return(
        <>
            <GridBackground className="pl-[30vh] md:pl-0 md:pt-30 mt-[-1%] mb-20 min-h-screen overflow-y-scroll relative">
                <button onClick={getProducts}>Product List Component</button>
                <div>
                    {products.length === 0 ? (
                        <p>No products found. Click the button to load products.</p>
                    ) : (
                        <AnimatedList
                            items={products.map((product) => product['details'].productName ? product['details'].productName.toString() : 'N/A')}
                            onItemSelect={(item, idx) => console.log('Selected product:', products[idx])}
                            showGradients={true}
                            enableArrowNavigation={true}
                            displayScrollbar={true}
                        />
                    )}
                </div>
            </GridBackground>
        </>
    )
}