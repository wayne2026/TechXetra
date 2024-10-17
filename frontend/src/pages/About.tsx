import { useRef, useEffect } from 'react';
import { gsap } from 'gsap'
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import SpaceShip from '../../components/SpaceShip'


const About: React.FC = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: 'random(-20,20)',
        x: 'random(-20,20)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 2,
      });
    }
  }, []);



  return (
    <div className='max-sm:pt-28 mx-auto  max-sm:pb-14 bg-gradient-to-b from-[#11021a] via-[#030229] to-[#1f021c] relative flex max-sm:flex-col sm:items-center sm:justify-center overflow-hidden  '>
      <StarsBackground className='absolute ' />
      <ShootingStars />
      <div className=' sm:w-[800px]'>
        <div className='sm:hidden '>
          <img ref={imageRef} src="/mascot-bg.png" width={250} alt="" className='absolute left-[17rem] bottom-56 top-2 -rotate-[30deg] ' />
        </div>
        <h1 className='max-sm:text-4xl max-sm:pl-5 max-sm:text-left text-nowrap font-technoHideo text-red-400 sm:pt-20 text-7xl font-bold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] sm:pl-20'>About Us</h1>
        <p className=' text-red-400 font-lemonMilk max-sm:pl-5 max-sm:pr-20 sm:pl-20  pt-8 sm:text-[0.96rem] max-sm:text-[0.5rem] leading-relaxed text-justify'>
          The annual techno-cultural fest of Tezpur University, TECHXETRA, is back and better than ever! Established in October 2008, TECHXETRA has quickly become one of the premier fests in India and Northeast, celebrating the dynamic fusion of culture and technology.
          Every year, TECHXETRA revolves around a unique theme that addresses real-world issues, fostering a bridge between students and genuine challenges. With vibrant cultural showcases, innovative tech events, and an inspiring campus backdrop, we attract some of the brightest minds in the nation.
          At the heart of TECHXETRA is a commitment to making learning fun and engaging. We blend entertaining events with rich cultural experiences in dance and music, ensuring high energy and joy throughout the fest.
          Our success is driven by the dedicated students and faculty of Tezpur University, who work tirelessly to elevate the fest to new heights. We invite you to join us for TECHXETRA 2024—a platform for innovation, cultural exchange, and, most importantly, a celebration of technological science.
          Come be a part of this vibrant journey and contribute to a brighter future!
        </p>
      </div>
      <div className='max-sm:hidden sm:mt-20'>
        <SpaceShip />
      </div>
    </div>
  );
};

export default About;


