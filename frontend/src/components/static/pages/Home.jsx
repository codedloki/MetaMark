import React from "react";
import { GridBackground,DotBackground } from "./CustomBack";
import { Registration } from "../../dynamic/dynamic";
import {Popover,PopoverContent,PopoverTrigger} from '../../custom/Popoverit'
import InteractiveGradient from "../../custom/InteractiveCard";
import ScrollReveal from "../../custom/ScrollReveal";
import ParticleOrbitEffect from "../../custom/SmokeCursor";
function Home({isPopoverOpen,setIsPopoverOpen,SuccessToast,ErrorToast}) {
  return (
    
<GridBackground className='pl-[30vh]  md:pl-0 md:pt-64 mt-20 h-screen   overflow-y-scroll'>
{/* <ParticleOrbitEffect 
  particleCount={40}
  radius={90}
  particleSpeed={0.04}
  radiusScale={2}
  intensity={1.5}
  colorRange={[0, 60]}
/> */}
      <div
      className="relative  flex flex-col  dark overflow-y-auto font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[30vh] md:mt-[8vh] md:w-[100vh] pt-[35vh] md:pt-[0vh] ml-[20vh] md:ml-[10vh] mr-[20vh]"
      style={{ WebkitOverflowScrolling: "touch"}} // smooth scroll on iOS/Android
    >
    
    
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
            <div className="layout-container flex flex-col grow min-h-full">
        <div className="px-10 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="m-[10vh] md:m-0 mr-[10vh] md:mr-0">
              <div className="flex flex-col gap-6 px-4 py-10 sm:gap-8 md:flex-row">
                <div
                  className="w-1/2 md:w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl md:h-auto md:min-w-[400px] lg:w-full"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAe7-Q6z9aJKvNbeUeApJ21ppUU9fGxkrSh81JbkiPeqtVID0oW906mynlUNpYDPKv9SToyr93FPBzbRPfkRl17d9aYmY_7L2ZqQRK9dGZBJDMSVE61ptBhDHkFMhN24IVBOHv6GAJvbCER60_hWqc4c2i23irgiMSRkhD7_6rMporcXmmh3gXKt7CS5uqp2WaEu3rn6QA17mj8-8Ksl3Rn-U2NPaU8m8kci1ot1YuOl6pY_ZfEOLa72oiIYbxJj0Pj-LpDO_11PY4")`,
                  }}
                ></div>

                <div className="flex flex-col gap-6 md:min-w-[400px] md:gap-8 lg:justify-center ">
                  <div className="flex flex-col gap-2 text-left">
                    <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                      Verify Product Authenticity with MetaMark
                    </h2>
                    <h2 className="text-white text-sm font-normal leading-normal md:text-base">
                      Scan barcodes to instantly check if a product is genuine using blockchain technology. Protect yourself from counterfeits and ensure you're getting the real
                      deal.
                    </h2>
                  </div>

                  <button className="flex min-w-[84px] max-w-[480px]  cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 md:h-12 md:px-5 bg-transparent text-white text-sm font-bold md:text-base" style={{ textDecoration:"none"}}>
                    <span className="truncate ">Learn More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </InteractiveGradient>
    </div>

    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverContent className="w-screen h-2/4">
                    

          <div className="text-center">
            <Registration  SuccessToast={SuccessToast} ErrorToast={ErrorToast}/>
          
            {/* <p className="text-sm mb-2">Please connect to continue</p>
            <button
              onClick={() => {
                // handle wallet connection logic here or close popup
                setIsPopoverOpen(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Connect Now
            </button> */}
          </div>
           
        </PopoverContent>
      </Popover>




</GridBackground>
  );
}

export default Home;