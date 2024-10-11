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
    <div className='max-sm:pt-28 max-sm:pb-14 bg-gradient-to-b from-[#11021a] via-[#030229] to-[#1f021c] relative flex max-sm:flex-col sm:items-center overflow-hidden  '>
      <StarsBackground className='absolute ' />
      <ShootingStars />
      <div className=' sm:w-[800px]  sm:pt-20 '>
        <div className='sm:hidden '>
          <img ref={imageRef} src="/mascot-bg.png" width={250} alt="" className='absolute left-[17rem] bottom-56 top-2 -rotate-[30deg] ' />
        </div>
        <h1 className='max-sm:text-4xl max-sm:pl-5 max-sm:text-left text-nowrap font-technoHideo text-red-400 sm:pt-20 text-7xl font-bold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] sm:pl-20'>About Us</h1>
        <p className=' text-red-400 font-lemonMilk max-sm:pl-5 max-sm:pr-20 sm:pl-20  pt-10 sm:text-[1.3rem] max-sm:text-xs leading-relaxed text-justify'>
          TechXetra is Tezpur University's renowned annual techno-cultural festival, merging
          technology and culture. Since its inception on October 17, 2008, it has become a major
          event in North-East India, drawing participants nationwide. The festival showcases
          technical skills, innovative ideas, and cultural expressions.TechXetra is Tezpur University's renowned annual techno-cultural festival, merging
          technology and culture. Since its inception on October 17, 2008, it has become a major
          event in North-East India, drawing participants nationwide. The festival showcases
          technical skills, innovative ideas, and cultural expressions.
        </p>
      </div>
      <div className='max-sm:hidden'>
        <SpaceShip />
      </div>
    </div>
  );
};

export default About;


