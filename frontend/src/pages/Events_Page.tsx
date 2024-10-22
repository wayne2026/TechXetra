import { useRef, useEffect } from 'react';
import { gsap } from 'gsap'

const Hackathon = () => {
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                y: 'random(-20,20)',
                x: 'random(-20,20)',
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                duration: 1.5,
            });
        }
    }, []);

    return (
        <div className='bg-black w-full lg:h-screen md:h-full h-full lg::py-0 py-4 flex justify-center items-center'>
            <div className='w-[90%] h-[85%] bg-slate-950 shadow-2xl shadow-purple-800 rounded-xl border border-dashed border-pink-600 '>
                <div className='lg:flex justify-center items-center h-full rounded-lg'>
                    <div className='basis-1/2 h-full'>
                        <div
                            className="bg-cover bg-center bg-no-repeat basis-1/2 h-full relative rounded-lg mr-1"
                            style={{ backgroundImage: `url("/mesh.png")` }}
                        >
                            <div className="flex justify-center items-center h-full min-h-80">
                                <img
                                    ref={imageRef}
                                    src="/TechXetraLogo1.png"
                                    alt="Hackathon"
                                    className="xl:w-[25rem] lg:w-80 w-60  rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='basis-1/2 h-full'>
                        <div className='m-8'>
                            <h1 className="text-4xl font-bold text-pink-500">HACKXETRA</h1>
                            <p className="mt-2 text-gray-400">in collaboration with GDGC Tezpur University</p>
                            <p className="mt-4 text-white">Date: <span className="text-pink-500">08/11/24</span></p>
                            <p className="text-white">Time: <span className="text-pink-500">10:30 am onwards</span></p>
                            <p className='text-white'>Venue: <span className="text-pink-500">Dean's Gallery</span></p>
                            <div className="2xl:mt-8 mt-4 text-white">
                                <h2 className="text-2xl font-semibold text-pink-500">Rules</h2>
                                <ul className="2xl:mt-4 mt-3 space-y-1 list-decimal list-inside text-sm">
                                    <li>Event Duration: 48-hour hackathon; daytime presence required.</li>
                                    <li>Accommodation: Provided; work from rooms outside scheduled venue hours.</li>
                                    <li>Problem Statements: Revealed in the first hour; develop based on theme/problem.</li>
                                    <li>Team Composition: 2-5 members; all must be registered and present during required hours.</li>
                                    <li>Development Rules: All work within event period; any tech stack allowed.</li>
                                    <li>Submission Requirements: Submit project on GitHub and provide a workable link (optional) and PPT.</li>
                                    <li>Presentation: Demo and present solution on the 3rd day, covering tech stack and approach.</li>
                                </ul>
                            </div>
                            <button className="2xl:mt-8 mt-5 px-4 py-2 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600">
                                Register Now →
                            </button>
                            <a
                                href="https://docs.google.com/document/d/1xXOadPIykvosgPrlhlvnrX-VNOtvNNPmtlMp91NTnvk/edit?usp=sharing"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="2xl:mt-8 mt-5 px-4 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600">
                                    Know More →
                                </button>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Hackathon