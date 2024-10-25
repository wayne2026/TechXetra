import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiMenu3Line } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { useUser } from "@/context/user_context";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navbarContent = [
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Events", path: "/events" },
    { label: "Announcement", path: "/announcements" },
]

const Navbar = () => {
    const userContext = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true });
            userContext?.setUser(null);
            toast.success("User Logged Out Successfully");
            navigate("/login");
            if (mobileMenuOpen === true) setMobileMenuOpen(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [mobileMenuOpen]);

    return (
        <header className="bg-white border-b-2 fixed top-0 left-0 right-0 z-50">
            <nav className="mx-auto flex w-full md:max-w-[80%] items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to='/' className="flex items-center justify-center">
                        <img className="w-auto h-12" src="/techxetra-text.svg" alt="" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    {userContext?.user ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <RiMenu3Line className="h-6 w-6" aria-hidden="true" />
                        </Button>
                    ) : (
                        <Button><Link to="/login">Login</Link></Button>
                    )}
                </div>
                <div className="hidden text-gray-600 lg:flex lg:gap-x-12">
                    {navbarContent.map((data, index) => (
                        <Link key={index} to={data.path} className="text-md font-semibold leading-6">
                            {data.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {userContext?.user ? (
                        <div onClick={() => navigate("/profile")} className="flex items-center gap-5">
                            <p className="hidden cursor-pointer sm:block text-md">{userContext?.user?.firstName}</p>
                            <Avatar>
                                <AvatarImage src={userContext?.user?.avatar} alt={userContext?.user?.firstName} />
                                <AvatarFallback>{`${userContext?.user?.firstName[0].toUpperCase()}${userContext?.user?.lastName[0].toUpperCase()}`}</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <button className='px-5 py-2 border-2 border-gray-500 font-semibol rounded-md text-md'><Link to="/login">Login</Link></button>
                    )}
                </div>
            </nav>

            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="hide-scrollbar h-screen lg:hidden fixed inset-0 bg-opacity-30 backdrop-blur z-10"
                >
                    <aside className="flex flex-col w-64 h-screen px-6 py-3 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
                        <Link to='/' className="flex items-center">
                            <img className="w-auto h-12" src="/techxetra-text.svg" alt="" />
                        </Link>

                        <div className="flex flex-col justify-between flex-1 mt-1">
                            <nav>
                                <hr className="my-4 border-gray-200 " />
                                {navbarContent.map((data, index) => (
                                    <Link key={index} to={data.path} className={`flex items-center px-4 py-3 rounded-md ${location.pathname === `${data.path}` ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                        <span className="mx-2 font-medium">{data.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className='pb-10'>
                                {userContext?.user ? (
                                    <div className="flex items-center justify-between px-4 -mx-2">
                                        <Link to="/profile" className='flex items-center'>
                                            <Avatar>
                                                <AvatarImage src={userContext?.user?.avatar} alt={userContext?.user?.firstName} />
                                                <AvatarFallback>{`${userContext?.user?.firstName[0].toUpperCase()}${userContext?.user?.lastName[0].toUpperCase()}`}</AvatarFallback>
                                            </Avatar>
                                            <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">{userContext?.user.firstName}</span>
                                        </Link>
                                        <IoIosLogOut onClick={logout} className="object-cover mx-2 rounded-full h-6 w-6" />
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-gray-200">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </header>
    )
}

export default Navbar;