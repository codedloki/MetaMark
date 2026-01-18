import React from 'react'
import { Button } from '../../../components/ui/button'
import regproduc from  '../../../assets/Laptop-Add-Plus--Streamline-Core.png'
function Home() {
  return (
    <div className="pl-30  w-full h-full   bg-white text-black font-bold ">
      
      {/* HERO SECTION */}
    <div className="">
        <div className=" ml-50 flex flex-col md:flex-row items-center justify-between  w-full max-w-5xl">
        
        {/* TEXT SECTION */}
        <div className="md:w-1/2 ">
          <h1 className="text-4xl leading-tight">
            Verify Authenticity <br/>of Product 
            Instantly <br/> with Blockchain
          </h1><br/>
          <p className="text-lg text-gray-600">
            Ensure product authenticity and combat <br/>counterfeiting with our blockchain-based <br/> verification system.
          </p>

          <div className="mt-6 space-x-4">
            {/* <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Get Started
            </button> */}

            <Button className='text-white text-2xl'>
              Get Started
            </Button>

            <Button className='text-white text-2xl' variant='outline'>
              Learn More
            </Button>
            </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          {/* <h1 className="text-xl text-gray-500">
            This will be image section
          </h1> */}
          <img src='https://media.istockphoto.com/id/1132091431/vector/verification-application-scanning-qr-code-on-mobile-phone.jpg?s=612x612&w=0&k=20&c=m2Sw8mN3tdRm6OwgBGmzElz1M2AFlkyHmTaMLupk-b0='/>
        </div>

      </div>

      {/* FEATURES SECTION */}
      <div className="ml-40 p-20 w-[75%] mt-[-1%]">
        {/* feature content here */}

      <div className='flex flex-col md:flex-row items-center text-center justify-between '>
          <div  className='flex flex-col items-center'>
            <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
          <p>Manufacturer Registers Product</p>
        </div>

         <div  className='flex flex-col items-center'>
            <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
          <p>Manufacturer Registers Product</p>
        </div>

        <div  className='flex flex-col items-center'>
            <img src={regproduc} alt="Register Product" className='w-10 h-10'/>
          <p>Manufacturer Registers Product</p>
        </div>
      </div>
      </div>
    </div>

    </div>
  )
}

export default Home
