import React from 'react'
import about from '../../../assets/about_image.avif'

function About() {
  return (
    // ✅ Mobile par padding kam ki (px-6 py-12) aur desktop par wahi rakhi (md:px-20 md:py-25)
    <div className="min-h-screen w-full bg-white text-black font-bold flex items-center px-6 py-12 md:px-20 md:py-25">

      {/* CONTENT WRAPPER */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-y-12 md:gap-x-28">

        {/* TEXT SECTION */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl leading-tight mb-6 text-center md:text-left">
            About Us
          </h1>

          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed text-justify md:text-left">
            MetaMark is a cutting-edge blockchain-based product verification
            system designed to ensure the authenticity of products and combat
            counterfeiting. By leveraging the power of blockchain technology,
            MetaMark provides a secure and transparent platform for
            manufacturers, retailers, and consumers to verify the legitimacy
            of products in real-time.
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src={about}
            alt="About MetaMark"
            // ✅ h-auto mobile ke liye aur md:h-[420px] desktop ke liye
            className="w-full max-w-sm md:max-w-full h-auto md:h-[420px] object-cover rounded-[2rem] shadow-2xl"
          />
        </div>

      </div>
    </div>
  )
}

export default About