import {useEffect, useRef} from 'react';
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import gsap from 'gsap'
const FooterBar: React.FC = () => {
  const Socials = [
    { name: "Instagram" },
    { name: "Facebook" },
    { name: "LinkedIn" },
    { name: "YouTube" },
    { name: "X" }
  ];
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
    <div className="grid grid-cols-2 text-white py-10 bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b] relative overflow-x-hidden">
      <StarsBackground className='absolute '
                starDensity={0.0002} />
            <ShootingStars />
      <div>
        <div className="h-fit w-fit mx-auto my-5 ">
          <img ref={imageRef} src="/finalmc.png" alt="" width={400} />
        </div>
      </div>

      <div className='my-auto'>
        {/* <div className="h-[150px] w-[350px] mx-auto my-16 bg-blue-600">
        </div> */}
        <div className='flex justify-center'>
        <img src="./final text-Photoroom.png" className='w-[400px]' alt="" />
        </div>


        <div className="text-center my-5">
          <div className="mb-2">Follow us on</div>
          <div className="flex justify-center">
            {Socials.map((social, index) => (
              <div
                key={index}
                className="bg-yellow-400 h-10 w-10 mx-2 my-2 rounded-2xl flex items-center justify-center"
              >
                <span className="text-sm text-black">{social.name[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center my-4">
          Designed and Developed by{' '}
          <span className="underline">TechXetra WebTeam</span>
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
