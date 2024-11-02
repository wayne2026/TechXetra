import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const UserDetails = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userEvents, setUserEvents] = useState([
        {
            eventId: "66f300147845accfe1f5dc10",
            payment: {
                amount: 100,
                paymentImage: "",
                status: "PAID",
                transactionId: "cecec",
                verifierId: "xececece@21"
            },
            title: "Loading..."
        },
        {
            eventId: "66f3007751fc4ea35b035cc7",
            payment: {
                amount: 100,
                paymentImage: "",
                status: "PENDING",
                transactionId: "",
                verifierId: ""
            },
            title: "Loading..."
        },
        {
            eventId: "66f306901a73c8573b166f94",
            payment: {
                amount: 100,
                paymentImage: "",
                status: "PENDING",
                transactionId: "",
                verifierId: ""
            },
            title: "Loading..."
        },
    ]);
    const [userError, setUserError] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const navigate = useNavigate();


 // Fetch Event Titles by Event IDs
 const fetchEventTitles = async () => {
    try {
        const updatedEvents = await Promise.all(
            userEvents.map(async (event) => {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/events/byId/${event.eventId}`,
                    {
                        withCredentials: true, // If the API needs credentials
                    }
                );
                return {
                    ...event,
                    title: response.data.event.title || "Event Not Found",
                };
            })
        );
        setUserEvents(updatedEvents);
    } catch (err) {
        console.error("Failed to fetch event titles.", err);
    }
};


    // Fetch User by ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admins/users/byId/${id}`,
                    { withCredentials: true }
                );
                setUser(response.data.user);
                setUserError(false);
            } catch (err) {
                console.log("Failed to fetch user data.", err);
                setUserError(true);
            }
        };
        fetchUser();
        fetchEventTitles();
    }, [id]);

   

    return (
        <div className="mt-24 mb-10 p-4 sm:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-indigo-600 mb-4">User Details</h1>
                
                {userError && <p className="text-red-500">Failed to fetch user data.</p>}
                
                {user && (
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg">
                        <img src={user.avatar || "../../../public/logo.png"} alt="Profile" className="w-16 h-16 rounded-full" style={!user.avatar ? {background: "black"}:{}}/>
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-semibold text-gray-700">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-gray-500">
                                {(user.schoolOrCollege === "SCHOOL") ? user.schoolName : user.collegeName}
                            </p>
                            <p className="text-gray-500">Email: {user.email}</p>
                        </div>
                    </div>
                )}

                <h2 className="text-xl font-semibold text-indigo-500 mt-6">Enrolled Events</h2>
                <div className="space-y-4">
                    {userEvents.map((event) => (
                        <div key={event.eventId} onClick={() => {
                            navigate(`/users/user?id=${id}&event=${event.eventId}`);
                        }} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-200">
                            <h3 className="font-semibold text-indigo-600">{event.title}</h3>
                            <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.payment.status === "PAID" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                                    Payment Status: {event.payment.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full border border-gray-300 text-sm font-semibold ${event.payment.verifierId ? "text-green-600" : "text-red-600"}`}>
                                    {event.payment.verifierId ? "Verified" : "Not Verified"}
                                </span>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Verifier ID:</strong> {event.payment.verifierId || "N/A"}</p>
                                <p><strong>Amount:</strong> ₹ {event.payment.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
