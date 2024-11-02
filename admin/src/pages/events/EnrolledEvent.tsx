import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';



const EnrolledEvent = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const eventID = searchParams.get('event');

    const [user, setUser] = useState({
        firstName: "Dhritiman",
        lastName: " Saikia",
        email: "dhritiman.saikia.11b.244@gmail.com",
        collegeName: "Tezpur University",
        avatar: "dbusudb"
    })
    
    const [event, setEvent] = useState({
        title: "Robowar",
        eventDate: "10 NOV 2024 AT 10:00 AM",
        venue: "Community Hall, Tezpur University",
        amount: 100
    })
    const [payment, setPayment] = useState({
        status: "paid",
        transactionId: "dsfdsfsf",
        paymentImage: "dsfdfds",
        amount: 100,
        verifierId: "byutytrd5678i8"
    })

    // const fetchUser = async () => {
    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/users/byId/${id}`);
    //         const data = await response.json();
    //         setUser(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // useEffect(() => {
    //     fetchUser();
    // })

    return (
        <div className="mt-24 mb-10 max-w-[20rem] sm:max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h1 className="text-3xl font-semibold text-center text-indigo-600">User and Event Details</h1>

            {/* User Card */}
            <div className="flex items-center space-x-6 bg-gray-50 p-5 rounded-lg shadow-sm">
                <Avatar className="w-16 h-16 bg-black">
                    <AvatarImage src="../../../public/logo.png" alt="profile" className="rounded-full" />
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
                    <p className="text-sm text-gray-500">{user.collegeName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <Separator className="bg-gray-200 my-6" />

            {/* Event Details */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-indigo-500">Event Information</h3>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Event Name:</span>
                    <span className="text-gray-900">{event.title}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Price:</span>
                    <span className="text-gray-900">₹ {event.amount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Location:</span>
                    <span className="text-gray-900">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Time:</span>
                    <span className="text-gray-900">{event.eventDate}</span>
                </div>
            </div>

            <Separator className="bg-gray-200 my-6" />

            {/* Payment & Verification Info */}
            {/* Payment & Verification Info */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-indigo-500">Verification Details</h3>
                <div className="flex items-center justify-between">
                    {
                        payment.status === "pending" ? <div className="px-3 py-1 rounded-full text-white bg-yellow-500 text-sm font-semibold">
                            Payment Status: Pending
                        </div> : <div className="px-3 py-1 rounded-full text-white bg-green-500 text-sm font-semibold">
                            Payment Status: Paid
                        </div>
                    }
                    {
                        payment.verifierId ? <div className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold">
                            Verified: True
                        </div> : <div className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold">
                            Verified: False
                        </div>
                    }
                </div>
                {payment.verifierId && <div className="mt-4 flex justify-between">
                    <span className="text-gray-700 font-medium">Verifier ID:</span>
                    <span className="text-gray-900">bidew988</span>
                </div>}
            </div>

        </div>
    );
};

export default EnrolledEvent;
