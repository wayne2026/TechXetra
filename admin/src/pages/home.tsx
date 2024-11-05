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
                <div className="flex flex-col gap-4 justify-center items-center">
                    <p className="text-2xl font-semibold">Welcome, {userContext.user.firstName} {userContext.user.lastName}</p>
                    <hr className="w-[90%] md:w-[50%] border border-gray-400" />
                    <div className="flex flex-col gap-4 w-[80%] md:w-[40%]">
                        <h1 className="text-lg font-semibold">Navigations</h1>
                        <Button variant={"outline"} onClick={() => navigate("/login")}>All Users</Button>
                        <Button variant={"outline"} onClick={() => navigate("/login")}>All Events</Button>
                        <Button variant={"outline"} onClick={() => navigate("/login")}>Create New Event</Button>
                        <Button variant={"outline"} onClick={() => navigate("/login")}>Registered Events</Button>
                        <Button variant={"outline"} onClick={() => navigate("/login")}>Payment Verify Pending</Button>
                    </div>
                    <hr className="w-[90%] md:w-[50%] border border-gray-400" />
                    <Button onClick={logout}>Logout</Button>
                </div>
            ) : (
                <Button onClick={() => navigate("/login")}>Login</Button>
            )}
        </div>
    )
}

export default HomePage;