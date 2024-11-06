import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/user_context';

const Navbar = () => {
    const navigate = useNavigate();
    const userContext = useUser();

    return (
        <div className="w-full flex justify-between items-center md:pr-10 md:pl-10 pl-8 pr-8 mt-6 text-white ">
            <div className="">
                <img src="/techxetra-text.svg" width={200} alt="Logo" className="max-sm:w-24 " />
            </div>
            <div className="w-fit  h-fit z-10">
                <button
                    type="button"
                    onClick={() => {
                        if (userContext?.user) {
                            navigate("/profile");
                        } else {
                            navigate("/login");
                        }
                    }}
                >
                    <h1 className="font-originTech sm:text-2xl hover:text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] ">
                        {userContext?.user ? `${userContext?.user?.firstName}` : "Login"}
                    </h1>
                </button>
            </div>
        </div>
    )
}

export default Navbar;