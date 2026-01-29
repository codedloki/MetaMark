// import React from 'react'
// import { Button } from '../../../components/ui/button'
// import regproduc from  '../../../assets/Laptop-Add-Plus--Streamline-Core.png'
// import { ScrollArea } from '../../../components/ui/scroll-area.tsx'

// function Home() {
//   return (
//     <ScrollArea>
//     <div className="  w-full h-full   bg-white text-black font-bold overflow-y-auto scroll-auto md:overflow-hidden">
      
//       {/* HERO SECTION */}
//     <div className="md:grid-cols-2">
//         <div className="ml-0 md:ml-50 flex flex-col  items-center justify-between  w-full max-w-5xl">
        
//         {/* TEXT SECTION */}
//         <div className="w-full  pt-3">
//           <h2 className="text-2xl md:text-4xl">
//             Verify Authenticity <br/>of Product 
//             Instantly <br/> with Blockchain
//           </h2><br/>
//           <p className="w-full text-lg text-gray-600">
//             Ensure product authenticity and combat <br/>counterfeiting with our blockchain-based <br/> verification system.
//           </p>

//           <div className="mt-6 space-x-4">
//             {/* <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
//               Get Started
//             </button> */}

//             <Button className='text-white text-2xl' variant="">
//               Get Started
//             </Button>

//             <Button className='text-white text-2xl' variant='outline'>
//               Learn More
//             </Button>
//             </div>
//         </div>

//         {/* IMAGE SECTION */}
//         <div className="w-screen  justify-center mt-10 md:mt-0">
//           {/* <h1 className="text-xl text-gray-500">
//             This will be image section
//           </h1> */}
//           <img src='https://media.istockphoto.com/id/1132091431/vector/verification-application-scanning-qr-code-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=m2Sw8mN3tdRm6OwgBGmzElz1M2AFlkyHmTaMLupk-b0='/>
//         </div>

//       </div>

//       {/* FEATURES SECTION */}
//       <div className="ml-40 p-20 w-[75%] mt-[-1%]">
//         {/* feature content here */}

//       <div className='flex flex-col md:flex-row items-center text-center justify-between '>
//           <div  className='flex flex-col items-center w-[-20%] h-20 md:w-64 '>
//             <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
//           <p>Manufacturer Registers Product</p>
//         </div>

//          <div  className='flex flex-col items-center'>
//             <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
//           <p>Manufacturer Registers Product</p>
//         </div>

//         <div  className='flex flex-col items-center'>
//             <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
//           <p>Manufacturer Registers Product</p>
//         </div>
//       </div>
//       </div>
//     </div>

//     </div>
//     </ScrollArea>
//   )
// }

// export default Home
import React from "react"
import { Button } from "../../../components/ui/button"
import regproduc from "../../../assets/Laptop-Add-Plus--Streamline-Core.png"
import { ScrollArea } from "../../../components/ui/scroll-area"


function Home() {
  return (
    <ScrollArea className="h-screen">
      <div className="w-full bg-white text-black font-bold">

        {/* HERO SECTION */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* TEXT */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-4xl leading-tight">
                Verify Authenticity <br />
                of Product Instantly <br />
                with Blockchain
              </h2>

              <p className="mt-4 text-lg text-gray-600">
                Ensure product authenticity and combat
                counterfeiting with our blockchain-based
                verification system.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="text-white text-lg">
                  Get Started
                </Button>

                <Button variant="outline" className="text-lg text-white">
                  Learn More
                </Button>
              </div>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src="https://media.istockphoto.com/id/1132091431/vector/verification-application-scanning-qr-code-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=m2Sw8mN3tdRm6OwgBGmzElz1M2AFlkyHmTaMLupk-b0="
                alt="Verification"
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-gray-50 py-12 mb-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

              <div className="flex flex-col items-center">
                <img src={regproduc} className="w-10 h-10 mb-2" />
                <p>Manufacturer Registers Product</p>
              </div>

              <div className="flex flex-col items-center">
                <img src={regproduc} className="w-10 h-10 mb-2" />
                <p>Blockchain Stores Product Data</p>
              </div>

              <div className="flex flex-col items-center">
                <img src={regproduc} className="w-10 h-10 mb-2" />
                <p>User Verifies via QR Code</p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </ScrollArea>
  )
}

export default Home
