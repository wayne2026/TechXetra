import React from 'react';
import { StarsBackground } from '../../components/StarBackground';
const About: React.FC = () => {
  return (
    <div className='bg-gradient-to-b from-[#020b22] to-[#271938] '>
      <h1 className='text-white  text-4xl pl-20'>About Us</h1>
      <StarsBackground/>
    </div>
  );
};

export default About;
