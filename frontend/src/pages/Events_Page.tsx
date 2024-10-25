import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import moment from 'moment-timezone';

interface SearchEmail {
    _id: string;
    email: string;
}

interface SearchEmailResponse {
    success: boolean;
    users: SearchEmail[];
}

const Hackathon = () => {
    const [search] = useSearchParams();
    const id = search.get("id");
    const [event, setEvent] = useState<EventDetails>();
    const [loading, setLoading] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [memberEmails, setMemberEmails] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [users, setUsers] = useState<SearchEmail[]>();
    const [keyword, setKeyword] = useState("");
    // const [counts, setCounts] = useState({
    //     currentPage: 1,
    //     resultPerPage: 1,
    //     filteredUsers: 1,
    //     totalUsers: 1
    // });
    const [searchLoading, setSearchLoading] = useState(false);

    const gotUsers = async (url: string) => {
        try {
            const { data }: { data: SearchEmailResponse } = await axios.get(url, { withCredentials: true });
            setUsers(data.users);
            // setCounts(prev => ({
            //     ...prev,
            //     resultPerPage: data.resultPerPage,
            //     filteredUsers: data.filteredUsersCount,
            //     totalUsers: data.count
            // }));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setUsers([]);
        }
    }

    useEffect(() => {
        const queryParams = [
            `keyword=${keyword}`,
            // `page=${counts.currentPage}`,
        ].filter(Boolean).join("&");

        setSearchLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/events/search/users/all?${queryParams}`;
            gotUsers(link);
            setSearchLoading(false);
        }, 2000);


        return () => clearTimeout(delayDebounce);

    }, [keyword]);

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
        if (["HYBRID", "TEAM"].includes(event?.participation as any)) {
            if (event?.participation === "TEAM" && memberEmails.length < 1) {
                toast.error("Please add at least one member to enroll in a team event.");
                return;
            }
            if (memberEmails.length > (event?.maxGroup! - 1)) {
                toast.error(`Only ${event?.maxGroup} members can be added to this team event`);
                return;
            }
        }
        try {
            const { data }: { data: any } = await axios.put(`${import.meta.env.VITE_BASE_URL}/events/enroll/${id}`, { memberEmails }, { withCredentials: true });
            console.log(data);
            setMemberEmails([]);
            if (open) {
                setOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
        }
    }

    useEffect(() => {
        if (open) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [open]);

    return loading ? (
        <div className='flex justify-center items-center'>
            <h1 className='text-xl font-semibold'>Loading...</h1>
        </div>
    ) : (event && !event.isVisible) ? (
        <div className='bg-black w-full lg:h-screen md:h-full h-full lg::py-0 py-4 flex justify-center items-center'>
            <h1 className='text-5xl font-semibold text-white'>Coming Soon...</h1>
        </div>
    ) : event ? (
        <div className='bg-black w-full lg:h-screen md:h-full h-full lg::py-0 py-4 flex justify-center items-center'>
            <div className='w-[90%] h-[85vh] bg-slate-950 shadow-2xl shadow-purple-800 rounded-xl border border-dashed border-pink-600 '>
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
                    <div className='basis-1/2 max-h-full overflow-y-scroll hide-scrollbar'>
                        <div className='m-8'>
                            <h1 className="text-4xl font-bold text-pink-500">{event?.title}</h1>
                            {event?.subTitle && (
                                <p className="mt-2 text-gray-400">{event.subTitle}</p>
                            )}
                            <p className="mt-4 text-white">Date: <span className="text-pink-500">
                                {new Date(event?.eventDate!).toLocaleDateString('en-GB')}
                            </span></p>
                            <p className="text-white">Time: <span className="text-pink-500">
                                {moment.utc(event.eventDate).format('hh:mm A')} onwards
                            </span></p>
                            <p className='text-white'>Venue: <span className="text-pink-500">{event?.venue}</span></p>
                            {event?.rules && event?.rules?.length > 0 ? (
                                <div className="2xl:mt-8 mt-4 text-white">
                                    <h2 className="text-2xl font-semibold text-pink-500">Rules</h2>
                                    <ul className="2xl:mt-4 mt-3 space-y-1 list-decimal list-inside text-sm">
                                        {event?.rules?.map((rule: string, index) => (
                                            <li key={index}>{rule}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className='2xl:mt-8 mt-4 text-white'>
                                    <h2 className="text-2xl font-semibold">Rules will be uploaded soon</h2>
                                </div>
                            )}
                            {["HYBRID", "TEAM"].includes(event?.participation as any) && open && (
                                <div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                                    <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
                                        <div className='flex justify-between items-center'>
                                            <h1 className='text-xl md:text-2xl font-semibold'>Add Members</h1>
                                            <button className='border-2 rounded-lg px-2 py-1 text-lg' onClick={() => setOpen(false)}>Close</button>
                                        </div>
                                        <div className='mt-8'>
                                            <div className='flex flex-wrap gap-2'>
                                                {memberEmails.map((member, index) => (
                                                    <div key={index} className='flex bg-slate-300 text-black rounded-full gap-2 px-2 py-1'>
                                                        <p>{member.length > 15 ? `${member.slice(0, 15)}...` : member}</p>
                                                        <button onClick={() => setMemberEmails(emails => emails.filter(email => email !== member))}><RxCross2 size={20} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mt-2'>
                                                <input
                                                    type="text"
                                                    placeholder="Enter User Emails..."
                                                    onFocus={() => setIsExpanded(true)}
                                                    onBlur={() => setIsExpanded(false)}
                                                    value={keyword}
                                                    onChange={(e) => setKeyword(e.target.value)}
                                                    className="border w-full p-2 rounded-md text-black"
                                                />
                                            </div>
                                            <div>
                                                <div
                                                    className={`transition-all duration-300 ${isExpanded ? 'max-h-64 overflow-y-scroll opacity-100' : 'max-h-0 opacity-0'
                                                        } overflow-hidden p-4 mt-2 rounded-md`}
                                                >
                                                    {searchLoading ? (
                                                        <p>Loading...</p>
                                                    ) : (
                                                        <>
                                                            {users?.filter(user => !memberEmails.includes(user.email))?.map((user, index) => (
                                                                <p className='py-2 px-3 hover:bg-gray-200 rounded-lg' key={index} onClick={() => setMemberEmails(emails => [...emails, user.email])}>
                                                                    {user.email}
                                                                </p>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="w-full mt-2 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600" disabled={memberEmails.length === 0} onClick={enrollEvent}>Register</button>
                                        </div>
                                    </div>
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
                                    {(event?.canRegister || event?.registrationRequired) && (
                                        <button
                                            disabled={!event?.canRegister || !event?.registrationRequired}
                                            onClick={() => {
                                                if (["HYBRID", "TEAM"].includes(event?.participation as any)) {
                                                    setOpen(true);
                                                } else {
                                                    enrollEvent
                                                }
                                            }}
                                            className="2xl:mt-8 mt-5 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
                                        >
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