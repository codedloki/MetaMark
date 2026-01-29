import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '../../../../providers/UsersProvider';
import { Skeleton} from '../../../../../components/ui/skeleton'
import { useNavigate } from 'react-router-dom';
import { useConnect } from '../../../../providers/ConnectProvider';
 
export default function ManufactDash(){
  const {registry,product,role} = useUser()
  const {walletAddress} = useConnect()
 
  const [manufact,setmanufact] = useState({
    name:'',
    company:'',

  })

  

  useEffect(()=>{
    const confirmrole =()=>{
      console.log("Role on Dash :",role)
      if (role != 1) return (
        <div className='text-6xl'>
          You are not Authorized
        </div>
      )
    }
    confirmrole()
  })

  const [nof,setnof] = useState(0)

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


  const [loading,setloading ] = useState(true)
  useEffect(()=>{
    if (!registry) return;
    const getManInfo=async()=>{
      const manufact = await registry.getManufacturer()
      console.log("Manufacturer Data :",manufact[0] )
      setmanufact({
        name:manufact[0],
        company:manufact[1]
      })  
      
    }

    getManInfo()
    setloading(false)
    console.log(manufact)
  },[registry])


  if(role!==1){
    return(
      <div className='w-full text-6xl text-center text-red-500 justify-items-between'>
        You are not Authorized 
      </div>
    )
  }

useEffect(() => {
  if (!product) return;

  const getprods = async () => {
    try {
      const productids = await product.getProductsByManufacturer();
      console.log("Product IDs:", productids);

      const products = [];

      for (const productid of productids) {
        const prod = await product.getProduct(productid);
        products.push({
          productid,
          ipfshash: prod.details,
          isActive: prod.isActive,
        });
      }

      console.log("Products:", products);
      console.log("Length:",products.length)
      setnof(products.length)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  getprods(); // ✅ CALLED HERE
}, [product]);


  return (
    <div className="ml-20  min-h-screen w-screen bg-[#cbdff2] flex items-center justify-center ml-[-7vh] mt-[-6vh]  md:mt-[-3vh]   font-sans">
      {/* Main Dashboard Card 
        Using glassmorphism (backdrop-blur) and a subtle border 
      */}
      <div className="ml-40 relative w-full max-w-4xl overflow-hidden md:rounded-[2.5rem] border border-white/30 bg-gradient-to-br from-blue-300/40 via-white/40 to-blue-200/40 p-10 shadow-2xl backdrop-blur-2xl">
        
        {/* Decorative background blurs for the "swirl" effect */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-10 flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-blue-200/50">
              {/* Manufacturer Icon */}
              <svg 
                className="h-12 w-12 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Dashboard
            </h1>
          </div>

          {/* Manufacturer Name & Info */}
       {
        loading ? (
             <div className="mb-10">
            <Skeleton className='hidden w-60'>
            <h2 className="text-3xl font-bold text-slate-800"> {manufact.name}</h2>
            </Skeleton>
            <div className="mt-1 space-y-0.5">
              <p className="text-lg font-medium text-slate-600"> {manufact.company}</p>
              <p className="text-sm font-semibold tracking-wider text-slate-400">COMPANY ID / REG NO. : </p>
            </div>
          </div>
        ):(
             <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800"> {manufact.name}</h2>
            <div className="mt-1 space-y-0.5">
              <p className="text-lg font-medium text-slate-600"> {manufact.company}</p>
              <p className="text-sm font-semibold tracking-wider text-slate-400">COMPANY ID / REG NO. : </p>
            </div>
          </div>
        )
       }

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Products Card */}
            <div className="rounded-3xl bg-white/90 p-8 shadow-sm transition-transform hover:scale-[1.02]">
              <h3 className="text-lg font-semibold text-slate-600">Total Products Registered</h3>
              <p className="my-2 text-3xl font-extrabold text-slate-800">{nof} Products</p>
              <p className="text-sm font-medium text-slate-400">All products successfully registered on blockchain</p>
            </div>

            {/* Batches Card */}
            <div className="rounded-3xl bg-white/90 p-8 shadow-sm transition-transform hover:scale-[1.02]">
              <h3 className="text-lg font-semibold text-slate-600">Total Active Batches</h3>
              <p className="my-2 text-3xl font-extrabold text-slate-800">34 Active Batches</p>
              <p className="text-sm font-medium text-slate-400">Batches currently in production or distribution</p>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-12 flex justify-end gap-4">
            <ActionButton icon={<span className="text-2xl">+</span>} url="/m/create/product"/>
            <ActionButton icon={<ChartIcon />} url="/m/charts" />
            <ActionButton icon={<DocIcon />} url="/m/docs" />
            <ActionButton icon={<LinkIcon />} url="/m/links" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper Components for Icons/Buttons */
const ActionButton = ({ icon,url }) => {
  const navigate = useNavigate()
  return(
  <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-500 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg active:scale-95" onClick={(e)=>{
    e.preventDefault()
    navigate(url)
  }}>
    {icon}
  </button>
)};

const ChartIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 19h14v-2H5v2zm10-4h4v-4h-4v4zM5 7v10h4V7H5zm5 10h4V3h-4v14z"/></svg>
);

const DocIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zM13 9V3.5L18.5 9H13z"/></svg>
);

const LinkIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);

