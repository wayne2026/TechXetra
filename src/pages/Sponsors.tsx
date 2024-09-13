import React from "react";
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/shootingStars';

interface Brand {
  imageSrc: string;
  lightImageSrc: string;
  altText: string;
  link: string;
}

const brandsData: Brand[] = [
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  {
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },{
    imageSrc: "https://placehold.co/300x300",
    lightImageSrc:
      "https://placehold.co/300x300",
    altText: "graygrids",
    link: "#",
  },
  // ... other brands
];

const Sponsors: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-[#1f021c]  to-[#1f021c] relative ">
      <ShootingStars />
      <div className="container mx-auto">
      <h2 className="text-5xl font-bold text-center mb-8 font-manrope text-red-400">Sponsors</h2> 
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-center">
              {brandsData.map((brand, i) => (
                <SingleImage key={i} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <StarsBackground />
    </section>
  );
};

const SingleImage: React.FC<{ brand: Brand }> = ({ brand }) => {
  const { link, imageSrc, lightImageSrc, altText } = brand;
  return (
    <a
      href={link}
      className="mx-4 flex w-[150px] items-center justify-center py-5 2xl:w-[180px]"
    >
      <img src={imageSrc} alt={altText} className="h-10 w-full dark:hidden" />
      <img
        src={lightImageSrc}
        alt={altText}
        className="hidden h-10 w-full dark:block"
      />
    </a>
  );
};

export default Sponsors;