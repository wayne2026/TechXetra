import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import OtpInput from "../../components/better/otp-input";
import { useUser } from "../context/user_context";

const Verify = () => {

    const navigate = useNavigate();
    const userContext = useUser();
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);

    const onOtpSubmit = async (otp: string) => {
        setVerifyLoading(true);
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/verify`, { otp }, { withCredentials: true });
            userContext?.setUser(data.user);
            toast.success("User Verified!");
            navigate("/profile");
        } catch (error: any) {
            userContext?.setUser(null);
            toast.error(error.response.data.message);
        }
        setVerifyLoading(false);
    };

    const requestVerification = async () => {
        setRequestLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/request/verify`, { withCredentials: true });
            toast.success("OTP Sent");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setRequestLoading(false);
    }

    return (
        <div className="w-full max-w-md px-12 p-4 m-auto mx-auto mt-32 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center space-y-3 mt-4 mx-auto">
                <h1 className='text-4xl font-bold'>Verify OTP</h1>
                <p className='text-md text-gray-600 italic'>OTP was sent to {userContext?.user?.email}</p>
            </div>
            <div className="max-h-screen mt-8 flex justify-center items-center space-x-2">
                <OtpInput length={6} disabled={verifyLoading} onOtpSubmit={onOtpSubmit} />
            </div>
            <div className="text-center mt-8 mb-8">
                <button disabled={requestLoading} onClick={requestVerification} className="text-white tracking-wide text-md font-medium px-6 py-3 capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                    {requestLoading ? "Hold on..." : "Reset OTP"}
                </button>
            </div>
        </div>
    )
}

export default Verify;