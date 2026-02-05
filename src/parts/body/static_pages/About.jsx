import React from 'react'
import about from '../../../assets/about_image.avif'
import { ShieldCheck, Target, Globe } from "lucide-react"

function About() {
  return (
    <div className="min-h-screen w-full bg-[#020617] bg-gradient-to-b from-[#020617] to-[#0f172a] text-white font-sans flex items-center px-6 py-12 md:px-20 md:py-25 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CONTENT WRAPPER */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-y-12 md:gap-x-28 relative z-10">

        {/* TEXT SECTION */}
        <div className="w-full md:w-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck size={14} /> The Future of Trust
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-8 text-center md:text-left tracking-tight">
            About <span className="text-blue-500">Us</span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 font-medium leading-relaxed text-justify md:text-left mb-8">
            MetaMark is a cutting-edge blockchain-based product verification
            system designed to ensure the authenticity of products and combat
            counterfeiting. By leveraging the power of blockchain technology,
            MetaMark provides a secure and transparent platform for
            manufacturers, retailers, and consumers to verify the legitimacy
            of products in real-time.
          </p>

          {/* Core Values / Stats */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
               <p className="text-blue-500 font-black text-2xl uppercase italic">Secure</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">End-to-End Encryption</p>
            </div>
            <div className="space-y-1">
               <p className="text-emerald-500 font-black text-2xl uppercase italic">Global</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Supply Chain Ready</p>
            </div>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <div className="relative group">
            {/* Image Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <img
              src={about}
              alt="About MetaMark"
              className="relative w-full max-w-sm md:max-w-full h-auto md:h-[460px] object-cover rounded-[2rem] shadow-2xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 brightness-90 group-hover:brightness-100 border border-white/10"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default About