import React from 'react'
import about from '../../../assets/about_image.avif'

function About() {
  return (
    <div className="min-h-full w-full bg-white text-black font-bold flex items-center px-20 py-25">

      {/* CONTENT WRAPPER */}
     <div className="flex flex-col md:flex-row items-center justify-between w-full h-full max-w-6xl mx-auto gap-y-10 md:gap-x-28">


        {/* TEXT SECTION */}
        <div className="md:w-1/2">
          <h1 className="text-4xl leading-tight mb-6">
            About Us
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            MetaMark is a cutting-edge blockchain-based product verification
            system designed to ensure the authenticity of products and combat
            counterfeiting. By leveraging the power of blockchain technology,
            MetaMark provides a secure and transparent platform for
            manufacturers, retailers, and consumers to verify the legitimacy
            of products in real-time.
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
  src={about}
  alt="About MetaMark"
  className="w-full h-[420px] object-cover rounded-xl shadow-lg"
/>

        </div>

      </div>
    </div>
  )
}

export default About
