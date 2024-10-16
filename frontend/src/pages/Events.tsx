import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarsBackground } from '../../components/StarBackground';
import { ShootingStars } from '../../components/ShootingStars';
import { BackgroundGradient } from "../components/ui/background-gradeint";


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

    const data: EventData[] = [
        {
            participation: 'solo',
            id: '1',
            category: '',
            title: 'Book Fair',
            description: 'Immerse yourself in a world of knowledge at the Book Fair, featuring a wide range of books for all ages and interests – a haven for book lovers and casual readers alike',
            imageUrl: './Bookfair.png',
        },
        {
            participation: 'team',
            id: '2',
            category: 'Sports Events',
            title: 'Triple Heat',
            description: 'Put your basketball skills to the test in this 5v5 basketball competition. Gather your team, showcase your talent, and shoot for victory in this exciting sporting event.',
            imageUrl: './Basketball.png'
        },
        {
            participation: 'team',
            id: '3',
            category: 'General Events',
            title: 'Pitch Presentation',
            description: 'Pitch your innovative ideas in this competition! Whether its a startup, tech innovation, or creative project, focus on communicating the value, feasibility, and market potential of your concept.',
            imageUrl: './BusinessPitch.png'
        },
        {
            participation: 'solo',
            id: '4',
            category: 'Technical Events',
            title: 'Code Masters',
            description: 'Challenge your programming skills in this competitive coding contest, whether you are a beginner or an expert. Test your proficiency in algorithms and problem-solving with real-time coding challenges.',
            imageUrl: './CodeMasters.png'
        },
        {
            participation: 'solo',
            id: '5',
            category: 'Cultural Events',
            title: 'Coral Strings',
            description: 'Another eye-catching event for TECHXETRA will be acoustic singing (singing accompanied by minimal instrumentation), which emphasizes on the singer’s ability to convey emotion and artistry through pure, unprocessed sound.',
            imageUrl: './CoralStrings.png'
        },
        {
            participation: 'solo',
            id: '6',
            category: 'General Events',
            title: 'Wrangle',
            description: 'Harness the power of words in this dynamic debate competition, with thought-provoking discussions challenging opposing viewpoints on a range of topics.',
            imageUrl: './Debate.png'
        },
        {
            participation: 'solo/team',
            id: '7',
            category: 'Technical Events',
            title: 'Robophronesis',
            description: 'Participants will engage in two robotics events, testing their ability to design and program robots to complete specific tasks. A great event for those passionate about robotics and automation',
            imageUrl: './Robophronesis.png'
        },
        {
            participation: 'solo/team',
            id: '8',
            category: 'E-Sports',
            title: 'Valorant',
            description: 'Show your gaming prowess in the Valorant e-sports competition. Pit your tactics and marksmanship against others to attain victory.',
            imageUrl: './valorant.png'
        },
        {
            participation: 'solo',
            id: '9',
            category: 'E-Sports',
            title: 'Fifa',
            description: 'Compete in virtual soccer battles in the FIFA gaming tournament. Test your strategy and teamwork as you aim for the championship title in this e-sport event',
            imageUrl: './FIFA.png'
        },
        {
            participation: 'teaam',
            id: '10',
            category: 'Miscellaneous',
            title: 'Food Packaging',
            description: 'Design sustainable, practical, and attractive food packaging. Focus on material selection, environmental impact, and user convenience, while meeting industry standards',
            imageUrl: './Food Packaging.png'
        },
        {
            participation: 'team',
            id: '11',
            category: 'General Events',
            title: 'Questify',
            description: 'An exciting adventure where teams will have to work together to solve puzzles, decode messages, and find hidden treasures on campus. This event combines teamwork and problem-solving skills.',
            imageUrl: './treasure hunt.png'
        },
        {
            participation: 'solo/team',
            id: '12',
            category: 'Technical Events',
            title: 'PosterXetra',
            description: 'Create informative and visually appealing posters on technical topics. Combine creativity with technical know-how to communicate complex ideas..',
            imageUrl: './Technical Poster Making.png'
        },
        {
            participation: 'solo/team',
            id: '13',
            category: 'General Events',
            title: 'TechXibition',
            description: 'This exhibition showcases innovative projects from at both the school and university level students.Participants will present their ideas, offering innovation in various fields like robotics, software,engineering, and more.',
            imageUrl: './techxibition.png'
        },
        {
            participation: 'solo/team',
            id: '14',
            category: 'Miscellaneous',
            title: 'Frontend frenzy',
            description: 'Designers and developers will go head-to-head to create jawdropping interfaces that blend beauty with brains.',
            imageUrl: './Front End Frenzy (1).png'
        },
        {
            participation: 'solo/team',
            id: '15',
            category: 'Sports Events',
            title: 'Shuttle Bash',
            description: 'Compete in this fast-paced badminton tournament. Whether you are a beginner or a seasoned player, showcase your badminton skills and aim for the win',
            imageUrl: './Shuttle bash 2.png'
        },
        {
            participation: 'solo',
            id: '16',
            category: 'General Events',
            title: 'Rubic\'s cube',
            description: 'Test your Rubik’s cube-solving skills as you compete to solve a cube in the fastest time.',
            imageUrl: './Rubics Cube (2).png'
        },
        {
            participation: 'solo/team',
            id: '17',
            category: 'Technical Events',
            title: 'Kinematic Model',
            description: 'Use your knowledge of mechanics to build models of kinematic pairs that blow minds.',
            imageUrl: './Kinematic Model.png'
        },
        {
            participation: 'team',
            id: '18',
            category: 'Cultural Events',
            title: 'Śāstrīya Nṛtya Parva',
            description: 'A mesmerizing classical dance performance showcasing the rich cultural heritage of India. This event will feature dancers performing intricate movements to classical tunes in traditional attire..',
            imageUrl: './Sastriya Nritya.png'
        },
        {
            participation: 'solo',
            id: '19',
            category: 'Technical Events',
            title: 'CAD Xetra',
            description: 'Unleash your creativity in this AutoCAD competition where participants will design architectural or engineering projects using AutoCAD software. Accuracy, innovation, and design skills will be the focus..',
            imageUrl: './CAD-xetra.png'
        },
        {
            participation: 'solo/team',
            id: '20',
            category: 'Technical Events',
            title: 'Constrolix',
            description: 'Compete in designing and constructing model bridges that are strong, efficient, and structurally sound..',
            imageUrl: './Constrolix.png'
        },
        {
            participation: 'team',
            id: '21',
            category: 'General Events',
            title: 'Full Swing',
            description: 'Full Swing is an energetic school quiz that showcases students\' knowledge across a wide range of subjects. It offers a fun, educational competition that emphasizes learning and engagement.',
            imageUrl: './Full swing.jpg'
        },
        {
            participation: 'team',
            id: '22',
            category: 'General Events',
            title: 'Full Force',
            description: 'Full Force is the ultimate tech quiz at TechXetra, where participants face challenging questions on cutting-edge technology. It\'s a fast-paced competition that highlights tech expertise and strategic thinking',
            imageUrl: './Full force.jpg'
        },
        {
            participation: 'team',
            id: '23',
            category: 'General Events',
            title: 'Full Throttle',
            description: 'Full Throttle is an exciting general knowledge quiz covering topics from history to entertainment. With diverse questions and a fast pace, it\'s perfect for trivia enthusiasts.',
            imageUrl: './Full Throttle.jpg'
        },
        {
            participation: 'team',
            id: '24',
            category: 'General Events',
            title: 'Full Sprint',
            description: 'Full Sprint is a high-energy sports quiz testing knowledge of legendary games, iconic athletes, and memorable moments. It challenges participants to showcase their sports trivia skills in a competitive, engaging environment.',
            imageUrl: './Full sprint.jpg'
        },
        {
            participation: 'team',
            id: '25',
            category: 'General Events',
            title: 'Full Screen',
            description: 'Full Screen is a quiz that immerses participants in movies, entertainment, literature, and art. It celebrates creative and cultural topics with engaging questions, offering an exciting intellectual challenge.',
            imageUrl: './Full screen.jpg'
        },
        {
            participation: 'team',
            id: '26',
            category: 'General Events',
            title: 'Militaria',
            description: 'Get an up-close view of military equipment and innovations. Interact with army personnel and learn about defense technologies.',
            imageUrl: './Army exhibition.jpg'
        },
        {
            participation: 'solo',
            id: '27',
            category: 'Technical Events',
            title: 'Circuitrix',
            description: 'Design and build circuits to solve real-world challenges. A hands-on event to test your electronics and problem-solving skills.',
            imageUrl: './Circuitrix.jpg'
        },
        {
            participation: 'team',
            id: '28',
            category: 'Technical Events',
            title: 'Hackxetra',
            description: 'Participate in a thrilling hack-a-thon where you and your team will brainstorm under pressure to solve challenges.',
            imageUrl: './Hackxetra.jpg'
        },
        {
            participation: 'team',
            id: '29',
            category: 'tech',
            title: 'Technical Events',
            description: 'A coding competition aimed at beginners, especially younger students, in which participants will use Scratch to create simple games or animations - emphasizing creativity and coding fundamentals',
            imageUrl: './Scratch.jpg'
        },
        {
            participation: 'team',
            id: '30',
            category: 'Technical Events',
            title: 'Ideathon',
            description: 'Pitch your groundbreaking ideas in this ideathon. Participants will brainstorm and present innovative solutions to pressing problems, with a focus on creativity, feasibility, and impact.',
            imageUrl: './Ideathon.jpg'
        },
        {
            participation: 'team',
            id: '31',
            category: 'E-Sports',
            title: 'BGMI',
            description: 'Get ready for intense action in the BGMI (Battlegrounds Mobile India) gaming tournament where teams will battle it out to be the last one standing.',
            imageUrl: './BGMI.jpg'
        },
        {
            participation: 'solo',
            id: '32',
            category: 'General Events',
            title: 'Invited Talk',
            description: 'Join experts from various fields as they share their insights and experiences on various relevant topics – an opportunity to gain valuable knowledge from leaders and professionals.',
            imageUrl: './Invited Talk.png'
        },
        {
            participation: 'solo',
            id: '33',
            category: 'Miscellaneous',
            title: 'KeyBlitz',
            description: 'Speed and accuracy are put to the test in this typing competition. Participants will compete to see who can type the fastest without errors.',
            imageUrl: './Typing Competiition.jpg'
        },
        {
            participation: 'team',
            id: '34',
            category: 'Technical Events',
            title: 'Poster Presentation (Research-Based) ',
            description: 'Present your research in a visually engaging poster format. Showcase your work and discuss your findings with judges and attendees.',
            imageUrl: './Poster presentation.jpg'
        },
        {
            participation: 'team',
            id: '35',
            category: 'Cultural Events',
            title: 'Nṛtyānte Dṛśyam',
            description: 'A group dance competition where participants will perform themed dances representing the vibrant cultural canvas of India. This event showcases the diversity of Indian culture through dance, music and costumes representing our festivals',
            imageUrl: './'
        },
        {
            participation: 'team',
            id: '36',
            category: 'E-Sports',
            title: 'Bullet echo',
            description: 'Join Bullet Echo for a thrilling tactical shooter experience! Team up with friends or face rivals in fast-paced matches. Compete in the tournament for a chance to win prizes and enjoy the gaming community!',
            imageUrl: './Bullet echo.jpg'
        },
        {
            participation: 'solo',
            id: '37',
            category: 'E-Sports',
            title: 'Road To Valor',
            description: 'Join the Road to Valor tournament! Compete in this multiplayer battle to showcase your strategy skills and win exciting prizes. Immerse yourself in epic gameplay and connect with fellow strategists!',
            imageUrl: './Road to valor.jpg'
        },
        {
            participation: 'solo',
            id: '38',
            category: 'General Events',
            title: 'Videography',
            description: 'This event showcases the art of visual storytelling through film, where participants create captivating videos, highlighting their skills in camera work, editing, and narrative. It\'s a platform to explore and celebrate the creativity of moving image',
            imageUrl: './Videography.jpg'
        },
        {
            participation: 'solo',
            id: '39',
            category: 'General Events',
            title: 'Photography',
            description: 'This event celebrates the art of photography, where participants showcase their skills in framing, composition, and creativity. It\'s a platform for photographers to display stunning images and tell powerful stories through their lens',
            imageUrl: './Photography.jpg'
        },
        {
            participation: 'team',
            id: '40',
            category: 'Miscellaneous',
            title: 'CrickBid',
            description: 'CrickBid is a fast-paced mock IPL auction where teams compete to build the ultimate cricket squad. With a limited budget, sharp strategy, and quick decisions are key to outbidding opponents and assembling a winning team',
            imageUrl: './IPL Auctionj.jpg'
        },
        {
            participation: 'solo',
            id: '41',
            category: 'Miscellaneous',
            title: 'Movie Screaning',
            description: '"Cinephiles, assemble! Immerse yourself in a thrilling journey of imagination and stunning visuals. Cinema is more than storytelling—it\'s about creating lasting experiences. Join us for an evening of romance, thrill, and joy by registering now!"',
            imageUrl: './Movie screening.jpg'
        },
        {
            participation: 'solo',
            id: '42',
            category: 'General Events',
            title: 'Alumni Talk',
            description: 'Join us for insightful talks by Tezpur University alumni, sharing their journeys after leaving campus. Learn from those who have successfully transitioned from academia to the real world. Don\'t miss this chance to be inspired and network with accomplished alumni',
            imageUrl: './Alumni talk.jpg'
        }

    ];

    const filteredData = selectedCategory === 'All' ? data : data.filter((event) => event.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className='overflow-x-hidden relative '>
            <div className="w-full z-50 pt-14  mx-auto bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b]">
                <StarsBackground className='absolute '
                    starDensity={0.0002}
                />

                <ShootingStars />

                <h1 className="font-semibold font-technoHideo text-7xl w-fit h-fit pt-6 pl-9 ml-10 text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">Events</h1>

                <div className='list-none ml-10 absolute  z-10 font-manrope container flex text-white pl-9'>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'All' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('All')}>All</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'Technical Events' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('Technical Events')}>Technical Events</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'General Events' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('General Events')}>General Events</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'Sports Events' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('Sports Events')}>Sports Events</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'E-Sports' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('E-Sports')}>E-Sports</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'Cultural Events' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('Cultural Events')}>Cultural Events</li>
                    <li className={`py-4 pr-7 cursor-pointer ${selectedCategory === 'Miscellaneous' ? 'text-[#FD8444]' : 'text-slate-400 hover:text-[#FD8444]'}`} onClick={() => setSelectedCategory('Miscellaneous')}>Miscellaneous</li>
                </div>



                <div className=' pt-20 '>
                    <Slider {...settings} className='border-'>
                        {filteredData.map((d) => (
                            <div
                                key={d.id}
                                className='px-4 py-16'
                                onMouseEnter={() => {
                                    setHoveredEventId(d.id);
                                }}
                                onMouseLeave={() => setHoveredEventId(null)}
                            >
                                <div className=''>

                                    <BackgroundGradient className={`flex relative  flex-col w-104  bg-black rounded-3xl min-h-[500px] transform  transition-transform duration-300 `}>
                                        <div className='flex justify-between pt-8 '>
                                            <h1 className={`bg-gradient-radial from-[#ffffff] to-[#da9276] bg-clip-text text-transparent font-manrope ${hoveredEventId === d.id ? 'text-white' : ''} pl-14`}>{d.participation}</h1>
                                            <img src="./arrow.svg" width={230} alt="" className='mr-9' />
                                        </div>
                                        <div className='flex pl-8 flex-col'>
                                            <h1 className='text-white font-manrope  w-fit ml-5 pl-4 pr-4 mt-3 mb-3 rounded-[10px] bg-gradient-radial from-[#cb0044] to-[#e7551b] '>{d.id}</h1>
                                            <div className='bg-[#2b2b2b] rounded-[25px] ml-4 mb-7 h-fit w-fit pr-5 pl-5  flex items-center '>
                                                <h1 className={`font-bold font-manrope text-[2rem]  bg-gradient-radial from-[#EA1B60] to-[#FD7844] bg-clip-text text-transparent ${hoveredEventId === d.id ? 'bg-gradient-radial from-[#EA1B60] to-[#FD7844]' : ''} `}>{d.title}</h1>
                                            </div>
                                        </div>
                                        <p className={`text-slate-400 ${hoveredEventId === d.id ? 'text-white' : ''} font-manrope text-xl pl-14 pr-12 text-left`}>
                                            {d.description}
                                        </p>
                                        <div className='flex justify-center mt-auto'>
                                            <img src="./line.svg" width={170} alt="" className='w-fit  pt-4 pl-8 pr-8' />
                                        </div>
                                        <p className='text-[#808080] font-manrope w-fit pl-8 pt-4 pb-4'>Know More</p>


                                        {hoveredEventId === d.id && (
                                            <div className='absolute inset-0  opacity-35 transition-opacity duration-300'>
                                                <img src={d.imageUrl} alt={d.title} className='object-cover w-full h-full rounded-3xl' />
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
