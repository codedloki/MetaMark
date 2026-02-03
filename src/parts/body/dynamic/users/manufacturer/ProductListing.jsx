import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnect } from "../../../../providers/ConnectProvider";
import { useUser } from "../../../../providers/UsersProvider";
import axios from "axios";
export default function ProductListing() {

  const navigate = useNavigate();
  const {walletAddress} = useConnect()
  const {product} = useUser()
  const [pid,setpid] = useState()
   const [products, setProducts] = useState([
    {
      name: "Paracetamol",
      batches: [
        { batchId: "P-001", active: true },
        { batchId: "P-002", active: false },
      ],
    },
    {
      name: "Cough Syrup",
      batches: [
        { batchId: "C-001", active: true },
      ],
    },
  ]);

  useEffect(()=>{
    const getmyproducts =async()=>{
        try {
            if(!walletAddress) return "Wallet not initialized";
            if(!product) return;
            const productci = await product.getProductsByManufacturer(walletAddress)

            setProducts([]);
            console.log("Product Ids:",productci)

            for(const id of productci){
                console.log("Product1 Ids :",id)
                
                const productipfs = await product.getProduct(id)
                console.log(productipfs)
                
                const res = await axios.get(`https://ipfs.io/ipfs/${productipfs[0]}`)
                console.log("Ipfs Data: ",res.data)

                const newProduct = {
                    id:id,
          name: res.data.productName,
          batches: [
            { batchId: "P-001", active: true },
            { batchId: "P-002", active: false },
          ]
        };

                setProducts(prevProducts => [...prevProducts, newProduct]);
                console.log(products)
                
            }
            
        } catch (error) {
            console.log("Errro Occured:",error)
        }

    }
    getmyproducts()
  },[walletAddress,product])
  return (
    // page style: minHeight, background gradient, flex centering
    <div className="min-h-screen bg-gradient-to-br text-black from-[#1E3A8A] to-[#020617] flex justify-center items-center p-5">
      
      {/* card style: maxWidth, bg-white, padding, rounded, shadow */}
      <div className="w-full max-w-[900px] bg-white p-8 rounded-[24px] shadow-2xl">
        
        {/* heading style */}
        <h2 className="text-center mb-8 text-2xl font-bold">🏭 My Products</h2>

        {products.length === 0 ? (
          /* emptyText style */
          <p className="text-center text-slate-500">
            No products registered yet
          </p>
        ) : (
          products.map((product, index) => {
            const active = product.batches?.filter(b => b.active).length || 0;
            const expired = product.batches?.filter(b => !b.active).length || 0;

            return (
              /* productItem style */
              <div 
                key={index} 
                className="flex justify-between items-center p-[18px] rounded-[16px] bg-slate-50 mb-4 border border-slate-200"
              >
                <div>
                  {/* productName style */}
                  <h3 className="text-lg font-semibold mb-1.5">
                    {product.name}
                  </h3>
                  {/* batchInfo style */}
                  <p className="text-sm text-slate-600">
                    Active: {active} | Expired: {expired}
                  </p>
                </div>

                {/* viewBtn style */}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-[12px] font-medium transition-colors cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details →
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

