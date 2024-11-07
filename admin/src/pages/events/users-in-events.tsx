import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

interface UserData {
    leader?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        schoolOrCollege: string;
        schoolName?: string;
        schoolClass?: string;
        collegeName: string;
        collegeClass: string;
        phoneNumber: string;
    },
    members?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        schoolOrCollege: string;
        schoolName?: string;
        schoolClass?: string;
        collegeName: string;
        collegeClass: string;
        phoneNumber: string;
    }[],
    userId?: string,
    firstName?: string;
    lastName?: string;
    email?: string;
    schoolOrCollege?: string;
    schoolName?: string;
    schoolClass?: string;
    collegeName?: string;
    collegeClass?: string;
    phoneNumber?: string;
    payment: {
        status: string;
        transactionId?: string;
        paymentImage?: string;
        amount: number;
        verifierId?: string;
    }
    physicalVerification: {
        status: boolean;
        verifierId?: string;
    }
    eventId: string;
    eventTitle: string;
}

interface UserDataResponse {
    success: boolean;
    users: UserData[];
    count: number;
    eventId: string;
    eventTitle: string;
}

const UsersInEvents = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get('id');
    const paymentStatus = searchParams.get('paymentStatus');
    const physicalVerification = searchParams.get('physicalVerification');
    const [users, setUsers] = useState<UserData[]>();
    const [currentUser, setCurrentUser] = useState<UserData | null>();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<string>("");
    const [count, setCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({
        paymentStatus: "",
        physicalVerification: "",
    });
    const [selectedOption, setSelectedOption] = useState("");

    const fetchUsers = async (link: string) => {
        setLoading(true);
        try {
            const { data }: { data: UserDataResponse } = await axios.get(link, { withCredentials: true });
            setUsers(data.users);
            setEvent(data.eventTitle);
            setCount(data.count);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const exportData = users?.map(user => {
        const isGroup = user.leader && user.members;

        if (isGroup) {
            const leader = user.leader;
            const members = user.members || [];

            const memberNames = members.map(member => `${member.firstName} ${member.lastName}`).join(', ');
            const memberEmails = members.map(member => member.email).join(', ');
            const memberPhones = members.map(member => member.phoneNumber).join(', ');
            const memberSchools = members.map(member => member.schoolName || '').join(', ');
            const memberClasses = members.map(member => member.schoolClass || member.collegeClass || '').join(', ');
            const memberColleges = members.map(member => member.collegeName || '').join(', ');

            return {
                Type: "Group",
                LeaderFirstName: leader?.firstName,
                LeaderLastName: leader?.lastName,
                LeaderEmail: leader?.email,
                LeaderPhoneNumber: leader?.phoneNumber,
                LeaderSchoolOrCollege: leader?.schoolOrCollege,
                LeaderSchoolName: leader?.schoolName || '',
                LeaderCollegeName: leader?.collegeName || '',
                LeaderClass: leader?.schoolClass || leader?.collegeClass || '',
                MemberNames: memberNames,
                MemberEmails: memberEmails,
                MemberPhones: memberPhones,
                MemberSchools: memberSchools,
                MemberClasses: memberClasses,
                MemberColleges: memberColleges,
                PaymentStatus: user?.payment?.status,
                TransactionId: user?.payment?.transactionId || '',
                paymentImage: user?.payment?.paymentImage || '',
                PaymentAmount: user?.payment?.amount,
                PhysicalVerificationStatus: user?.physicalVerification?.status ? "Verified" : "Unverified",
                EventId: user.eventId,
                EventTitle: user.eventTitle,
            };
        } else {
            return {
                Type: "Individual",
                FirstName: user.firstName,
                LastName: user.lastName,
                Email: user.email,
                PhoneNumber: user.phoneNumber,
                SchoolOrCollege: user.schoolOrCollege,
                SchoolName: user.schoolName || '',
                CollegeName: user.collegeName || '',
                Class: user.schoolClass || user.collegeClass || '',
                PaymentStatus: user?.payment?.status,
                TransactionId: user?.payment?.transactionId || '',
                paymentImage: user?.payment?.paymentImage || '',
                PaymentAmount: user?.payment?.amount,
                PhysicalVerificationStatus: user?.physicalVerification?.status ? "Verified" : "Unverified",
                EventId: user.eventId,
                EventTitle: user.eventTitle,
            };
        }
    });

    const exportToXlsx = () => {
        if (!users) {
            toast.error("No users found to export.");
            return;
        }
        const ws = XLSX.utils.json_to_sheet(exportData!);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'UserEvents');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `user_events_${id}.xlsx`);
    };

    useEffect(() => {
        setFilter({
            ...filter,
            paymentStatus: paymentStatus || "",
            physicalVerification: physicalVerification || "",
        });
    }, [searchParams]);

    const updateParams = (newParams: any) => {
        const params = { ...Object.fromEntries(searchParams.entries()), ...newParams };
        setSearchParams(params, { replace: true });
    };

    useEffect(() => {
        const queryParams = [
            filter.paymentStatus && `paymentStatus=${filter.paymentStatus}`,
            filter.physicalVerification && `physicalVerification=${filter.physicalVerification}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            const link = `${import.meta.env.VITE_BASE_URL}/admins/users/event/${id}?${queryParams}`;
            fetchUsers(link);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(delayDebounce);
    }, [id, filter]);

    useEffect(() => {
        if (open) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [open]);

    const handleUpdatePhysicalVerfication = async (eventId: string, userId: string) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admins/events/check/physical/${userId}/${eventId}`, { withCredentials: true });
            toast.success(data?.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleUpdatePaymentVerfication = async (eventId: string, userId: string) => {
        if (selectedOption === "") {
            toast.warning("Please select a status");
            return;
        }
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admins/events/check/payment/${userId}/${eventId}`, { paymentStatus: selectedOption }, { withCredentials: true });
            toast.success(data?.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDeleteUserEvent = async (eventId: string, userId: string) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admins/events/delete/${userId}/${eventId}`, { withCredentials: true });
            toast.success(data?.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="w-full md:w-[60%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-semibold text-indigo-600 mb-4 underline">Event: {event || id}</h1>
                <div>
                    <Button onClick={exportToXlsx}>Export Data</Button>
                </div>
                <h3 className="text-xl font-medium">Registered Users: {count}</h3>
                <div className="flex flex-wrap justify-evenly items-center gap-5 space-y-4 py-6 px-4 md:px-6 xl:px-7.5">
                    <div className="inline-flex items-center cursor-pointer gap-4">
                        <select
                            className="text-black px-2 py-1 rounded-md border-2"
                            value={filter.paymentStatus}
                            onChange={(e) => {
                                setFilter({ ...filter, paymentStatus: e.target.value });
                                updateParams({ paymentStatus: e.target.value });
                            }}
                        >
                            <option value="">ALL</option>
                            <option value="PENDING">PENDING</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="VERIFIED">VERIFIED</option>
                        </select>
                        <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Payment Status</label>
                    </div>
                    <div className="inline-flex items-center cursor-pointer gap-4">
                        <select
                            className="text-black px-2 py-1 rounded-md border-2"
                            value={filter.physicalVerification}
                            onChange={(e) => {
                                setFilter({ ...filter, physicalVerification: e.target.value });
                                updateParams({ physicalVerification: e.target.value });
                            }}
                        >
                            <option value="">ALL</option>
                            <option value="true">TRUE</option>
                            <option value="false">FALSE</option>
                        </select>
                        <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Physical Verification</label>
                    </div>
                </div>

                {open && (
                    <>
                        {!currentUser ? (
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
                                                if (selectedOption) {
                                                    setSelectedOption("");
                                                }
                                                setCurrentUser(null);
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
                                                disabled={currentUser?.physicalVerification?.status}
                                                onClick={() => {
                                                    const userId = (currentUser?.members && currentUser?.members?.length > 0) ? currentUser.leader?._id : currentUser.userId;
                                                    handleUpdatePhysicalVerfication(currentUser.eventId, userId!)
                                                }}
                                            >
                                                Verify User Physically
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <p className="text-lg font-semibold">Paymnet Verification:</p>
                                            <select
                                                className="text-black px-2 py-1 rounded-md border-2"
                                                value={selectedOption}
                                                onChange={(e) => setSelectedOption(e.target.value)}
                                            >
                                                <option value="" disabled>Select an Option</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="SUBMITTED">SUBMITTED</option>
                                                <option value="VERIFIED">VERIFIED</option>
                                            </select>
                                            <Button
                                                className="py-1"
                                                disabled={currentUser?.payment?.status === "VERIFIED" || selectedOption === ""}
                                                onClick={() => {
                                                    const userId = (currentUser?.members && currentUser?.members?.length > 0) ? currentUser.leader?._id : currentUser.userId;
                                                    handleUpdatePaymentVerfication(currentUser.eventId, userId!)
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
                                                    const userId = (currentUser?.members && currentUser?.members?.length > 0) ? currentUser.leader?._id : currentUser.userId;
                                                    handleDeleteUserEvent(currentUser.eventId, userId!)
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

                {loading ? (
                    <div>
                        Loading...
                    </div>
                ) : users?.map((event, index) => (
                    <div key={index} className="mt-4 w-full md:w-[90%] mx-auto">
                        <div
                            onClick={() => {
                                setOpen(true);
                                setSelectedOption(event?.payment?.status);
                                setCurrentUser(event);
                            }}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-200"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                {event?.members && event?.members?.length > 0 ? (
                                    <div>
                                        <h1 className="text-2xl text-orange-500 font-semibold">Group</h1>
                                        <p><strong>Leader Name:</strong> {event?.leader?.firstName}{event?.leader?.lastName}</p>
                                        <p><strong>Leader Email:</strong> {event?.leader?.email}</p>
                                        <p><strong>Leader Phone:</strong> {event?.leader?.phoneNumber}</p>
                                        {event?.members.map((member, index) => (
                                            <p key={index}><strong>Member{index + 1}:</strong> {member?.firstName} {member?.lastName}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-2xl text-indigo-500 font-semibold">Individual</h1>
                                        <p><strong>Name:</strong> {event.firstName} {event.lastName}</p>
                                        <p><strong>Email:</strong> {event.email}</p>
                                        <p><strong>Phone:</strong> {event.phoneNumber}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <h2 className="text-md font-semibold underline">Payment Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <strong>Status:</strong>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event?.payment?.status === "PENDING" ? "bg-yellow-500" : event?.payment?.status === "SUBMITTED" ? "bg-green-500" : "bg-blue-500"} text-white`}>
                                            {event?.payment?.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Transaction ID:</strong>{event?.payment?.transactionId}</p>
                                        <p><strong>Verifier:</strong> {event?.payment?.verifierId}</p>
                                        <p><strong>Amount:</strong> ₹ {event?.payment?.amount}</p>
                                        {event?.payment?.paymentImage && (
                                            <Link onClick={(e) => e.stopPropagation()} to={event?.payment?.paymentImage} target="blank" className="mt-2 flex items-center gap-4"><strong>Payment ScreenShot:</strong> <img className="h-10 w-10 rounded-lg" src={event?.payment?.paymentImage} alt={event?.payment?.transactionId} /></Link>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-md font-semibold underline">Phyiscal Verification Details</h2>
                                    <div className="mt-2 flex flex-wrap items-center space-x-2 max-sm:space-y-2">
                                        <strong>Status:</strong>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event?.physicalVerification?.status ? "bg-green-500" : "bg-red-500"} text-white`}>
                                            {event?.physicalVerification?.status?.toString().toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Verifier:</strong> {event?.physicalVerification?.verifierId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UsersInEvents;