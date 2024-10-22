import { useGSAP } from "@gsap/react";
import { StarsBackground } from "../../components/StarBackground";
import { ShootingStars } from '../../components/ShootingStars';
import RotatingPlanet from "../../components/Planet";
import gsap from "gsap";
import { useRef } from "react";
import Navbar from "../components/Navbar";

const Hero: React.FC = () => {
  const starsBg = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(starsBg.current, {
      opacity: 0,
      delay: 0.6,
      duration: 1
    });
  }, [starsBg]);

  return (
    <div className="flex justify-center items-center">
      <div ref={starsBg} className="w-full sm:h-[150vh] overflow-hidden flex flex-col items-center">
        <StarsBackground
          starDensity={0.0004}
          allStarsTwinkle
          twinkleProbability={1}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute h-[150vh]"
        />
        <ShootingStars />
        <Navbar />
        <div id="words-animation" className="max-sm:mt-3 mt-44 mb-14 sm:text-[3.4rem] font-autoTechno">
          <h1 className="bg-gradient-to-r from-[#5162ce] via-[#E12198]/[77%] to-[#F3AC80] bg-clip-text text-transparent text-center max-sm:leading-[70px] sm:leading-[100px]">
            <span className="max-sm:text-[1.2rem] ">REVIVING</span> <br className="sm:hidden" /> <span className="max-sm:text-[1.6rem]">THE <br className="hidden" />LEGACY</span>
            <br /><span className="sm:text-[2.7rem] max-sm:text-4xl sm:mr-6">INSPIRING</span><br className="sm:hidden" /><span className="max-sm:text-[2.3rem] max-sm:mx-auto sm:text-[2.7rem]">INNOVATION</span>
          </h1>
        </div>
        <RotatingPlanet />
      </div>
    </div>
  );
};

export default Hero;
