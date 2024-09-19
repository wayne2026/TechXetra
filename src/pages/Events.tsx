import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';

interface EventData {
    participation: string;
    id: string;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
}

const Events: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    const data: EventData[] = [
        {
            participation: 'solo',
            id: '01',
            category: 'tech',
            title: 'HACKATHON',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra,arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './hackathon.jpeg'
        },
        {
            participation: 'team',
            id: '02',
            category: 'games',
            title: 'FUTSAL',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './futsal.jpeg'
        },
        {
            participation: 'solo',
            id: '03',
            category: 'tech',
            title: 'CODE WAR',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './code war.jpeg'
        },
        {
            participation: 'solo',
            id: '04',
            category: 'workshops',
            title: 'TEDTALK',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './tedtalk.jpeg'
        },
        {
            participation: 'team',
            id: '05',
            category: 'tech',
            title: 'ROBO WAR',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './robo war.jpeg'
        },
        {
            participation: 'team',
            id: '06',
            category: 'games',
            title: 'TREASURE HUNT',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './treasure hunt.jpeg'
        },
        {
            participation: 'team',
            id: '07',
            category: 'games',
            title: 'BASKETBALL',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './basket ball.jpeg'
        },
        {
            participation: 'solo',
            id: '08',
            category: 'games',
            title: 'QUIZ',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './quiz.png'
        },
        {
            participation: 'solo',
            id: '09',
            category: 'games',
            title: 'E-SPORTS',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './e sports.jpeg'
        },
        {
            participation: 'solo',
            id: '10',
            category: '',
            title: 'PHOTOGRAPHY',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './photography.jpeg'
        },
        {
            participation: 'solo',
            id: '11',
            category: 'games',
            title: 'BADMINTON',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './badminton.jpeg'
        },
        {
            participation: 'solo',
            id: '12',
            category: 'workshops',
            title: 'AI/ML',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './ai ml.jpeg'
        },
        {
            participation: 'team',
            id: '13',
            category: 'workshops',
            title: 'ANDROID',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus, neque vel tempus viverra, arcu ipsum egestas nisi, a convallis neque tellus vel velit.',
            imageUrl: './android.jpeg'
        }
    ];

    const filteredData = selectedCategory === 'All' ? data : data.filter((event) => event.category === selectedCategory.toLowerCase());

    return (
        <div className='overflow-x-hidden '>
            {/* <ShootingStars/> */}
            <div className="w-full h-screen  mx-auto bg-gradient-to-b from-[#271938] via-[#410E34] to-[#44154C]">
            
                <h1 className="font-semibold font-manrope text-7xl w-fit h-fit pt-6 pl-9 ml-10 text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">Events</h1>
                
                <div className='list-none ml-10 font-manrope container flex text-white pl-9'>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'All' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('All')}>All</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'workshops' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('workshops')}>Workshops</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'games' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('games')}>Games</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'tech' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('tech')}>Tech</li>
                </div>
                
                
                <div className='p-8 m-8'>
                    <Slider {...settings}>
                        {filteredData.map((d) => (
                            <div
                                key={d.id}
                                className='p-5'
                                onMouseEnter={() => {
                                    console.log(d.id);  // Log hover ID
                                    setHoveredEventId(d.id);
                                }}
                                onMouseLeave={() => setHoveredEventId(null)}
                            >
                                <div className='flex flex-col w-96 bg-black rounded-3xl min-h-[500px] transform hover:scale-105 transition-transform duration-300 relative'>
                                    <div className='flex justify-between pt-8'>
                                        <h1 className='bg-gradient-radial from-[#ffffff] to-[#da9276] bg-clip-text text-transparent font-manrope  pl-14'>{d.participation}</h1>
                                        <img src="./arrow.svg" width={230} alt="" className='mr-9' />
                                    </div>
                                    <div className='flex pl-8 flex-col'>
                                        <h1 className='text-white font-manrope  w-fit ml-5 pl-4 pr-4 mt-3 mb-3 rounded-[10px] bg-gradient-radial from-[#cb0044] to-[#e7551b] '>{d.id}</h1>
                                        <div className='bg-[#2b2b2b] rounded-[25px] ml-4 mb-7 h-fit w-fit pr-5 pl-5  flex items-center '>
                                            <h1 className='font-bold font-manrope text-[2rem]  bg-gradient-radial from-[#EA1B60] to-[#FD7844] bg-clip-text text-transparent '>{d.title}</h1>
                                        </div>
                                    </div>
                                    <p className='text-slate-400 font-manrope text-xl pl-14 pr-12 text-left'>
                                        {d.description}
                                    </p>
                                    <div className='flex justify-center mt-auto'>
                                        <img src="./line.svg" width={170} alt="" className='w-fit  pt-4 pl-8 pr-8' />
                                    </div>
                                    <p className='text-[#808080] font-manrope w-fit pl-8 pt-4 pb-4'>Know More</p>

                                    {/* Check if this block shows up */}
                                    {hoveredEventId === d.id && (
                                        <div className='absolute inset-0  opacity-40 transition-opacity duration-300'>
                                            <img src={d.imageUrl} alt={d.title} className='object-cover w-full h-full rounded-3xl' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            {/* <StarsBackground/> */}
           
        </div>
    );
}

export default Events;
