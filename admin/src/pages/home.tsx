import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user_context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomePage = () => {

    const userContext = useUser();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true });
            userContext?.setUser(null);
            toast.success("User Logged Out Successfully");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="w-full md:w-[60%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            {userContext?.user ? (
                <div>
                    <p className="text-2xl font-semibold">Welcome, {userContext.user.firstName} {userContext.user.lastName}</p>
                </div>
            ) : (
                <Button onClick={logout}>Logout</Button>
            )}
        </div>
    )
}

export default HomePage;