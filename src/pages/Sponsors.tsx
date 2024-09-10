
import React from 'react';

interface SponsorLogoProps {
  src: string;
  alt: string;
}

const Sponsors: React.FC = () => {
  const sponsorLogos: SponsorLogoProps[] = [
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 1' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 2' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 3' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 4' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 5' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 6' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 7' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 8' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 9' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 10' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 11' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 12' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 13' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 14' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 15' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 16' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 17' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 18' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 19' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 20' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 21' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 22' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 23' },
    { src: 'https://via.placeholder.com/150', alt: 'Sponsor 24' },
    // ... more logos
  ];

  return (
    <section
      className='flex flex-col items-center h-screen p-10'
      style={{
      }}
    >
      <h2 className='text-6xl text-center'>Sponsors</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-5'>
        {sponsorLogos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className='w-48 h-48 object-cover'
          />
        ))}
      </div>
    </section>
  );
};

export default Sponsors;
