import React, { useEffect, useState} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import { BackgroundGradient } from "../components/ui/background-gradeint";
import { toast } from 'react-toastify';
import axios from 'axios';

const Events: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
    const [events, setEvents] = useState<EventDetails[]>();

    const fetchEvents = async () => {
        try {
            const { data }: { data: EventDetailsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/all`);
            setEvents(data.events);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: false,
        draggable: true, 
        swipe: true,         
        touchMove: true,
        initialSlide:0,
        responsive: [
            {
                breakpoint: 1024, // At 1024px or below (tablet and smaller)
                settings: {
                    slidesToShow: 2,  // Show 2 slides on tablets
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768, // At 768px or below (mobile devices)
                settings: {
                    slidesToShow: 1,  // Show 1 slide on mobile
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const filteredData = selectedCategory === 'All' ? events : events?.filter((event) => event.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className='overflow-x-hidden relative '>
            <div className="w-full z-50 pt-14  mx-auto bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b]">
                <StarsBackground className='absolute '
                    starDensity={0.0002}
                />

                <ShootingStars />

                <h1 className="text-center md:text-left md:pl-16 font-semibold font-technoHideo text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">Events</h1>

                <div className='list-none ml-10 absolute z-10 font-manrope container flex flex-wrap text-white px-6'>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'All' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('All')}>All</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'TECHNICAL' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('TECHNICAL')}>Technical</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'GENERAL' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('GENERAL')}>General</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'SPORTS' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('SPORTS')}>Sports</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'ESPORTS' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('ESPORTS')}>E-Sports</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'CULTURAL' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('CULTURAL')}>Cultural</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'MISCELLANEOUS' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('MISCELLANEOUS')}>Miscellaneous</li>
                </div>



                <div className=' pt-20 '>
                    <Slider {...settings} className='border-'>
                        {filteredData?.map((data, index) => (
                            <div
                                key={index}
                                className='px-4 py-16'
                                onMouseEnter={() => {
                                    setHoveredEventId(data._id);
                                }}
                                onMouseLeave={() => setHoveredEventId(null)}
                            >
                                <div className=''>
                                    <BackgroundGradient className={`flex relative  flex-col w-104  bg-black rounded-3xl min-h-[500px] transform  transition-transform duration-300 `}>
                                        <div className='flex justify-between pt-8 '>
                                            <h1 className={`bg-gradient-radial from-[#ffffff] to-[#da9276] bg-clip-text text-transparent font-manrope ${hoveredEventId === data._id ? 'text-white' : ''} pl-14`}>{data.participation === "HYBRID" ? "SOLO/TEAM" : data.participation}</h1>
                                            <img src="./arrow.svg" width={230} alt="" className='mr-9' />
                                        </div>
                                        <div className='flex pl-8 flex-col'>
                                            <h1 className='text-white font-manrope  w-fit ml-5 pl-4 pr-4 mt-3 mb-3 rounded-[10px] bg-gradient-radial from-[#cb0044] to-[#e7551b] '>{index + 1}</h1>
                                            <div className='bg-[#2b2b2b] rounded-[25px] ml-4 mb-7 h-fit w-fit pr-5 pl-5  flex items-center '>
                                                <h1 className={`font-bold font-manrope text-[2rem]  bg-gradient-radial from-[#EA1B60] to-[#FD7844] bg-clip-text text-transparent ${hoveredEventId === data._id ? 'bg-gradient-radial from-[#EA1B60] to-[#FD7844]' : ''} `}>{data.title}</h1>
                                            </div>
                                        </div>
                                        <p className={`text-slate-400 ${hoveredEventId === data._id ? 'text-white' : ''} font-manrope text-xl pl-14 pr-12 text-left`}>
                                            {data.smallDescription}
                                        </p>
                                        <div className='flex justify-center mt-auto'>
                                            <img src="./line.svg" width={170} alt="" className='w-fit  pt-4 pl-8 pr-8' />
                                        </div>
                                        <p className='text-[#808080] font-manrope w-fit pl-8 pt-4 pb-4'>Know More</p>


                                        {hoveredEventId === data._id && (
                                            <div className='absolute inset-0 transition-opacity duration-[500ms] opacity-0 hover:opacity-35'>
                                                <img src={data.backgroundImage} alt={data.title} className='object-cover w-full h-full rounded-3xl' />
                                            </div>
                                        )}
                                    </BackgroundGradient>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Events;
