import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/avatar";
import { ShootingStars } from "../../components/ShootingStars";
import { StarsBackground } from '../../components/StarBackground';

interface Brand {
  imageSrc: string;
  lightImageSrc: string;
  altText: string;
  link: string;
  heading: string;
  description: string;
  footertext: string;
}

const brandsData: Brand[] = [
  {
    imageSrc: "../public/Asus_Logo.png",
    lightImageSrc: "../public/Asus_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Asus",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Ktm_Logo.png",
    lightImageSrc: "../public/Ktm_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "KTM",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Gnrc_Logo.png",
    lightImageSrc: "../public/Gnrc_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "GNRC",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/IndianOil_Logo.png",
    lightImageSrc: "../public/IndianOil_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Indian Oil",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Lic_Logo.png",
    lightImageSrc: "../public/Lic_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "LIC",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Pnb_Logo.png",
    lightImageSrc: "../public/Pnb_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "PNB",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Sbi_Logo.png",
    lightImageSrc: "../public/Sbi_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "SBI",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Sbi_Logo.png",
    lightImageSrc: "../public/Sbi_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "SBI",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  {
    imageSrc: "../public/Tata_Logo.png",
    lightImageSrc: "../public/Tata_Logo.png",
    altText: "graygrids",
    link: "#",
    heading: "Tata",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim dolores officia ipsum optio iste nemo quasi, adipisci sequi facere molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!",
    footertext: "Visit Website",
  },
  
  // More logos can be added
];

const Sponsors: React.FC = () => {
  // Function to split brandsData into levels for pyramid
  const createPyramidLevels = (data: Brand[]) => {
    const levels: Brand[][] = [];
    let level = 1;
    let index = 0;

    while (index < data.length) {
      if (level <= 4) {
        levels.push(data.slice(index, index + level));
        index += level;
        level++;
      } else {
        // For rows after the 4th row, limited the number of items to 4 per row
        levels.push(data.slice(index, index + 4));
        index += 4;
      }
    }

    return levels;
  };

  const pyramidLevels = createPyramidLevels(brandsData);

  return (
    <section className="bg-gradient-to-b from-[#1f021c] to-[#1f021c] relative overflow-x-hidden">
      <ShootingStars />
      <div className="container mx-auto">
        {/* Sponsor heading */}
        <h2 className="text-5xl font-bold text-center mb-8 font-manrope text-red-400 my-28">
          Sponsors
        </h2>
        {/* Intro paragraph */}
        <p className="text-red-400 px-10 text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, enim
          dolores officia ipsum optio iste nemo quasi, adipisci sequi facere
          molestias ipsa dicta quaerat, amet sint! Quidem dolor debitis nisi!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto sunt
          temporibus totam deleniti sequi impedit voluptatem atque ducimus
          reprehenderit magni harum deserunt error necessitatibus tenetur,
          soluta voluptate aspernatur dolor quis!
        </p>
        {/* Pyramid structure */}
        <div className="flex flex-col justify-items-stretch space-y-3">
          {pyramidLevels.map((level, levelIndex) => (
            <div
            key={levelIndex}
            className="grid gap-10"
            style={{
              gridTemplateColumns: `repeat(${levelIndex < 4 ? level.length : 4}, minmax(100px, 1fr))`,
              maxWidth: "100%", // Adjust this as needed
            }}
          >
              {level.map((brand, i) => (
                <HoverCard key={i} brand={brand} index={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <StarsBackground />
    </section>
  );
};




const HoverCard: React.FC<{ brand: Brand; index: number }> = ({ brand, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  

  return (
    <div
      className="relative mx-auto my-6 flex w-[200px] items-center justify-center py-6 2xl:w-[220px] transition-transform duration-500 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ zIndex: isHovered ? 1000 : "auto" }}  
    >
      <a href={brand.link}>
        <img
          src={brand.imageSrc}
          alt={brand.altText}
          className="h-28 w-full dark:hidden"
        />
        <img
          src={brand.lightImageSrc}
          alt={brand.altText}
          className="hidden h-28 w-full dark:block"
        />
      </a>
      {isHovered && (
        <div
          className={`
            absolute top-full mt-2 w-80 p-4 bg-[rgba(70,0,50,0.95)] shadow-lg rounded-lg z-10 hover-card-content
            ${isHovered ? "animate-fadeIn" : "animate-fadeOut"}
          `}
        >
          <div className="flex justify-between space-x-4">
            {/* logo may look repetative if added to again the pop up box, so kept it optional with the below code */}
            {/* <Avatar>
              <AvatarImage src={brand.imageSrc} className="h-full w-full object-cover" />
              <AvatarFallback>Logo</AvatarFallback>
            </Avatar> */}
            <div className="space-y-2">
              <h4 className="text-md font-bold text-white text-center">{brand.heading}</h4>
              <p className="text-sm text-red-400">
                {brand.description}
              </p>
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground text-white">
                  {brand.footertext}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsors;
