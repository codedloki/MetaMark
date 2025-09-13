/*
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridBackground } from './CustomBack';
import InteractiveGradient from '../../custom/InteractiveCard';
import { ScrollArea } from '../../custom/ScrollCustom';

function About() {
  const teamRef = useRef(null);
  const navigate = useNavigate();

  const handleScrollAndNavigate = () => {
    // Smooth scroll
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Wait for the scroll animation to finish (~1000ms)
    setTimeout(() => {
      navigate('/team');
    }, 1000); // You can tweak this delay
  };

  return (
    <>
      <GridBackground className="pt-64 mt-20 h-screen">
        <ScrollArea
          orientation="vertical"
          className="w-4/4 whitespace-nowrap rounded-md"
        >
          <div
            className="relative flex flex-col dark overflow-y-scroll font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[30vh] md:mt-[8vh] md:w-screen items-center"
            style={{
              WebkitOverflowScrolling: 'touch',
              height: '100vh',
              scrollBehavior: 'smooth',
            }}
          >
            <div className="w-1.5/4" ref={teamRef}>
              <InteractiveGradient
                color="#1890ff"
                glowColor="#107667ed"
                followMouse={true}
                hoverOnly={false}
                intensity={100}
                backgroundColor="#151419"
                width="45rem"
                height="20rem"
                borderRadius="2.25rem"
              >
                <div className="p-28 text-black">
                  <h3 className="text-6xl text-white font-bold">Who are we?</h3>
                  <br />
                  <p className="text-gray-300 text-center">
                    We are a decentralized crew on a mission <br /> to make
                    ownership trustless and unstoppable. Built for the people,
                    <br /> by the people 💫
                  </p>
                  <br />
                  <div>
                    <button
                      onClick={handleScrollAndNavigate}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
                    >
                      View Team
                    </button>
                  </div>
                </div>
              </InteractiveGradient>
            </div>
          </div>
        </ScrollArea>
      </GridBackground>
    </>
  );
}

export default About;
*/
/*
import  React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridBackground } from './CustomBack';
import InteractiveGradient from '../../custom/InteractiveCard';
import { ScrollArea } from '../../custom/ScrollCustom';

function About() {
  const teamRef = useRef(null);
  const navigate = useNavigate();

  const handleScrollAndNavigate = () => {
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      navigate('/team');
    }, 1000);
  };

  return (
    <GridBackground className="pt-32 md:pt-64 mt-10 h-screen">
      <ScrollArea
        orientation="vertical"
        className="w-full whitespace-nowrap rounded-md"
      >
        <div
          className="relative flex flex-col overflow-y-scroll items-center font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[20vh] md:mt-[8vh] px-4"
          style={{
            WebkitOverflowScrolling: 'touch',
            height: '100vh',
            scrollBehavior: 'smooth',
          }}
        >
          <div className="w-full sm:w-3/4 md:w-2/4 lg:w-2/5" ref={teamRef}>
            <InteractiveGradient
              color="#1890ff"
              glowColor="#107667ed"
              followMouse={true}
              hoverOnly={false}
              intensity={100}
              backgroundColor="#151419"
              width="100%"
              height="auto"
              borderRadius="1.5rem"
            >
              <div className="p-6 sm:p-10 md:p-16 lg:p-20 text-black text-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
                  Who are we?
                </h3>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-4">
                  We are a decentralized crew on a mission <br />
                  to make ownership trustless and unstoppable. <br />
                  Built for the people, by the people 💫
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleScrollAndNavigate}
                    className="bg-emerald-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-emerald-600 transition duration-300"
                  >
                    View Team
                  </button>
                </div>
              </div>
            </InteractiveGradient>
          </div>
        </div>
      </ScrollArea>
    </GridBackground>
  );
}

export default About;
*/

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridBackground } from './CustomBack';
import InteractiveGradient from '../../custom/InteractiveCard';
import { ScrollArea } from '../../custom/ScrollCustom';

function About() {
  const teamRef = useRef(null);
  const navigate = useNavigate();

  const handleScrollAndNavigate = () => {
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      navigate('/team');
    }, 1000);
  };

  return (
    <GridBackground className="pt-24 sm:pt-32 md:pt-48 mt-6 min-h-screen">
      <ScrollArea
        orientation="vertical"
        className="w-full whitespace-nowrap rounded-md"
      >
        <div
          className="relative flex flex-col items-center font-[Manrope,_'Noto_Sans',_sans-serif] px-4 sm:px-6 md:px-8 lg:px-12"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          {/* Card Container */}
          <div
            ref={teamRef}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          >
            <InteractiveGradient
              color="#1890ff"
              glowColor="#107667ed"
              followMouse={true}
              hoverOnly={false}
              intensity={100}
              backgroundColor="#151419"
              width="100%"
              height="auto"
              borderRadius="1.5rem"
            >
              <div className="p-6 sm:p-8 md:p-12 lg:p-16 text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">
                  Who are we?
                </h3>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-4 leading-relaxed">
                  We are a decentralized crew on a mission <br />
                  to make ownership trustless and unstoppable. <br />
                  Built for the people, by the people 💫
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleScrollAndNavigate}
                    className="bg-emerald-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md hover:bg-emerald-600 transition duration-300 w-full sm:w-auto"
                  >
                    View Team
                  </button>
                </div>
              </div>
            </InteractiveGradient>
          </div>
        </div>
      </ScrollArea>
    </GridBackground>
  );
}

export default About;

