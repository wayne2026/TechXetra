import Loader from "@/components/custom/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment-timezone';

const UserPage = () => {
    const [search] = useSearchParams();
    const id = search.get('id');
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>("");

    const fetchUser = async () => {
        setLoading(true);

        const cachedUserById = window.sessionStorage.getItem('user_byId');
        if (cachedUserById) {
            const { data: cachedUser, expires, id: cachedId } = JSON.parse(cachedUserById);

            if (Date.now() < expires && cachedId === id) {
                setUser(cachedUser);
                setSelectedOption(cachedUser.role);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('user_byId');

        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admins/users/byId/${id}`, { withCredentials: true });
            setUser(data.user);
            setSelectedOption(data.user.role);
            const payload = {
                id,
                data: data.user,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem("user_byId", JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const handleUpdateUserRole = async () => {
        try {
            if (selectedOption === "") {
                toast.warning("Select a Role");
                return;
            }
            if (selectedOption === user?.role) {
                toast.warning("Selecetd Role already exists");
                return;
            }
            try {
                const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admins/users/role/${id}`, { role: selectedOption }, { withCredentials: true });
                window.sessionStorage.removeItem('user_byId');
                setUser(data.user);
                setSelectedOption(data.user.role);
                toast.success("User Role updated successfully");
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleToggleBlockUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admins/users/block/${id}`, {}, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
            setUser(data.user);
            setSelectedOption(data.user.role);
            toast.success("User Block status updated successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return !id || !user ? (
        <p className="mt-36 text-3xl font-semibold text-red-500">User ID not provided</p>
    ) : loading ? (
        <Loader />
    ) : (
        <div className="w-full md:w-[60%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-center">

                <h1 className="text-3xl font-semibold text-indigo-600 mb-4 underline">User Details</h1>

                <div className="mt-6 mb-6 flex flex-col md:flex-row items-center gap-8">
                    {user?.avatar && user?.avatar?.length > 0 ? (
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-full shadow-md border-4 border-indigo-600"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-24 h-24 rounded-full shadow-md border-4 border-indigo-600">
                            <p className="text-center text-2xl font-semibold">{`${user?.firstName[0]}${user?.lastName[0]}`}</p>
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <p className="text-lg font-semibold text-gray-700">Name: {user.firstName} {user.lastName}</p>
                        <p className="text-lg font-semibold text-gray-700">{user.schoolOrCollege === "SCHOOL" ? "SCHHOL" : "COLLEGE"}: {user.schoolOrCollege === "SCHOOL" ? user.schoolName : user.collegeName}</p>
                        <p className="text-lg font-semibold text-gray-700">Email: {user.email}</p>
                        <p className="text-lg font-semibold text-gray-700">Phone: {user.phoneNumber}</p>
                        <p className="text-lg font-semibold text-gray-700">Role: {user.role}</p>
                        <p className="text-lg font-semibold text-gray-700">Academic Level: {user.schoolOrCollege === "SCHOOL" ? user.schoolClass : user.collegeClass}</p>
                    </div>
                </div>

                <div className="mt-4 mb-6 flex flex-col md:flex-row gap-2">
                    <div className="inline-flex items-center cursor-pointer gap-4">
                        <select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="text-black px-3 py-2 rounded-md border-2"
                        >
                            <option value="" disabled className="text-body dark:text-bodydark">SELECT ROLE</option>
                            <option value="ADMIN" className="text-body dark:text-bodydark">ADMIN</option>
                            <option value="USER" className="text-body dark:text-bodydark">USER</option>
                            <option value="MODERATOR" className="text-body dark:text-bodydark">MODERATOR</option>
                        </select>

                        <button onClick={handleUpdateUserRole} className="rounded bg-indigo-500 px-3 py-2 font-medium text-white hover:bg-opacity-90">
                            Update Role
                        </button>
                    </div>

                    <div className="inline-flex items-center cursor-pointer gap-4">
                        <p className="text-xl font-semibold text-gray-600">BLOCKED: {user.isBlocked.toString().toUpperCase()}</p>
                        <button onClick={handleToggleBlockUser} className="rounded bg-indigo-500 px-3 py-2 font-medium text-white hover:bg-opacity-90">
                            Block User
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-indigo-600 underline">Enrolled Events</h1>

                {user.events && user.events.map((event, index) => (
                    <div key={index} className="mt-4 w-full md:w-[90%] mx-auto">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-semibold text-indigo-600">{event.eventId.title}</h3>
                                    <p className="text-sm text-slate-400">
                                        {event.eventId.venue} • {moment.utc(event.eventId.eventDate).format('DD/MM/yyyy')} • {moment.utc(event.eventId.eventDate).format('hh:mm A')}
                                    </p>
                                </div>
                                {event.group && event.group.members && event.group.members?.length > 0 && (
                                    <div>
                                        <p>Leader: {event.group.leader?.firstName}{event.group.leader?.lastName}</p>
                                        {event.group.members.map((member, index) => (
                                            <p key={index}>Member{index + 1}: {member.user?.firstName}{member.user?.lastName} - {member.status}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h2 className="text-md font-semibold">Payment Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white`}>
                                            {event.payment.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Transaction ID:</strong>{event.payment.transactionId}</p>
                                        <p><strong>Verifier:</strong> {event.payment.verifierId}</p>
                                        <p><strong>Amount:</strong> ₹ {event.payment.amount}</p>
                                        {event?.payment?.paymentImage && (
                                            <Link onClick={(e) => e.stopPropagation()} to={event?.payment?.paymentImage} target="blank" className="mt-2 flex items-center gap-4">Payment ScreenShot: <img className="h-10 w-10 rounded-lg" src={event.payment.paymentImage} alt={event.payment.transactionId} /></Link>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-md font-semibold">Phyiscal Verification Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white`}>
                                            {event.physicalVerification.status.toString().toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Verifier:</strong> {event.physicalVerification.verifierId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;