import Loader from "@/components/custom/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment-timezone';
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";

const UserPage = () => {
    const [search] = useSearchParams();
    const id = search.get('id');
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [currentEvent, setCurrentEvent] = useState<UserEvent | null>();
    const [openDelete, setOpenDelete] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState("");

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
    }

    const handleDeleteUser = async () => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admins/users/byId/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem('user_byId');
            navigate(-1);
            toast.success(data?.message);
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

    const handleUpdatePhysicalVerfication = async (eventId: string) => {
        try {
            if (id) {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admins/events/check/physical/${id}/${eventId}`, { withCredentials: true });
                window.sessionStorage.removeItem('user_byId');
                toast.success(data?.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleUpdatePaymentVerfication = async (eventId: string) => {
        if (selectedData === "") {
            toast.warning("Please select a status");
            return;
        }
        try {
            if (id) {
                const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admins/events/check/payment/${id}/${eventId}`, { paymentStatus: selectedData }, { withCredentials: true });
                window.sessionStorage.removeItem('user_byId');
                toast.success(data?.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDeleteUserEvent = async (eventId: string) => {
        try {
            if (id) {
                const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admins/events/delete/${id}/${eventId}`, { withCredentials: true });
                window.sessionStorage.removeItem('user_byId');
                navigate(-1)
                toast.success(data?.message);
            }
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

                {openDelete && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to delete this user?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDeleteUser}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-black rounded-lg" onClick={() => setOpenDelete(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {open && (
                    <>
                        {!currentEvent ? (
                            <div>
                                <p>Something went wrong fetching data...</p>
                            </div>
                        ) : (
                            <div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
                                    <div className='flex justify-between items-center'>
                                        <h1 className='text-xl md:text-2xl font-semibold'>Event Actions</h1>
                                        <button
                                            className='border-2 rounded-lg px-2 py-1 text-lg'
                                            onClick={() => {
                                                setOpen(false);
                                                if (selectedData) {
                                                    setSelectedData("");
                                                }
                                                setCurrentEvent(null);
                                            }}
                                        >
                                            <RxCross2 size={20} />
                                        </button>
                                    </div>
                                    <div className="mt-6 flex flex-col items-start space-y-2 gap-2">
                                        <div className="flex gap-2">
                                            <p className="text-lg font-semibold">Physical Verification:</p>
                                            <Button
                                                className="py-1"
                                                disabled={currentEvent.physicalVerification.status}
                                                onClick={() => {
                                                    handleUpdatePhysicalVerfication(currentEvent.eventId._id)
                                                }}
                                            >
                                                Verify User Physically
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-lg font-semibold">Paymnet Verification:</p>
                                            <select
                                                className="text-black px-2 py-1 rounded-md border-2"
                                                value={selectedData}
                                                onChange={(e) => setSelectedData(e.target.value)}
                                            >
                                                <option value="" disabled>Select an Option</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="SUBMITTED">SUBMITTED</option>
                                                <option value="VERIFIED">VERIFIED</option>
                                            </select>
                                            <Button
                                                className="py-1"
                                                disabled={currentEvent.payment.status === "VERIFIED" || selectedData === ""}
                                                onClick={() => {
                                                    handleUpdatePaymentVerfication(currentEvent.eventId._id)
                                                }}
                                            >
                                                Verify User Physically
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-lg font-semibold">Delete UserEvent:</p>
                                            <Button
                                                className="py-1"
                                                variant="destructive"
                                                onClick={() => {
                                                    handleDeleteUserEvent(currentEvent.eventId._id)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-6 mb-6 flex flex-col md:flex-row items-center gap-8">
                    {user?.avatar && user?.avatar?.length > 0 ? (
                        <img
                            src={user?.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-full shadow-md border-4 border-indigo-600"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-24 h-24 rounded-full shadow-md border-4 border-indigo-600">
                            <p className="text-center text-2xl font-semibold">{`${user?.firstName[0]}${user?.lastName[0]}`}</p>
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <p className="text-lg font-semibold text-gray-700">Name: {user?.firstName} {user?.lastName}</p>
                        <p className="text-lg font-semibold text-gray-700">{user?.schoolOrCollege === "SCHOOL" ? "SCHHOL" : "COLLEGE"}: {user?.schoolOrCollege === "SCHOOL" ? user?.schoolName : user?.collegeName}</p>
                        <p className="text-lg font-semibold text-gray-700">Email: {user?.email}</p>
                        <p className="text-lg font-semibold text-gray-700">Phone: {user?.phoneNumber}</p>
                        <p className="text-lg font-semibold text-gray-700">Role: {user?.role}</p>
                        <p className="text-lg font-semibold text-gray-700">Academic Level: {user?.schoolOrCollege === "SCHOOL" ? user?.schoolClass : user?.collegeClass}</p>
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
                        <p className="text-xl font-semibold text-gray-600">BLOCKED: {user?.isBlocked?.toString().toUpperCase()}</p>
                        <button onClick={handleToggleBlockUser} className="rounded bg-indigo-500 px-3 py-2 font-medium text-white hover:bg-opacity-90">
                            Block User
                        </button>
                    </div>

                    <div className="inline-flex items-center cursor-pointer gap-4">
                        <p className="text-xl font-semibold text-gray-600">Delete User:</p>
                        <button onClick={() => setOpenDelete(true)} className="rounded bg-red-500 px-3 py-2 font-medium text-white hover:bg-opacity-90">
                            Delete
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-indigo-600 underline">Enrolled Events</h1>

                {user?.events && user?.events.map((event, index) => (
                    <div key={index} className="mt-4 w-full md:w-[90%] mx-auto">
                        <div
                            onClick={() => {
                                setOpen(true);
                                setSelectedData(event.payment.status);
                                setCurrentEvent(event);
                            }}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-200"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-semibold text-indigo-600">{event?.eventId?.title}</h3>
                                    <p className="text-sm text-slate-400">
                                        {event?.eventId?.venue} • {moment.utc(event?.eventId?.eventDate).format('DD/MM/yyyy')} • {moment.utc(event?.eventId?.eventDate).format('hh:mm A')}
                                    </p>
                                </div>
                                {event?.group && event?.group?.members && event?.group?.members?.length > 0 && (
                                    <div>
                                        <p>Leader: {event?.group?.leader?.firstName}{event?.group?.leader?.lastName}</p>
                                        {event?.group?.members.map((member, index) => (
                                            <p key={index}>Member{index + 1}: {member?.user?.firstName}{member?.user?.lastName} - {member?.status}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h2 className="text-md font-semibold">Payment Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event?.payment?.status === "PENDING" ? "bg-yellow-500" : event?.payment?.status === "SUBMITTED" ? "bg-green-500" : "bg-blue-500"} text-white`}>
                                            {event?.payment?.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Transaction ID:</strong>{event?.payment?.transactionId}</p>
                                        <p><strong>Verifier:</strong> {event?.payment?.verifierId?._id}</p>
                                        <p><strong>Amount:</strong> ₹ {event?.payment?.amount}</p>
                                        {event?.payment?.paymentImage && (
                                            <Link onClick={(e) => e.stopPropagation()} to={event?.payment?.paymentImage} target="blank" className="mt-2 flex items-center gap-4">Payment ScreenShot: <img className="h-10 w-10 rounded-lg" src={event?.payment?.paymentImage} alt={event?.payment?.transactionId} /></Link>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-md font-semibold">Phyiscal Verification Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event?.physicalVerification?.status ? "bg-green-500" : "bg-red-500"} text-white`}>
                                            {event?.physicalVerification?.status?.toString().toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Verifier:</strong> {event?.physicalVerification?.verifierId?._id}</p>
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