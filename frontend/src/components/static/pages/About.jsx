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
                  <h3 className="text-xl font-bold">Who are we?</h3>
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
