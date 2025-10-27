// import React, { useState, useCallback } from 'react';
// import { BrowserProvider, Contract } from "ethers";
// import Registryabi from '../../../abi/Registry';

// // Mock data for the products
// const MOCK_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
//   id: i + 1,
//   name: `Product Item ${i + 1}`,
//   color: i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300',
// }));

// // Placeholder Edit Icon
// const EditIcon = ({ className = 'w-5 h-5' }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
//   </svg>
// );

// // Product Card Component
// const ProductCard = ({ product }) => (
//   <div
//     className={`aspect-square ${product.color} rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02]`}
//     aria-label={product.name}
//   />
// );

// const ManProfile = () => {
//   const [displayName, setDisplayName] = useState("");
//   const [user, setUser] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState("");

//   // ✅ get manufacturer data from contract
//   const getManData = useCallback(async (signer) => {
//     if (!signer) {
//       console.log("⏳ Waiting for signer to be available...");
//       return;
//     }

//     try {
//       const contract = new Contract(
//         import.meta.env.VITE_REGISTRY_CONTRACT || '0xMockContractAddress',
//         Registryabi,
//         signer
//       );

//       const response = await contract.getManufacturer();
//       console.log("✅ Manufacturer data fetched:", response);
//       console.log(response)


//       const formatedresponse = response.map(msg =>{
//         console.log(`Message Content:${ JSON.stringify(msg.target)}`)
//       })

//       setUser(response);
//       if (response && response[0]) setDisplayName(response[0]);
//     } catch (err) {
//       console.error("⚠️ fetchRole error:", err);
//     }
//   }, []);

//   // ✅ connect to MetaMask and get signer
//   const setupConnection = useCallback(async () => {
//     try {
//       if (!window.ethereum) {
//         setError("MetaMask not detected!");
//         return;
//       }

//       const provider = new BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();

//       setAccount(address);
//       setIsConnected(true);
//       localStorage.setItem("address", address);

//       await getManData(signer);
//     } catch (err) {
//       console.error("Setup connection failed:", err);
//       setError("Failed to setup wallet connection.");
//     }
//   }, [getManData]);

//   // Mock User Data
//   const profile = {
//     name: displayName || 'MetaTextile Pvt.Ltd.',
//     wallet: account || '0x*A73D...83BC*',
//     avatarUrl: 'https://placehold.co/100x100/94A3B8/FFFFFF?text=MT',
//   };

//   const [isEditing, setIsEditing] = useState(false);

//   const handleEdit = () => {
//     setIsEditing(!isEditing);
//     console.log('✏️ Edit Profile clicked:', !isEditing);
//   };

//   return (
//     <div className="min-h-screen md:ml-80 bg-blue-50 font-inter p-4 sm:p-8">
//       {/* Profile Header */}
//       <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 border border-sky-200/50">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
//             <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 shadow-inner overflow-hidden flex-shrink-0 border-4 border-white ring-2 ring-blue-500/50">
//               <img
//                 src={profile.avatarUrl}
//                 alt={`${profile.name} Avatar`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "https://placehold.co/100x100/A3B8C9/FFFFFF?text=MT";
//                 }}
//               />
//             </div>

//             <div className="pt-2">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 leading-tight">
//                 {profile.name}
//               </h1>
//               <p className="text-sm sm:text-base text-gray-500">
//                 Blockchain wallet
//               </p>
//               <p className="text-base sm:text-lg font-mono text-gray-700">
//                 {profile.wallet}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleEdit}
//             className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-600 transition duration-150 ease-in-out self-end md:self-center flex-shrink-0"
//           >
//             <EditIcon className="w-4 h-4" />
//             <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
//           </button>
//         </div>

//         {!isConnected && (
//           <button
//             onClick={setupConnection}
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
//           >
//             Connect Wallet
//           </button>
//         )}

//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>

