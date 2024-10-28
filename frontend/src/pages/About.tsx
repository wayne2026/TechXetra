import { useRef, useEffect } from 'react';
import { gsap } from 'gsap'
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import SpaceShip from '../../components/SpaceShip';

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
    <div className='pt-0 md:pt-16 max-sm:pt-28 mx-auto max-sm:pb-14 bg-gradient-to-b from-[#11021a] via-[#030229] to-[#1f021c] relative flex max-sm:flex-col sm:items-center sm:justify-center overflow-hidden'>
      <StarsBackground className='absolute ' />
      <ShootingStars />
      <div className=''>
        <div className="block lg:hidden relative">
          <img
            ref={imageRef}
            src="/mascot-bg.png"
            width={250}
            alt=""
            className="absolute right-[-100px] top-[-100px] md:top-[-70px] rotate-[-30deg]"
          />
        </div>
        <h1 className='px-6 md:px-16 text-4xl md:text-7xl text-nowrap font-technoHideo text-red-400 font-bold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]'>About Us</h1>
        <p className='w-[80%] md:w-[90%] px-6 md:px-16 text-red-400 font-lemonMilk text-[0.5rem] md:text-sm leading-relaxed text-justify'>
          The annual techno-cultural fest of Tezpur University, TECHXETRA, is back and better than ever! Established in October 2008, TECHXETRA has quickly become one of the premier fests in India and Northeast, celebrating the dynamic fusion of culture and technology.
          Every year, TECHXETRA revolves around a unique theme that addresses real-world issues, fostering a bridge between students and genuine challenges. With vibrant cultural showcases, innovative tech events, and an inspiring campus backdrop, we attract some of the brightest minds in the nation.
          At the heart of TECHXETRA is a commitment to making learning fun and engaging. We blend entertaining events with rich cultural experiences in dance and music, ensuring high energy and joy throughout the fest.
          Our success is driven by the dedicated students and faculty of Tezpur University, who work tirelessly to elevate the fest to new heights. We invite you to join us for TECHXETRA 2024—a platform for innovation, cultural exchange, and, most importantly, a celebration of technological science.
          Come be a part of this vibrant journey and contribute to a brighter future!
        </p>
      </div>
      <div className='hidden lg:block'>
        <SpaceShip />
      </div>
    </div>
  );
};

export default About;


