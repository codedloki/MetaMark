import React from 'react'
import ParticleOrbitEffect from "../../custom/SmokeCursor";
import InteractiveGradient from "../../custom/InteractiveCard";
import { SeasonalHoverCards } from '../../custom/SeasonalCard';
import { GridBackground } from "../../static/pages/CustomBack";
import { GlowingCard } from "../../custom/GlowingCard";
import User from '../../custom/User';
export default function MDashboard() {
  return (
     <GridBackground className="pl-[30vh] md:pl-0 md:pt-64 mt-20 h-screen overflow-y-scroll relative">
          
          {/* Particle Orbit Effect */}
          {/* <ParticleOrbitEffect 
            particleCount={40}
            radius={90}
            particleSpeed={0.04}
            radiusScale={2}
            intensity={1.5}
            colorRange={[0, 60]}
          /> */}
    
          <div
            className="relative flex flex-col font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[30vh] md:mt-[8vh] md:w-[100vh] pt-[35vh] md:pt-[0vh] ml-[20vh] md:ml-[10vh] mr-[20vh] overflow-y-auto md:mb-[10vh]"
          >
            <h1 className="text-4xl font-bold text-white mb-10">Dashboard</h1>
    
            {/* Interactive Gradient Card with Seasonal Cards inside */}
            <InteractiveGradient
              color="#1890ff"
              glowColor="#107667ed"
              followMouse={true}
              hoverOnly={false}
              intensity={100}
              backgroundColor="#151419"
              width="100vh"
              height="50vh"
              borderRadius="2.25rem"
            >
              <SeasonalHoverCards
                cards={[
                  {
                    title: "Active Batches",
                    description: "Scan barcode to verify authenticity via blockchain.",
                    imageSrc: "https://ipfs.io/ipfs/bafybeiefup4xzljyxtglnclrxwqyqkilo3c4fwkjxewsgehaj6jyouvcdu",
                    path:'/verify'
                    
                  },
                  {
                    title: "Decentralized Chat",
                    description: "Secure, peer-to-peer messaging system.",
                    imageSrc: "https://img.freepik.com/free-vector/decentralized-application-abstract-concept-illustration-digital-application-blockchain-p2p-computer-network-web-app-multiple-users-cryptocurrency-open-source_335657-962.jpg",
                    path:'/chat'
                  },
                    {
                    title: "Top Products Scanned",
                    description: "Scan barcode to verify authenticity via blockchain.",
                    imageSrc: "https://ipfs.io/ipfs/bafybeiefup4xzljyxtglnclrxwqyqkilo3c4fwkjxewsgehaj6jyouvcdu",
                    path:'/verify'
                  },
                ]}
              />
            </InteractiveGradient>
    
            <br />
           <InteractiveGradient
              color="#1890ff"
              glowColor="#107667ed"
              followMouse={true}
              hoverOnly={false}
              intensity={100}
              backgroundColor="#151419"
              width="100vh"
              height="50vh"
              borderRadius="2.25rem"
            >
              <div>
              <span className='text-3xl w-[80vh]'>
              <User/>
              </span>
    
              </div>
            </InteractiveGradient>
    
    
          </div>
        </GridBackground>
  )
}
