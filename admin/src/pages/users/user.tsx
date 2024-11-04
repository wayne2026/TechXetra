import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UserPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userError, setUserError] = useState(false);
    // const location = useLocation();
    const [search] = useSearchParams();
    const id = search.get('id');
    // const navigate = useNavigate();

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
    }, [id]);



    return (
        <div className="mt-24 mb-10 p-4 sm:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-indigo-600 mb-4">User Details</h1>

                {userError && <p className="text-red-500">Failed to fetch user data.</p>}

                {user && (
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg">
                        <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full" style={!user.avatar ? { background: "black" } : {}} />
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
                    {/* {userEvents.map((event) => (
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
                    ))} */}
                </div>
            </div>
        </div>
    );
}

export default UserPage;