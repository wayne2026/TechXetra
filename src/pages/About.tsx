import React from 'react';
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/shootingStars';
const About: React.FC = () => {
  return (
    <div className='bg-gradient-to-b from-[#11021a]  to-[#1f021c] relative '>
      <ShootingStars />
      <div className='absolute '>
        <h1 className='text-red-400 pt-20 text-4xl pl-20'>About Us</h1>
        <p className='w-1/2 text-red-400 pl-20 pt-10'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem quas quam voluptatum deserunt consectetur doloribus quos laudantium dignissimos voluptatem minus eius ducimus error animi non consequatur vero, rem harum amet doloremque molestias. Voluptatum unde, est saepe ducimus deleniti quo voluptatibus aliquam neque error illum. Consectetur, explicabo a. Fugit, officiis magni.</p>
      </div>
      <StarsBackground />

    </div>
  );
};

export default About;
