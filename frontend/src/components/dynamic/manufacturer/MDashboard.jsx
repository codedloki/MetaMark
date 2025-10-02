import React from 'react';
import ParticleOrbitEffect from "../../custom/SmokeCursor";
import InteractiveGradient from "../../custom/InteractiveCard";
import { SeasonalHoverCards } from '../../custom/SeasonalCard';
import { GridBackground } from "../../static/pages/CustomBack";
import AddProductImage from '../../../assets/addproduct.png';
import ProductListImage from '../../../assets/productlist.png';
import User from '../../custom/User';

export default function MDashboard() {
  return (
    <GridBackground className="pt-20 md:pt-10 w-full min-h-screen overflow-y-auto relative">

      <div className="flex flex-col mt-[100vh] md:mt-[-2vh] items-center font-[Manrope,_'Noto_Sans',_sans-serif] w-full px-4 md:px-10 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Dashboard</h1>

        {/* First Interactive Gradient Card */}
        <InteractiveGradient
          color="#1890ff"
          glowColor="#107667ed"
          followMouse={true}
          hoverOnly={false}
          intensity={100}
          backgroundColor="#151419"
          width="100%"
          height="auto"
          borderRadius="2rem"
          className="w-full max-w-6xl"
        >
          <div className="p-4 md:p-10">
            <SeasonalHoverCards
              className="grid grid-cols-0  sm:grid-cols-3   lg:grid-cols-3 "
              cards={[
                {
                  title: "Decentralized Chat",
                  description: "Secure, peer-to-peer messaging system.",
                  imageSrc: "https://img.freepik.com/free-vector/decentralized-application-abstract-concept-illustration-digital-application-blockchain-p2p-computer-network-web-app-multiple-users-cryptocurrency-open-source_335657-962.jpg",
                  path:'/chat'
                },
                {
                  title: "Add New",
                  description: "Add new products to the blockchain registry.",
                  imageSrc: `${AddProductImage}`,
                  path:'/add'
                },
                {
                  title: "Product List",
                  description: "List of all products added to the blockchain.",
                  imageSrc: `${ProductListImage}`,
                  path:'/product/list'
                },
              ]}
            />
          </div>
        </InteractiveGradient>

        {/* Space between sections */}
        <div className="my-10"></div>

        {/* Second Interactive Gradient Card */}
        <InteractiveGradient
          color="#1890ff"
          glowColor="#107667ed"
          followMouse={true}
          hoverOnly={false}
          intensity={100}
          backgroundColor="#151419"
          width="100%"
          height="auto"
          borderRadius="2rem"
          className="w-full max-w-6xl"
        >
          <div className="flex justify-center p-6">
            <span className="text-2xl md:text-3xl">
              <User />
            </span>
          </div>
        </InteractiveGradient>
      </div>
    </GridBackground>
  );
}
