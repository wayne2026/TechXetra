import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import {  useRef } from 'react';



const FooterBar: React.FC = () => {
  const socials = [
    // { name: 'YouTube', icon: '/Youtube Icon.svg', link: 'https://www.youtube.com/channel/UC9Q6J9Z9Q9Z9Q9Z9Q9Z9Q9Q' },
    { name: 'Facebook', icon: '/Facebook Icon.svg', link: 'https://www.facebook.com/techxetra/' },
    { name: 'Instagram', icon: '/Instagram Icon.svg', link: 'https://www.instagram.com/techxetra/' },
    // { name: 'X', icon: '/X Icon.svg', link: 'https://www.twitter.com/techxetra_tu' },
    { name: 'LinkedIn', icon: '/LinkedIn Icon.svg', link: 'https://www.linkedin.com/company/techxetra-tezpur-university/about/' },
  ];

  const mobimageRef = useRef<HTMLImageElement | null>(null);
  const deskimageRef = useRef<HTMLImageElement | null>(null);





  return (
    <div className="relative pt-20 overflow-x-hidden bg-gradient-to-b from-[#22071b] via-[#190341] to-[#1f021c] text-white py-10">
      {/* Background stars and shooting effects */}
      <StarsBackground className="absolute" starDensity={0.0002} />
      <ShootingStars />

      {/* Main content grid layout */}
      <div className="flex  justify-around max-sm:hidden">
        {/* Left section: TechXetra logo and character */}
        <div className="flex flex-col items-center">
          <img src="/TechXetraLogo1.png" alt="TechXetra Logo" className="rounded-full h-[150px] w-[150px]" /> {/* TechXetra Logo */}
          {/* <img  src="/finalmc.png" alt="Character Left" className="h-[500px] mt-6" />  */}
        </div>

        {/* Middle section: TechXetra wordmark */}
        <div className="flex justify-center my-auto">
          <img ref={deskimageRef} src="/techxetra-text.png" alt="TechXetra Wordmark" width={800} className="pt-10" /> {/* TechXetra Wordmark */}
        </div>

        {/* Right section: Dots and character */}
        <div className="flex flex-col items-center">
          <img src="Dots.svg" alt="Dots Image" className="h-[100px] w-[100px]" /> {/* Dots image */}
          {/* <img src="/finalmc.png" alt="Character Right" className="h-[500px] mt-6" />  */}
        </div>
      </div>

      <div className='sm:hidden'>
        <div className='flex items-center justify-around'>
          <div><img src="/TechXetraLogo1.png" alt="TechXetra Logo" className="rounded-full h-[150px] w-[150px]" /> {/* TechXetra Logo */}</div>
          <div className=''><img src="Dots.svg" alt="Dots Image" className="h-[100px] w-[100px]" /> {/* Dots image */}</div>
        </div>
        <div className='flex justify-center'>
        <img ref={mobimageRef} src="/TechXetraWordmark.png" alt="TechXetra Wordmark" className="h-[220px]" /> {/* TechXetra Wordmark */}
        </div>
      </div>

      {/* Socials and Address section */}
      <div className='flex flex-col md:flex-row justify-between items-center  md:px-8'>
  {/* Social Media Links */}
  <div className="flex flex-col items-center my-auto">
    <div className="text-base sm:text-lg md:text-xl font-bold text-center">FOLLOW US ON</div>
    <div className='flex items-center mt-4'>
      {/* Arrow Icon */}
      <img className='h-6 w-4 sm:h-8 sm:w-6 md:h-[60px] md:w-[50px] mr-4' src="/Arrows.svg" alt="Arrows" />
      {/* Social Media Icons */}
      <div className='flex mx-2 space-x-4'>
        {socials.map((social, index) => (
          <a key={index} href={social.link} className='relative' target="_blank" rel="noreferrer">
            <img className='h-6 w-6 sm:h-8 sm:w-8 md:h-[40px] md:w-[40px] hover:opacity-80' src={social.icon} alt={social.name} />
          </a>
        ))}
      </div>
    </div>
  </div>

  {/* University Address */}
  <div className="flex flex-col items-center mt-6 md:mt-0">
    <div className="text-base sm:text-lg md:text-xl font-bold text-center">Tezpur University</div>
    <div className="flex items-center mt-4">
      {/* Destination Mark Icon */}
      <img className='h-4 w-4 sm:h-6 sm:w-6 md:h-[30px] md:w-[30px] mr-4' src="/Destination Mark.svg" alt="Destination Mark" />
      {/* Address Details */}
      <div className="text-sm sm:text-base md:text-lg">
        <div>Napaam, Tezpur</div>
        <div>Assam 784028</div>
      </div>
    </div>
    {/* Bars image below the address */}
    <img className='mt-4 sm:mt-6' src="/bars.svg" alt="Bars" />
  </div>
</div>
<div className='sm:hidden border-gray-500 border-t-2 border-b-2 border-dotted rounded h-8 mt-10 mx-4'></div>
    </div>
  );
};

export default FooterBar;
