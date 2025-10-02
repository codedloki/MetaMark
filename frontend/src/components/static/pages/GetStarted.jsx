import React from 'react'
import Stepper, { Step } from '../../custom/Stepper';

import { GridBackground } from './CustomBack'
export default function GetStarted(){
    return(

        <div>
            <GridBackground className='pl-[30vh]  md:pl-0 md:pt-64 mt-0 h-screen text-6xl   overflow-y-scroll'>
         <div className="relative  flex flex-col  dark overflow-y-auto font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-0 md:mt-[-70%] md:w-[100vh] pt-[35vh] md:pt-[0vh] ml-[20vh] md:ml-[10vh] mr-[20vh]"
      style={{ WebkitOverflowScrolling: "touch"}} // smooth scroll on iOS/Android
    >
         
         {/* <HowGetStart/> */}
         </div>
         <div className='text-white text-3xl text-center mb-10'>
        
        HOW TO GET STARTED ?
        <div>
            <Stepper
  initialStep={1}
  onStepChange={(step) => {
    console.log(step);
  }}
  onFinalStepCompleted={() => console.log("All steps completed!")}
  backButtonText="Previous"
  nextButtonText="Next"
>
  <Step>
    <h2>Welcome to the React Bits stepper!</h2>
    <p>Check out the next step!</p>
  </Step>
  <Step>
    <h2>Step 2</h2>
    <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" />
    <p>Custom step content!</p>
  </Step>
  <Step>
    <h2>How about an input?</h2>
    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name?" />
  </Step>
  <Step>
    <h2>Final Step</h2>
    <p>You made it!</p>
  </Step>
</Stepper>
        </div>
         </div>
            </GridBackground>
        </div>

    )
}