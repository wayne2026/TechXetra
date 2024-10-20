/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { ShootingStars } from "../../../components/ShootingStars";
import { useUser } from "../../context/user_context";
import { toast } from "react-toastify";

const Register = () => {
  const starsBG = useRef<HTMLDivElement>(null);
  const formDiv = useRef<HTMLDivElement>(null);

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
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [schoolOrCollege, setSchoolOrCollege] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [schoolName, setSchoolName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [collegeClass, setCollegeClass] = useState("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const userContext = useUser();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !schoolOrCollege ||
      !phoneNumber
    ) {
      toast.warning("All fields are required");
      return;
    }
    if (schoolOrCollege === "") {
      toast.warning("School or College name is required");
      return;
    }
    if (schoolOrCollege === "SCHOOL" && (!schoolName || !schoolClass)) {
      toast.warning("School name and class are required");
      return;
    }
    if (schoolOrCollege === "COLLEGE" && (!collegeName || !collegeClass)) {
      toast.warning("College name and class are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("schoolOrCollege", schoolOrCollege);
      formData.append("phoneNumber", phoneNumber);
      if (schoolOrCollege === "SCHOOL") {
        formData.append("schoolName", schoolName);
        formData.append("schoolClass", schoolClass);
      } else if (schoolOrCollege === "COLLEGE") {
        formData.append("collegeName", collegeName);
        formData.append("collegeClass", collegeClass);
      } else {
        toast.warning("All fields are required");
        return;
      }
      const { data }: { data: UserResponse } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        formData,
        config
      );
      userContext?.setUser(data.user);
      toast.success("Logged In!");
      navigate("/verify", { replace: true });
    } catch (error: any) {
      userContext?.setUser(null);
      toast.error(error.response.data.message);
      setLoginLoading(false);
    }
    setLoginLoading(false);
  };

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
    <div className="w-screen h-screen bg-black mx-auto border-2  ">
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
          className="w-full h-screen max-sm:pb-20 max-sm:pt-20 max-sm:overflow-y-scroll flex justify-center m-auto items-center "
        >
          <img
            src="finalmc.png"
            alt=""
            width={350}
            className="animate max-md:hidden"
          />
          <form
            onSubmit={handleSubmit}
            className="border-[0.5px]  border-slate-700 rounded-lg mx-auto w-[40rem] pt-6 pb-10 text-white"
          >
            <div className={`w-full ${schoolOrCollege ? 'max-sm:pt-40' : ''} pb-4`}>
              <p className="w-full flex justify-center font-originTech text-[0.8rem]">
                Welcome to the official website of
              </p>
              <p className="w-full flex justify-center font-bold font-techno text-[1.5rem] text-violet-700">
                <Link to="/" >TechXetra</Link>
              </p>
            </div>
            <div className="sm:p-5 p-3">
              {/* Input Fields */}
              <div className="w-full flex flex-col gap-2 sm:flex-row">
                {/* First Name */}
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full outline-none py-2 bg-slate-500 rounded-md pl-2"
                    placeholder="John"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </div>

                {/* Last Name */}
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full outline-none py-2 bg-slate-500 rounded-md pl-2"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </div>
              </div>

              {/* Email and Password */}
              <div className="w-full flex flex-col gap-2 sm:flex-row pt-4">
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="email"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
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
                      id="password"
                      className="w-full outline-none py-2 bg-slate-500 rounded-l-md pl-2"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder="******"
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

              {/* Confirm Password and Phone Number */}
              <div className="w-full flex flex-col gap-2 sm:flex-row pt-4">
                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="md:pb-1 max-xl:text-sm text-white-600 font-originTech"
                  >
                    Confirm Password
                  </label>
                  <div className="flex flex-row">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full outline-none py-2 bg-slate-500 rounded-l-md pl-2"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      placeholder="*******"
                    />
                    <button
                      type="button"
                      className="flex justify-center items-center rounded-r-md hover:cursor-pointer bg-slate-500 py-2 px-4"
                      onClick={handleToggleConfirmPassword}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="phoneNumber"
                    className="pb-1 text-white-600 font-originTech"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="phoneNumber"
                    className="w-full  outline-none py-2 bg-slate-500 rounded-md pl-2"
                    placeholder="9999933333"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                  />
                </div>
              </div>

              {/* School/College Selection */}
              <div className="w-full flex flex-col pt-4">
                <label
                  htmlFor="college"
                  className="pb-1 text-white-600 font-originTech"
                >
                  School/College/University
                </label>
                <select
                  name="institutionName"
                  value={schoolOrCollege}
                  className="w-full text-slate-200 py-2.5 rounded-md bg-slate-400 pl-1"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    e.preventDefault();
                    setSchoolOrCollege(e.target.value);
                  }}
                >
                  <option value="">Choose an option</option>
                  <option value="SCHOOL">School</option>
                  <option value="COLLEGE">College/University</option>
                </select>
              </div>

              {/* School or College Details */}
              {schoolOrCollege === "SCHOOL" && (
                <div className="w-full flex flex-col sm:flex-row gap-2 pt-4">
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="schoolName"
                      className="pb-1 text-white-600 font-originTech"
                    >
                      School Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      className=" outline-none py-2 bg-slate-500 rounded-md pl-2"
                      onChange={(e) => setSchoolName(e.target.value)}
                      value={schoolName}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="schoolClass"
                      className="pb-1 text-white-600 font-originTech"
                    >
                      Class Range
                    </label>
                    <div className="">
                      <select
                        name="classRange"
                        value={schoolClass}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          e.preventDefault();
                          setSchoolClass(e.target.value);
                        }}
                        className="w-full text-slate-200 py-2.5 rounded-md bg-slate-400 pl-1"
                      >
                        <option value="">Choose an Option</option>
                        <option value="ONE_TO_FOUR">Class 1-4</option>
                        <option value="FIVE_TO_EIGHT">Class 5-8</option>
                        <option value="NINE_TO_TWELVE">Class 9-12</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {schoolOrCollege === "COLLEGE" && (
                <div className="w-full flex flex-col sm:flex-row gap-2 pt-4">
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="collegeName"
                      className="pb-1 text-white-600 font-originTech"
                    >
                      College Name
                    </label>
                    <input
                      type="text"
                      id="collegeName"
                      className=" outline-none py-2 bg-slate-500 rounded-md pl-2"
                      onChange={(e) => setCollegeName(e.target.value)}
                      value={collegeName}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="collegeClass"
                      className="pb-1 text-white-600 font-originTech"
                    >
                      Graduate level
                    </label>
                    <div className="">
                      <select
                        name="classRange"
                        value={collegeClass}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          e.preventDefault();
                          setCollegeClass(e.target.value);
                        }}
                        className="w-full text-slate-200 py-2.5 rounded-md bg-slate-400 pl-1"
                      >
                        <option value="">UG/PG</option>
                        <option value="UG">UG</option>
                        <option value="PG">PG</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-36 bg-white-600 mt-6 py-2 rounded-lg font-bold bg-violet-700"
                disabled={loginLoading}
              >
                {loginLoading ? "Loading..." : "Register"}
              </button>

            </div>

            {/* Switch to Login */}
            <div className="mt-4 text-center">
              <p className="text-md">
                Already have an account?{" "}
                <Link to="/login" className="text-violet-400 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
          <img
            src="mascot-bg.png"
            alt=""
            width={350}
            className="animate max-md:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
