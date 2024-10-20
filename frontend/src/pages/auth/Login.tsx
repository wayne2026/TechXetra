import { useRef, useState, useEffect } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShootingStars } from "../../../components/ShootingStars";
import { useUser } from "../../context/user_context";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const starsBG = useRef<HTMLDivElement>(null);
  const formDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userContext = useUser();
  const from = location.state?.from?.pathname || "/profile";
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    gsap.to("img.animate", {
      y: "random(-20,20)",
      x: "random(-20,20)",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 2,
    });

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  useGSAP(() => {
    gsap.from(starsBG.current, {
      opacity: 0,
      delay: 0.6,
      duration: 0.3,
    });
  }, [starsBG]);

  useGSAP(() => {
    gsap.from(formDiv.current, {
      y: -10,
      opacity: 0,
      delay: 0.67,
      duration: 0.3,
    });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    if (!email || !password) {
      toast.warning("All fields are required");
      return;
    }
    try {
      const payload = {
        email,
        password,
      };
      const { data }: { data: UserResponse } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        payload,
        config
      );
      userContext?.setUser(data.user);
      toast.success("Logged In!");
      navigate(from, { replace: true });
    } catch (error: any) {
      userContext?.setUser(null);
      toast.error(error.response.data.message);
      setLoginLoading(false);
    }
    setLoginLoading(false);
  };

  const handleToggleShowPassword = () => {
    if (showPassword === true) {
      setShowPassword(false);
    } else if (showPassword === false) {
      setShowPassword(true);
    }
  };

  return (
    <div className="w-full bg-black mx-auto h-screen overflow-hidden">
      <div ref={starsBG} className="w-full h-full">
        <StarsBackground
          starDensity={0.0009}
          allStarsTwinkle
          twinkleProbability={0.9}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute bg-gradient-to-b from-[#000000] via-[#220135] to-[#020b22]"
        />
        <ShootingStars />
        <div
          ref={formDiv}
          className="w-full h-full flex justify-center items-center"
        >
          <img
            src="finalmc.png"
            width={400}
            alt=""
            className="animate max-md:hidden"
          />
          <form
            onSubmit={handleSubmit}
            className="border-[0.5px] border-slate-700 rounded-lg mx-auto w-[40rem] pt-6 pb-10 text-white"
          >
            <div className="w-full pt-6 pb-4">
              <p className="w-full  flex justify-center font-originTech text-[0.8rem]">
                Welcome to the official website of
              </p>
              <p className="w-full flex justify-center font-bold font-techno text-[1.5rem] text-violet-700">
                <Link to="/" >TechXetra</Link>
              </p>
            </div>
            <div className="sm:p-5 p-3">
              <div className="mx-auto w-full md:w-[80%] flex flex-col gap-2 pt-4">
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="email"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full outline-none py-2 bg-slate-500 rounded-md pl-2"
                    placeholder="example@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="password"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    Password
                  </label>
                  <div className="flex flex-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full outline-none py-2 bg-slate-500 rounded-l-md pl-2"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      value={password}
                    />
                    <button
                      type="button"
                      className="flex justify-center items-center rounded-r-md hover:cursor-pointer bg-slate-500 py-2 px-4"
                      onClick={handleToggleShowPassword}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-36 bg-white-600 mt-6 py-2 rounded-lg font-bold bg-violet-700"
                disabled={loginLoading}
              >
                {loginLoading ? "Loading..." : "Log in"}
              </button>

            </div>

            {/* Switch to Login */}
            <div className="mt-4 text-center">
              <p className="text-md">
                Already have an account?{" "}
                <Link to="/register" className="text-violet-400 hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </form>
          <img
            src="mascot-bg.png"
            width={400}
            alt=""
            className="animate max-md:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
