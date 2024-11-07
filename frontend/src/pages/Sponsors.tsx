import { ShootingStars } from "../../components/ShootingStars";
import { StarsBackground } from '../../components/StarBackground';

interface Brand {
  imageSrc: string;
}

const baseUrl = "https://api.techxetra.in";

const brandsData: Brand[] = [
  {
    imageSrc: `${baseUrl}/assets/oilindia.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/krafton.webp`,
  },
  {
    imageSrc: `${baseUrl}/assets/easemytrip.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/mylearningcurve.jpeg`,
  },
  {
    imageSrc: `${baseUrl}/assets/ashima.jpg`,
  },
  {
    imageSrc: `${baseUrl}/assets/unstop.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/linkedin.jpeg`,
  },
  {
    imageSrc: `${baseUrl}/assets/eastmojo.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/jiosavan.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/lipy.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/Beytech.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/nenews.jpeg`,
  },
  {
    imageSrc: `${baseUrl}/assets/krc.jpeg`,
  },
  {
    imageSrc: `${baseUrl}/assets/dynaroof.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/tezpurbuzz.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/CanaraBank.png`,
  },
  {
    imageSrc: `${baseUrl}/assets/dynasolar.png`,
  }

];

const Sponsors: React.FC = () => {
  const firstBrand = brandsData[0];
  const remainingBrands = brandsData.slice(1);

  return (
    <section className="bg-gradient-to-b from-[#1f021c] to-[#1f021c] relative overflow-x-hidden">
      <StarsBackground className="absolute"/>
      <ShootingStars />

      {/* <h1 className="text-center md:text-left md:pl-20 font-semibold font-technoHideo text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">
        Sponsors
      </h1> */}

      <div className="container mx-auto">
        <h2 className="text-4xl md:text-7xl text-center mb-8 font-technoHideo font-semibold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] my-28">
          Sponsors
        </h2>
        
        <h1 className="text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] font-bold text-3xl text-center mt-4">Title Sponsor</h1>

        <div className="flex justify-center mt-10">
          <BrandCard brand={firstBrand} isFirst />
        </div>

        <div className="flex flex-wrap justify-center space-x-6 mt-10">
          {remainingBrands.map((brand, index) => (
            <div key={index} className="flex w-[200px] justify-center mb-6">
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandCard: React.FC<{ brand: Brand; isFirst?: boolean }> = ({ brand, isFirst = false }) => {
  return (
    <div
      className={`relative flex items-center justify-center py-6 ${
        isFirst ? "w-[250px]" : "w-[200px]"
      }`}
    >
      <div>
        <img
          src={brand.imageSrc}
          alt="sponsor-img"
          className={`h-${isFirst ? "24" : "16"} w-full rounded-lg dark:hidden`}
        />
      </div>
    </div>
  );
};

export default Sponsors;