//       {/* Products */}
//       <div className="mt-10">
//         <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
//           Products
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {MOCK_PRODUCTS.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManProfile;


import React, { useState, useCallback,useEffect } from 'react';
import { BrowserProvider, Contract } from "ethers";
import Registryabi from '../../../abi/Registry';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

// Utility function to handle BigInt during JSON.stringify
// Converts BigInt to a string to prevent the serialization error.
const bigIntReplacer = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

// Mock data for the products
const MOCK_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Product Item ${i + 1}`,
  color: i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300',
}));

// Placeholder Edit Icon
const EditIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// Product Card Component
const ProductCard = ({ product }) => (
  <div
    className={`aspect-square ${product.color} rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02]`}
    aria-label={product.name}
  />
);

const ManProfile = () => {
  const [displayName, setDisplayName] = useState("");
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [ company,setcompany ]  = useState("")
  const [cinitial,setcinitial] = useState("")
  const [isLoading,setisLoading] = useState(true)




// get mandata at start 

  useEffect(()=>{
    console.log("Component Loaded")
    setupConnection()
    return ()=>{
      console.log("Component unmounted")
    }

  },[])





  // ✅ get manufacturer data from contract
  const getManData = useCallback(async (signer) => {
    if (!signer) {
      console.log("⏳ Waiting for signer to be available...");
      return;
    }

    try {
      const contract = new Contract(
        import.meta.env.VITE_REGISTRY_CONTRACT || '0xMockContractAddress',
        Registryabi,
        signer
      );

      const response = await contract.getManufacturer();
      
      // ⚠️ FIX APPLIED HERE
      // Use the custom replacer to stringify the response for logging
      console.log("✅ Manufacturer data fetched:", JSON.stringify(response, bigIntReplacer));
      const formatedresponse = JSON.stringify(response,bigIntReplacer)
      console.log(`formatedresponse ${formatedresponse[2]}`)
      setcinitial(formatedresponse[2])

    
  
      setUser(formatedresponse);
      setisLoading(false)
      console.log(response[1])
      setcompany(response[1])
      console.log("User :",user)
      if (response && response[0]) setDisplayName(response[0]);
    } catch (err) {
      console.error("⚠️ fetchRole error:", err);
    }
  }, []);

  // ✅ connect to MetaMask and get signer
  const setupConnection = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setIsConnected(true);
      localStorage.setItem("address", address);

      await getManData(signer);
    } catch (err) {
      console.error("Setup connection failed:", err);
      setError("Failed to setup wallet connection.");
    }
  }, [getManData]);

  // Mock User Data
  const profile = {
    name: displayName, 
    wallet: account,
    company: company,
    avatarUrl: `https://placehold.co/100x100/94A3B8/FFFFFF?text=${cinitial}`,
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    console.log('✏️ Edit Profile clicked:', !isEditing);
  };

  return (
    <div className="h-screen md:ml-80 bg-blue-50 font-inter p-4 sm:p-8 sm:mb-8 overflow-y-scroll">
      {/* Profile Header */}
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 border border-sky-200/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 shadow-inner overflow-hidden flex-shrink-0 border-4 border-white ring-2 ring-blue-500/50">

              {
                isLoading ? (
                   <Skeleton variant="rectangular" animation="wave"  width={210} height={118} />
                        
                  ):(
                   <img
                src={profile.avatarUrl}
                alt={`${profile.name} Avatar`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100/A3B8C9/FFFFFF?text=MT";
                }} />
                  )
              }
      
              
            </div>
  <div className="pt-2">
      {isLoading ? (
        <Stack spacing={1}>
          {/* Company Name (h1) */}
          <Skeleton
            variant="text"
            sx={{ fontSize: "2rem", bgcolor: "#cbd5e1" }}
            width={200}
            height={36}
          />
          {/* Person Name (p) */}
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", bgcolor: "#cbd5e1" }}
            width={140}
            height={24}
          />
          {/* Wallet Address (p) */}
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.2rem", bgcolor: "#cbd5e1" }}
            width={260}
            height={26}
          />
        </Stack>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 leading-tight">
            {profile.company}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">{profile.name}</p>
          <p className="text-base sm:text-lg font-mono text-gray-700">
            {profile.wallet}
          </p>
        </>
      )}
 </div>

          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-600 transition duration-150 ease-in-out self-end md:self-center flex-shrink-0"
          >
            <EditIcon className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {!isConnected && (
          <button
            onClick={setupConnection}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Connect Wallet
          </button>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Products */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
          Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ManProfile;
