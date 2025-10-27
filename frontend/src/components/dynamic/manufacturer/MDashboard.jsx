// import React from 'react';
// import ParticleOrbitEffect from "../../custom/SmokeCursor";
// import InteractiveGradient from "../../custom/InteractiveCard";
// import { SeasonalHoverCards } from '../../custom/SeasonalCard';
// import { GridBackground } from "../../static/pages/CustomBack";
// import AddProductImage from '../../../assets/addproduct.png';
// import ProductListImage from '../../../assets/productlist.png';
// import User from '../../custom/User';

// export default function MDashboard() {
//   return (
//     <GridBackground className="pt-20 md:pt-10 w-full min-h-screen overflow-y-auto relative">

//       <div className="flex flex-col mt-[100vh] md:mt-[-2vh] items-center font-[Manrope,_'Noto_Sans',_sans-serif] w-full px-4 md:px-10 lg:px-20">
//         <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Dashboard</h1>

//         {/* First Interactive Gradient Card */}
//         <InteractiveGradient
//           color="#1890ff"
//           glowColor="#107667ed"
//           followMouse={true}
//           hoverOnly={false}
//           intensity={100}
//           backgroundColor="#151419"
//           width="100%"
//           height="auto"
//           borderRadius="2rem"
//           className="w-full max-w-6xl"
//         >
//           <div className="p-4 md:p-10">
//             <SeasonalHoverCards
//               className="grid grid-cols-0  sm:grid-cols-3   lg:grid-cols-3 "
//               cards={[
//                 {
//                   title: "Decentralized Chat",
//                   description: "Secure, peer-to-peer messaging system.",
//                   imageSrc: "https://img.freepik.com/free-vector/decentralized-application-abstract-concept-illustration-digital-application-blockchain-p2p-computer-network-web-app-multiple-users-cryptocurrency-open-source_335657-962.jpg",
//                   path:'/chat'
//                 },
//                 {
//                   title: "Add New",
//                   description: "Add new products to the blockchain registry.",
//                   imageSrc: `${AddProductImage}`,
//                   path:'/add'
//                 },
//                 {
//                   title: "Product List",
//                   description: "List of all products added to the blockchain.",
//                   imageSrc: `${ProductListImage}`,
//                   path:'/product/list'
//                 },
//               ]}
//             />
//           </div>
//         </InteractiveGradient>

//         {/* Space between sections */}
//         <div className="my-10"></div>

//         {/* Second Interactive Gradient Card */}
//         <InteractiveGradient
//           color="#1890ff"
//           glowColor="#107667ed"
//           followMouse={true}
//           hoverOnly={false}
//           intensity={100}
//           backgroundColor="#151419"
//           width="100%"
//           height="auto"
//           borderRadius="2rem"
//           className="w-full max-w-6xl"
//         >
//           <div className="flex justify-center p-6">
//             <span className="text-2xl md:text-3xl">
//               <User />
//             </span>
//           </div>
//         </InteractiveGradient>
//       </div>
//     </GridBackground>
//   );
// }

import React from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

// Component for the individual feature cards
// FIX 1: Add 'onClick' to the props list
const DashboardCard = ({ title, icon: Icon, colorClass, animation, onClick }) => {
  return (
    <div
      // FIX 2: Pass the onClick handler to the inner div
      onClick={onClick} 
      className={`
        flex flex-col items-center justify-center p-8 m-4 rounded-xl shadow-2xl
        ${colorClass} text-white cursor-pointer transform transition-all duration-500 ease-in-out
        hover:shadow-2xl hover:scale-[1.05] active:scale-[0.95] active:bg-opacity-80
        ${animation}
      `}
    >
      <Icon sx={{ fontSize: 90 }} className="mb-4" />
      <h2 className="text-2xl font-bold tracking-wider">{title}</h2>
    </div>
  );
};


const AnimatedDashboardWithPing = () => {
  // FIX 3: Initialize the hook inside the component function body
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-blue-200 pt-80 pb-20 md:p-15  mt-0  md:mt-[-1%] flex flex-col justify-center items-center overflow-y-scroll">
      
      {/* <style jsx global> ... </style> (omitted for brevity) */}
      
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6 max-w-6xl w-full ">
        
        {/* Card 1: CHAT */}
        <DashboardCard
          title="CHAT"
          icon={ChatBubbleIcon}
          colorClass="bg-[#2a7ce7]" 
          animation="hover:skew-y-1 hover:translate-x-1"
          // FIX 4: Corrected the arrow function syntax
          onClick={() => { navigate('/chatmain') }}
        />

        {/* Card 2: NEW PRODUCT - The Crazier One! */}
        <DashboardCard
          title="NEW PRODUCT & BATCH"
          icon={Inventory2Icon} 
          colorClass="bg-[#1e61c7]" 
          animation="hover:shadow-2xl hover:shadow-cyan-400/50" 
          // FIX 4: Corrected the arrow function syntax
          onClick={() => { navigate('/add') }}
        />

        {/* Card 3: PRODUCT LIST */}
        <DashboardCard
          title="PRODUCT LIST"
          icon={ListAltIcon} 
          colorClass="bg-[#144991]" 
          animation="hover:-translate-y-3 hover:rotate-1" 
          // FIX 4: Corrected the arrow function syntax
          onClick={() => { navigate('/newproduct') }}
        />
        
      </div>
      
      {/* --- Footer/User Profile Section --- */}
      <div className="mt-12 w-full max-w-6xl">
        <div 
          // Added an onClick handler for the footer bar
          onClick={() => { navigate('/manprofile') }} 
          className="bg-blue-900 h-20 flex items-center justify-center rounded-lg shadow-xl transform transition-all duration-700 ease-out 
                     cursor-pointer hover:shadow-2xl hover:bg-blue-800 hover:scale-[1.01] active:scale-[0.99] hover:animate-pulse"> 
          <PersonIcon sx={{ fontSize: 40 }} className="text-white opacity-80" />
        </div>
      </div>
      
    </div>
  );
};

export default AnimatedDashboardWithPing;
