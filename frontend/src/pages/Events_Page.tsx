import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import moment from 'moment-timezone';
import { useUser } from '../context/user_context';

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
    const userContext = useUser();
    const [event, setEvent] = useState<EventDetails>();
    const [loading, setLoading] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [memberEmails, setMemberEmails] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [openPaymemt, setOpenPaymemt] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [users, setUsers] = useState<SearchEmail[]>();
    const [keyword, setKeyword] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [events, setEvents] = useState<UserEvent[]>([]);
    const [paymentFile, setPaymentFile] = useState<File>();
    const [paymentId, setPaymentId] = useState("");
    const [userEvent, setUserEvent] = useState<UserEvent>();
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        if (events && event) {
            const foundUserEvent = events.find(userEvent => userEvent?.eventId?._id?.toString() === event?._id.toString());
            setUserEvent(foundUserEvent);
        }
    }, [events, event]);

    const gotUsers = async (url: string) => {
        try {
            const { data }: { data: SearchEmailResponse } = await axios.get(url, { withCredentials: true });
            const filteredUsers = data.users?.filter(user => user._id !== userContext?.user?._id)
            setUsers(filteredUsers);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setUsers([]);
        }
    }

    const fetchEvents = async () => {
        try {
            const { data }: { data: UserEventResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/events`, { withCredentials: true });
            setEvents(data.user.events);
            console.log(data.user.events);
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    }

    const handlePaymentSubmision = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!paymentId || !paymentFile) {
            toast.error("Please provide both Payment ID and Payment file.");
            return;
        }

        setPaymentLoading(true);

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const formData = new FormData();
        formData.append('image', paymentFile);
        formData.append("transactionId", paymentId);

        try {
            if (id) {
                const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/events/payment/${id}`, formData, config);
                setEvents(data.user.events);
                toast.success("Payment details successfully submitted");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setPaymentLoading(false);
            setOpenPaymemt(false);
            setPaymentId("");
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (keyword && keyword.length > 3) {
            setSearchLoading(true);

            const delayDebounce = setTimeout(() => {
                const link = `${import.meta.env.VITE_BASE_URL}/events/search/users/all?keyword=${keyword}`;
                gotUsers(link);
                setSearchLoading(false);
            }, 2000);

            return () => clearTimeout(delayDebounce);
        } else {
            setUsers([]);
        }
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
            if (id) {
                const { data }: { data: any } = await axios.put(`${import.meta.env.VITE_BASE_URL}/events/enroll/${id}`, { memberEmails }, { withCredentials: true });
                setEvents(data.user.events);
                setMemberEmails([]);
                if (open) {
                    setOpen(false);
                }
                if (event?.paymentRequired) {
                    setOpenPaymemt(true);
                }
                toast.success("Successfully registered event.");
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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPaymentFile(file);
        }
    };

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
                    <div className='basis-1/2 max-h-full overflow-y-scroll hide-scrollbar'>
                        <div className='m-8'>
                            <h1 className="text-4xl font-bold text-pink-500">{event?.title}</h1>
                            {event?.subTitle && (
                                <p className="mt-2 text-gray-400">{event.subTitle}</p>
                            )}
                            <p className="mt-4 text-white">Date: <span className="text-pink-500">
                                {moment.utc(event.eventDate).format('DD/MM/yyyy')}
                            </span></p>
                            <p className="text-white">Time: <span className="text-pink-500">
                                {moment.utc(event.eventDate).format('hh:mm A')} onwards
                            </span></p>
                            <p className='text-white'>Venue: <span className="text-pink-500">{event?.venue}</span></p>
                            {event?.note && (
                                <p className='mt-4 text-red-500 text-xl'>Note: {event?.note}</p>
                            )}
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
                                            <button
                                                className='border-2 rounded-lg px-2 py-1 text-lg'
                                                onClick={() => {
                                                    setOpen(false);
                                                    setKeyword("");
                                                }}
                                            >
                                                <RxCross2 size={20} />
                                            </button>
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
                                            <button className="w-full mt-2 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600" disabled={event?.participation === "TEAM" && memberEmails.length === 0} onClick={enrollEvent}>Register</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {openPaymemt && (
                                <div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                                    <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
                                        <div className='flex justify-between items-center'>
                                            <h1 className='text-xl md:text-2xl font-semibold'>Event Paymnet</h1>
                                            <button className='border-2 rounded-lg px-2 py-1 text-lg' onClick={() => setOpenPaymemt(false)}><RxCross2 size={20} /></button>
                                        </div>
                                        <div className='text-center h-42 w-56'>
                                            <img src="/upi.jpg" alt="upi" />
                                        </div>
                                        <form className='mt-8 flex flex-col justify-center space-y-2' onSubmit={handlePaymentSubmision}>
                                            <div className="flex flex-col gap-4">
                                                <label htmlFor="role" className="text-lg font-semibold">Transaction Id</label>
                                                <input type="text" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <label htmlFor="role" className="text-lg font-semibold">Payment Screenshot</label>
                                                <input type="file" accept='image/*' onChange={handleFileChange} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                                            </div>
                                            <button disabled={paymentLoading} type='submit' className='bg-indigo-500 px-3 py-2 rounded-lg text-white'>{paymentLoading ? "Loading..." : "Submit"}</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {userEvent ? (
                                <div className='mt-6'>
                                    {event.paymentRequired && !["SUBMITTED", "VERIFIED"].includes(userEvent?.payment?.status) &&
                                        (userEvent.group?.leader?._id?.toString() === userContext?.user?._id.toString()) && (
                                            <button
                                                onClick={() => setOpenPaymemt(true)}
                                                className="px-4 py-3 mr-4 bg-green-500 rounded-lg text-white hover:bg-green-600"
                                            >
                                                Pay Now →
                                            </button>
                                        )}
                                    <p className="mt-2 text-slate-400 italic text-sm">You have already registered for this event.</p>
                                </div>
                            ) : (
                                <>
                                    {event?.externalRegistration ? (
                                        <Link to={event.extrenalRegistrationLink!} target="_blank">
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
                                                        if (["HYBRID", "TEAM"].includes(event?.participation)) {
                                                            setOpen(true);
                                                        } else {
                                                            enrollEvent(); // Call enrollEvent when the user registers
                                                        }
                                                    }}
                                                    className="2xl:mt-8 mt-5 px-4 py-3 mr-4 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
                                                >
                                                    Register Now →
                                                </button>
                                            )}
                                        </>
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