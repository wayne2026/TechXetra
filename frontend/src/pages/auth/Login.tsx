/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShootingStars } from '../../../components/ShootingStars'

const Login = ({ setToken, setUser }: { setToken: any; setUser: any }) => {
  const starsBG = useRef<HTMLDivElement>(null);
  const formDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  

  useEffect(() => {
    
      gsap.to("img.animate" ,{
        y: 'random(-20,20)',
        x: 'random(-20,20)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 2
      });
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
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

  // Utility to get cookies by name
  const getCookie = (name: string) => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name));
    return cookie ? cookie.split("=")[1] : null;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      const axiosResponse = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(axiosResponse.data);
      setToken(getCookie("accessToken")); // Read the accessToken from the updated cookies
      setUser(axiosResponse.data.user);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(axiosResponse.data.user));

      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Login failed, please try again.");
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
        <ShootingStars/>
        <div
          ref={formDiv}
          className="w-full h-full flex justify-center items-center"
        >
          <img src="finalmc.png"  width={400} alt="" className="animate max-md:hidden"/>
          <form
            action=""
            method="post"
            className="border-[0.5px] border-slate-700 rounded-lg mx-auto w-[25rem] pt-6 pb-10 px-4 text-white"
          >
            <div className="w-full pb-4">
              <p className="w-full flex justify-center font-originTech text-[0.8rem]">
                Welcome to the official website of
              </p>
              <p className="w-full flex justify-center font-bold font-techno text-[2rem] -mt-2">
                TechXetra
              </p>
            </div>
            <div className="w-full flex justify-center items-center">
              <div className="w-[80%] flex flex-col">
                <label
                  htmlFor=""
                  className="pb-1 font-originTech text-violet-600"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  name=""
                  className="w-[100%] outline-none py-1 bg-violet-400 rounded-md flex justify-start items-center pl-2 text-violet-800 placeholder:text-violet-600"
                  placeholder="Tyler"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>
            <div className="w-full flex justify-center items-center pt-4">
              <div className="w-[80%] flex flex-col">
                <label
                  htmlFor=""
                  className="pb-1 font-originTech text-violet-600"
                >
                  Password
                </label>
                <input
                  type="password"
                  name=""
                  className="w-[100%] outline-none py-1 bg-violet-400 rounded-md flex justify-start items-center pl-2 text-violet-800 placeholder:text-violet-600"
                  placeholder="Siuuuu"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
            <div className="w-full flex justify-center items-center pt-8">
              <button
                type="button"
                className="w-[80%] px-4 py-1 rounded-md bg-violet-600 font-originTech hover:cursor-pointer transform ease-in-out duration-150 hover:bg-violet-800"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="w-full flex justify-center items-center pt-1">
              <p className="text-sm text-center text-violet-600 font-originTech">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-violet-600 hover:text-violet-300 transition ease-in-out duration-150"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
          <img src="mascot-bg.png"  width={400} alt="" className="animate max-md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default Login;
