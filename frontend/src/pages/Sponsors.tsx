import { ShootingStars } from "../../components/ShootingStars";
import { StarsBackground } from '../../components/StarBackground';

interface Brand {
  imageSrc: string;
  title: string;  
}

const baseUrl = "https://api.techxetra.in";

const brandsData: Brand[] = [
  { imageSrc: `${baseUrl}/assets/oilindia.png`, title: "Title Sponsor" },
  { imageSrc: `${baseUrl}/assets/sbi.webp`, title: "Platinum Sponsor" },
  { imageSrc: `${baseUrl}/assets/krafton.png`, title: "Mobile Gaming Partner" },
  { imageSrc: `${baseUrl}/assets/mylearningcurve.jpeg`, title: "Career Guidance Partner" },
  { imageSrc: `${baseUrl}/assets/ashima.jpg`, title: "Residency Partner" },
  { imageSrc: `${baseUrl}/assets/unstop.png`, title: "Platform Partner" },
  { imageSrc: `${baseUrl}/assets/linkedin.jpeg`, title: "Networking Partner" },
  { imageSrc: `${baseUrl}/assets/eastmojo.png`, title: "Digital Media Partner" },
  { imageSrc: `${baseUrl}/assets/jiosavan.png`, title: "Official Music Partner" },
  { imageSrc: `${baseUrl}/assets/lipy.png`, title: "Chatbot Partner" },
  { imageSrc: `${baseUrl}/assets/Beytech.png`, title: "Shuttle Partner" },
  { imageSrc: `${baseUrl}/assets/nenews.jpeg`, title: "Television Media Partner" },
  { imageSrc: `${baseUrl}/assets/krc.jpeg`, title: "Hospitality Partner" },
  { imageSrc: `${baseUrl}/assets/dynaroof.png`, title: "Roofing Partner" },
  { imageSrc: `${baseUrl}/assets/tezpurbuzz.png`, title: "Digital Media Partner" },
  { imageSrc: `${baseUrl}/assets/CanaraBank.png`, title: "Banking Partner" },
  { imageSrc: `${baseUrl}/assets/dynasolar.png`, title: "Energy Partner" },
  { imageSrc: `${baseUrl}/assets/easemytrip.png`, title: "Official Travel Partner" },
  { imageSrc: `${baseUrl}/assets/Swaglok.png`, title: "Merchandise Partner" },
  { imageSrc: `${baseUrl}/assets/xt.png`, title: "Hackathon Event Sponsor" },
  { imageSrc: `${baseUrl}/assets/cubelelo.png`, title: "Rubiks Cube Event Sponsor" },
  { imageSrc: `${baseUrl}/assets/cogneo.png`, title: "Code Class Event Sponsor" },
  { imageSrc: `${baseUrl}/assets/SERVE14.png`, title: "Food Delivery Partner" },
  { imageSrc: `${baseUrl}/assets/bento.webp`, title: "Cakery Partner" },
  { imageSrc: `${baseUrl}/assets/ITC.jpg`, title: "Gifting Partner" },
  { imageSrc: `${baseUrl}/assets/edona.jpeg`, title: "Beauty Partner" }
];

const Sponsors: React.FC = () => {
  const firstBrand = brandsData[0];
  const secondBrand = brandsData[1];
  const remainingBrands = brandsData.slice(2);

  return (
    <section className="bg-gradient-to-b from-[#1f021c] to-[#1f021c] relative overflow-x-hidden">
      <StarsBackground className="absolute"/>
      <ShootingStars />

      <div className="container mx-auto">
        <h2 className="text-4xl md:text-7xl text-center mb-8 font-technoHideo font-semibold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] my-28">
          Sponsors
        </h2>

        <div className="flex justify-center mt-10">
          <BrandCard brand={firstBrand} isFirst />
        </div>

        <div className="flex justify-center mt-10">
          <BrandCard brand={secondBrand} isSecond />
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

const BrandCard: React.FC<{ brand: Brand; isFirst?: boolean; isSecond?: boolean }> = ({ brand, isFirst = false, isSecond = false }) => {
  const sizeClass = isFirst ? "w-[150px] h-24" : isSecond ? "w-[130px] h-20" : "w-[100px] h-16";

  return (
    <div className={`relative flex flex-col items-center py-6 gap-2 ${sizeClass}`}>
      <h3 className="text-center font-bold text-white text-sm">{brand.title}</h3>
      <img
        src={brand.imageSrc}
        alt={`${brand.title} logo`}
        className={`w-full rounded-lg`}
      />
    </div>
  );
};

export default Sponsors;
