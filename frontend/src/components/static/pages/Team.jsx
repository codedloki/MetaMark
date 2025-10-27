import React from "react";
import { v4 as uuidv4 } from "uuid";

import { GridBackground } from "./CustomBack";
import TeamCarousel from "../../custom/TeamCarousel";
import InteractiveGradient from "../../custom/InteractiveCard";
function Team() {
  const teamMembers = [
    {
      id: "1",
      name: "Deven Atkari",
      role: "Founder",
      image:
        "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753531802/520957623_17849783982510071_6171715692227189484_n_moe49p.png",
      bio: "Visionary leader with 10+ years of experience.",
    },
    {
      id: "2",
      name: "Prashik Jadhav",
      role: "Founder",
      image:
        "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753533123/IMG_20220524_203710_pg7liy.jpg",
      bio: "Visionary leader with 10+ years of experience.",
    },
    {
      id: "2",
      name: "Ayush Jadhav",
      role: "Founder",
      image:
        "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753538736/IMG-20250726-WA0008_r8y4p2.jpg",
      bio: "Visionary leader with 10+ years of experience.",
    },
    {
      id: "2",
      name: "Dipesh Bharadwaj",
      role: "Founder",
      image:
        "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753533263/IMG-20250726-WA0003_h45ww5.jpg",
      bio: "Visionary leader with 10+ years of experience.",
    },
    // ... more members
  ];
  return (
    <GridBackground className="fixed mt-[2%] md:mt-0 pl-[30%]  md:pl-0 md:pt-2  h-screen  items-center  overflow-y-scroll">
      <div className="fixed flex flex-col font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[-100%] md:mt-[-20%] md:w-screen pt-[10%] md:pt-0  ml-[-40%] md:ml-[-30%] mr-[20vh] overflow-y-auto ]">
        <h1 className=" font-bold text-white text-center md:text-left  mb-5">
          Our Team
        </h1>
        {/* <InteractiveGradient
    color="#1890ff"
  glowColor="#107667ed"
  followMouse={true}
  hoverOnly={false}
  intensity={100}
  backgroundColor="#151419"
  width="100vh"
  height="80vh"
  borderRadius="2.25rem"
    > */}
        <TeamCarousel
          className="fixed sm:mt-[-10%] sm:ml-[-40%]"
          members={teamMembers}
          title="OUR TEAM"
          autoPlay={3000}
          onMemberChange={(member, uuidv4) => {
            console.log("Active member:", member.name);
          }}
        />
        {/* </InteractiveGradient> */}
      </div>
    </GridBackground>
  );
}

export default Team;
