import React from 'react'
import { GridBackground } from './CustomBack'
import TeamCarousel from '../../custom/TeamCarousel'
import InteractiveGradient from '../../custom/InteractiveCard';
function Team() {
    const teamMembers = [
  {
    id: "1",
    name: "Deven Atkari",
    role: "Founder",
    image: "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753531802/520957623_17849783982510071_6171715692227189484_n_moe49p.png",
    bio: "Visionary leader with 10+ years of experience."
  },
    {
    id: "2",
    name: "Prashik Jadhav",
    role: "Founder",
    image: "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753533123/IMG_20220524_203710_pg7liy.jpg",
    bio: "Visionary leader with 10+ years of experience."
  },
      {
    id: "2",
    name: "Ayush Jadhav",
    role: "Founder",
    image: "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753538736/IMG-20250726-WA0008_r8y4p2.jpg",
    bio: "Visionary leader with 10+ years of experience."
  },
        {
    id: "2",
    name: "Dipesh Bharadwaj",
    role: "Founder",
    image: "https://res.cloudinary.com/dvo3jxlku/image/upload/v1753533263/IMG-20250726-WA0003_h45ww5.jpg",
    bio: "Visionary leader with 10+ years of experience."
  }
  // ... more members
];
  return (
    <GridBackground className='pl-[30vh]  md:pl-0 md:pt-64 mt-20 h-screen   overflow-y-scroll'>
    <div
        className="relative flex flex-col font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[30vh] md:mt-[8vh] md:w-[100vh] pt-[35vh] md:pt-[0vh] ml-[20vh] md:ml-[10vh] mr-[20vh] overflow-y-auto md:mb-[10vh]"
      >
        <h1 className="text-4xl font-bold text-white mb-5">Our Team</h1>
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
      members={teamMembers}
      title="OUR TEAM"
      autoPlay={3000}
      onMemberChange={(member, index) => {
        console.log('Active member:', member.name);
      }}
    />
    {/* </InteractiveGradient> */}
    </div>
    </GridBackground>
  )
}

export default Team