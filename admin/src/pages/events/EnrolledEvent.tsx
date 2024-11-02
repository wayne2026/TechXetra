import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

const EnrolledEvent = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const eventID = searchParams.get('event');
    const [user, setUser] = useState<User | null>(null);
    
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [userError, setUserError] = useState(false);
    const [payment, setPayment] = useState({
        status: "paid",
        transactionId: "dsfdsfsf",
        paymentImage: "dsfdfds",
        amount: 100,
        verifierId: "byutytrd5678i8"
    });

    useEffect(() => {
		const fetchUser = async () => {
			try {
                const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/admins/users/byId/${id}`,
					{
						withCredentials: true,
					}
				);
				setUser(response.data.user);
                setUserError(false);
			} catch (err) {
				console.log("Failed to fetch user data.", err);
                setUserError(true);
			} 
		};

            fetchUser();

	}, [id]);

useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/events/byId/${eventID}`,
                    {
                        withCredentials: true,
                    }
                );
                setEvent(response.data.event);
            } catch (err) {
                console.log("Failed to fetch event data.", err);
            } 
        };

            fetchEvent();

    }, [eventID]);

console.log(user);
    return (
        <div className="mt-24 mb-10 max-w-[20rem] sm:max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h1 className="text-3xl font-semibold text-center text-indigo-600">User and Event Details</h1>

            {/* User Card */}
           {user && <div className="flex items-center space-x-6 bg-gray-50 p-5 rounded-lg shadow-sm">
                <Avatar className="w-16 h-16" style={!user.avatar ? {background: "black"}:{}}>
                    <AvatarImage src={user.avatar || "../../../public/logo.png"} alt="profile" className="rounded-full" />
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-sm text-gray-500">{
                    (user?.schoolOrCollege === "SCHOOL") ?
                        user?.schoolName
                    :
                        user?.collegeName
                    }
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>}
            {!user && !userError && "Loading..."}
            {userError && !user && "Failed to fetch user data."}

            <Separator className="bg-gray-200 my-6" />

            {/* Event Details */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-indigo-500">Event Information</h3>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Event Name:</span>
                    <span className="text-gray-900">{event?.title}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Price:</span>
                    <span className="text-gray-900">₹ {event?.amount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Location:</span>
                    <span className="text-gray-900">{event?.venue}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Time:</span>
                    <span className="text-gray-900">{event?.eventDate?.toString()}</span>
                </div>
            </div>

            <Separator className="bg-gray-200 my-6" />

            {/* Payment & Verification Info */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-indigo-500">Verification Details</h3>
                <div className="flex items-center justify-between">
                    {payment.status === "pending" ? (
                        <div className="px-3 py-1 rounded-full text-white bg-yellow-500 text-sm font-semibold">
                            Payment Status: Pending
                        </div>
                    ) : (
                        <div className="px-3 py-1 rounded-full text-white bg-green-500 text-sm font-semibold">
                            Payment Status: Paid
                        </div>
                    )}
                    {payment.verifierId ? (
                        <div className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold">
                            Verified: True
                        </div>
                    ) : (
                        <div className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold">
                            Verified: False
                        </div>
                    )}
                </div>
                {payment.verifierId && (
                    <div className="mt-4 flex justify-between">
                        <span className="text-gray-700 font-medium">Verifier ID:</span>
                        <span className="text-gray-900">{payment.verifierId}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledEvent;
