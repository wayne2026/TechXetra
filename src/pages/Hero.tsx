// import { ShootingStars } from '../../components/shootingStars';
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { StarsBackground } from "../../components/StarBackground";
import {ShootingStars} from '../../components/shootingStars'
import RotatingPlanet from "../../components/Planet"
import gsap from "gsap";
import { useRef } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const logo = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const starsBg = useRef<HTMLDivElement>(null);
  // const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    gsap.from(logo.current, {
      y: -5,
      opacity: 0,
      delay: 0.9,
      duration: 0.8,
    });
  }, [logo]);

  useGSAP(() => {
    gsap.from(btnRef.current, {
      y: -5,
      opacity: 0,
      delay: 0.9,
      duration: 0.8,
    });
  }, [btnRef]);

  useGSAP(() => {
    gsap.from(starsBg.current, {
        opacity: 0,
        delay: 0.6,
        duration: 1
    })
  }, [starsBg]);

  // useGSAP(() => {
  //   gsap.from('#words-animation h1 span', {
  //     x: -10,
  //     delay: 0.3,
  //     duration: 0.5,
  //     opacity: 0,
  //     stagger: 0.15,
  //   })
  // }, [letterRefs]);

  return (
    <div className="flex justify-center items-center ">
      <div ref={starsBg} className="w-full  h-[150vh] overflow-hidden flex flex-col items-center">
        <StarsBackground
          starDensity={0.0004}
          allStarsTwinkle
          twinkleProbability={1}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute"
        />
        <ShootingStars/>
        <div className="w-full h-[5rem] flex justify-between  text-white">
          <div className="pl-20 mt-12">
            <img src="./final text-Photoroom.png" width={200} alt="" />
          </div>

          <div className="pr-14 pt-12">
            <button
              ref={btnRef}
              type="button"
              onClick={() => {
                navigate("/login");
              }}
            >
              <h1 className="font-originTech text-4xl pt-9 pr-10">Login</h1>
            </button>
          </div>
        </div>
        <div id="words-animation" className="mt-44 mb-14 text-[3.4rem] font-autoTechno">
          <h1 className="bg-gradient-to-r from-[#5162ce] via-[#E12198]/[77%] to-[#F3AC80] bg-clip-text text-transparent text-center leading-[100px]">
          {['R','E','V','I','V','I','N','G'].map((text, index) => (
            <span className="" key={index}>
              {text}
            </span>
          ))}
          {['T','H','E'].map((text, index) => (
            <span className={`${text === 'T' && 'pl-6'} ${text === 'E' && 'pr-6'}`} key={index}>
              {text}
            </span>
          ))}
          {['L','E','G','A','C','Y'].map((text, index) => (
            <span className="" key={index}>
              {text}
            </span>
          ))}
           <br /><span className="text-[2.7rem]">INSPIRING INNOVATION</span> </h1>
        </div>
        <RotatingPlanet/>
      </div>
    </div>
  );
};

export default Hero;
// bg-gradient-to-t from-[#84165e] via-[#ad9481]  to-[#A98164] bg-clip-text text-transparent