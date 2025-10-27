import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ethers } from 'ethers';
import Productsabi from '../../../../abi/Products.json';
import RegistryAbi from '../../../../abi/Registry.json';

const AddProductForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sideEffect: '',
  });
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Upload product data to Pinata IPFS
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        formData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_API}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const ipfsHash = res.data.IpfsHash;
      setHash(ipfsHash);

      // ✅ Connect to blockchain
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

      const isManufacturer = await registry.getRole();

      if (Number(isManufacturer) !== 1) {
        alert('❌ You are not a registered manufacturer.');
        setLoading(false);
        return;
      }

      // ✅ Register product on blockchain
      const nonce = Math.floor(Math.random() * 100000);
      const tx = await contract.registerProduct(ipfsHash, nonce, { gasLimit: 1000000 });
      const receipt = await tx.wait();

      let productId = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'ProductRegistered') {
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
        alert('✅ Product registered, but could not retrieve Product ID from events');
      }

    } catch (error) {
      console.error('❌ Error:', error);
      if (error.reason) {
        alert(`❌ Transaction failed: ${error.reason}`);
      } else if (error.message.includes('revert')) {
        alert('❌ Transaction reverted. Check contract compatibility.');
      } else {
        alert('❌ Upload or blockchain transaction failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Product</h2>

      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <TextField
            fullWidth
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            variant="outlined"
            size="small"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            name="description"
            label="Description"
            placeholder="Enter description"
            variant="outlined"
            multiline
            rows={3}
            size="small"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <TextField
            fullWidth
            name="sideEffect"
            label="Side Effect"
            placeholder="Enter side effect"
            variant="outlined"
            size="small"
            value={formData.sideEffect}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="contained"
            onClick={onBack}
            sx={{
              backgroundColor: 'rgb(55 65 81)',
              '&:hover': {
                backgroundColor: 'rgb(75 85 99)',
              },
            }}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: 'rgb(37 99 235)',
              '&:hover': {
                backgroundColor: 'rgb(29 78 216)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
          </Button>
        </div>
      </form>

  
    </div>
  
  );
};

export default AddProductForm;
