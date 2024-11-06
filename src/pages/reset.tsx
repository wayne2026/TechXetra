import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/user_context";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const token = search.get("token");
    const user = search.get("user");
    const userContext = useUser();
    const [resetLoading, setResetLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resetData = {
            ...password,
            user,
        }
        if (!token) {
            toast.error("Invalid Token");
            return;
        }
        setResetLoading(true);
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/password/reset/${token}`, resetData, config);
            userContext?.setUser(data.user);
            toast.success("Password Reset Successfully");
            navigate("/profile");
        } catch (error: any) {
            userContext?.setUser(null);
            toast.error(error.response.data.message);
        }
        setResetLoading(false);
    }

    const handleToggleShowPassword = () => {
        if (showPassword === true) {
            setShowPassword(false);
        } else if (showPassword === false) {
            setShowPassword(true);
        }
    };

    const handleToggleConfirmPassword = () => {
        if (showConfirmPassword === true) {
            setShowConfirmPassword(false);
        } else if (showConfirmPassword === false) {
            setShowConfirmPassword(true);
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="container flex flex-col items-center justify-center mt-12 px-6 mx-auto">
                <div className="flex justify-center mx-auto">
                    <img src="/TechXetraLogo1.png" className="w-auto h-7 sm:h-8" alt="" />
                </div>

                <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 capitalize md:text-3xl dark:text-white">
                    Reset Password
                </h1>

                <div className="w-full max-w-md mx-auto mt-6">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block my-2 text-lg font-semibold text-gray-600 dark:text-gray-200">New Password</label>
                            <div className="relative flex flex-row">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    className="block w-full px-5 py-3 mt-2 pr-12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={password.newPassword}
                                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-4 flex items-center"
                                    onClick={handleToggleShowPassword}
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />} 
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block my-2 text-lg font-semibold text-gray-600 dark:text-gray-200">Confirm Password</label>
                            <div className="relative flex flex-row">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter your password again"
                                    className="block w-full px-5 py-3 mt-2 pr-12 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={password.confirmPassword}
                                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-4 flex items-center"
                                    onClick={handleToggleConfirmPassword}
                                >
                                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <button disabled={resetLoading} type="submit" className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            {resetLoading ? "Hold on" : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword;