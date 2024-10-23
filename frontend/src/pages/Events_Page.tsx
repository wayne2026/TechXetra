import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// import { format, toZonedTime } from 'date-fns-tz';
// const timeZone = 'Asia/Kolkata';

const Hackathon = () => {
    const [search] = useSearchParams();
    const id = search.get("id");
    const [event, setEvent] = useState<EventDetails>();
    const [loading, setLoading] = useState(false);
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

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const { data }: { data: EventDetailsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, { withCredentials: true });
            setEvent(data.event);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const enrollEvent = async () => {
        try {

        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return loading ? (
        <div className='flex justify-center items-center'>
            <h1 className='text-xl font-semibold'>Loading...</h1>
        </div>
    ) : (event && !event.isVisible) ? (
        <div className='bg-black w-full lg:h-screen md:h-full h-full lg::py-0 py-4 flex justify-center items-center'>
            <h1 className='text-5xl font-semibold text-white'>Comming Soon</h1>
        </div>
    ) : event ? (
        <div className='bg-black w-full lg:h-screen md:h-full h-full lg::py-0 py-4 flex justify-center items-center'>
            <div className='w-[90%] h-[85%] bg-slate-950 shadow-2xl shadow-purple-800 rounded-xl border border-dashed border-pink-600 '>
                <div className='lg:flex justify-center items-center h-full rounded-lg'>
                    <div className='basis-1/2 h-full'>
                        <div
                            className="bg-cover bg-center bg-no-repeat basis-1/2 h-full relative rounded-lg mr-1"
                            style={{ backgroundImage: `url("/mesh.png")` }}
                        >
                            {event?.image ? (
                                <div className="flex justify-center items-center h-full min-h-80">
                                    <img
                                        src={event.image}
                                        alt={event?.title}
                                        className="w-80 md:w-90 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full min-h-80">
                                    <img
                                        ref={imageRef}
                                        src="/TechXetraLogo1.png"
                                        alt="Hackathon"
                                        className="xl:w-[25rem] lg:w-80 w-60  rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='basis-1/2 h-full'>
                        <div className='m-8'>
                            <h1 className="text-4xl font-bold text-pink-500">{event?.title}</h1>
                            {event?.subTitle && (
                                <p className="mt-2 text-gray-400">{event.subTitle}</p>
                            )}
                            <p className="mt-4 text-white">Date: <span className="text-pink-500">{new Date(event?.eventDate!).toLocaleDateString('en-GB')}</span></p>
                            <p className="text-white">Time: <span className="text-pink-500">
                                10:30 AM onwards
                                {/* {format(toZonedTime(event?.eventDate ? new Date(event.eventDate) : new Date(), timeZone), 'hh:mm a', { timeZone })} onwards */}
                                {/* {new Date(event?.eventDate!).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata'
                                })} onwards */}
                                
                            </span></p>
                            <p className='text-white'>Venue: <span className="text-pink-500">{event?.venue}</span></p>
                            {event?.rules && event?.rules?.length > 0 ? (
                                <div className="2xl:mt-8 mt-4 text-white">
                                    <h2 className="text-2xl font-semibold text-pink-500">Rules</h2>
                                    <ul className="2xl:mt-4 mt-3 space-y-1 list-decimal list-inside text-sm">
                                        {event?.rules?.map((rule: string) => (
                                            <li>{rule}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className='2xl:mt-8 mt-4 text-white'>
                                    <h2 className="text-2xl font-semibold">Rules will be uploaded soon</h2>
                                </div>
                            )}
                            {event?.externalRegistration ? (
                                <Link
                                    to={event.extrenalRegistrationLink!}
                                    target="_blank"
                                >
                                    <button className="2xl:mt-8 mt-5 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600">
                                        Register Now →
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    {event?.canRegister || event?.registrationRequired && (
                                        <button disabled={!event?.canRegister || !event?.registrationRequired} onClick={enrollEvent} className="2xl:mt-8 mt-5 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600">
                                            Register Now →
                                        </button>
                                    )}
                                </>
                            )}
                            {event?.externalLink && (
                                <Link
                                    to={event?.externalLink}
                                    target="_blank"
                                >
                                    <button className="2xl:mt-8 mt-5 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600">
                                        Know More →
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <div className='flex justify-center items-center'>
            <h1 className='text-xl font-semibold'>Event not found 404</h1>
        </div>
    )
}

export default Hackathon