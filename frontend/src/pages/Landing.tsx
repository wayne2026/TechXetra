import About from "./About";
import Events from "./Events";
import FooterBar from "./Footer";
import Hero from "./Hero";
import Sponsors from "./Sponsors";

const Landing = () => {
  return (
    <div className="w-full min-h-full">
      <div className="w-full max-h-full bg-gradient-to-b from-[#000000] via-[#14041d] to-[#11021a]">
        <Hero />
      </div>
      <About />
      <Sponsors />
      <Events />
      <FooterBar />
    </div>
  );
};

export default Landing;
