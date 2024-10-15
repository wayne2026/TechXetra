/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Signup = ({ setToken, setUser }: { setToken: any; setUser: any }) => {
  const starsBG = useRef<HTMLDivElement>(null);
  const formDiv = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // For image preview

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Error state
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleSignup = async () => {
    setErrorMessage(""); // Clear previous error messages

    // Client-side validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !college ||
      !phoneNumber
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // FormData to handle file upload (avatar)
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("college", college);
      formData.append("phoneNumber", phoneNumber);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      // Send signup request to the backend
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);

      // Extract tokens from response
      const { accessToken, user } = response.data;

      // Store tokens and user data in the app
      setToken(accessToken);
      setUser(user);

      // Redirect to the profile page
      navigate("/profile");
    } catch (error: any) {
      // Handle server-side errors
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setErrorMessage(
          "Something went wrong. Please check your connection and try again."
        );
      }
    }
  };

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

  // Handle avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  return (
    <div className="w-full bg-black mx-auto min-h-screen overflow-hidden">
      <div ref={starsBG} className="w-full h-full">
        <StarsBackground
          starDensity={0.0009}
          allStarsTwinkle
          twinkleProbability={0.9}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute bg-gradient-to-b from-[#000000] via-[#220135] to-[#020b22]"
        />
        <div
          ref={formDiv}
          className="w-full min-h-screen flex justify-center items-center"
        >
          <form className="border-[0.5px] border-slate-700 rounded-lg mx-auto w-[40rem] pt-6 pb-10 text-white">
            <div className="w-full pb-4">
              <p className="w-full flex justify-center font-originTech text-[0.8rem]">
                Welcome to the official website of
              </p>
              <p className="w-full flex justify-center font-bold font-techno text-[1.5rem]">
                TechXetra
              </p>
            </div>

            {/* Display error message */}
            {errorMessage && (
              <div className="col-span-2 text-red-500 text-center mb-4">
                {errorMessage}
              </div>
            )}

            {/* First Name */}
            <div className="w-full flex flex-row gap-2">
              <div className="basis-1/2 w-full flex justify-center items-center">
                <div className="w-[90%] flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                    placeholder="John"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </div>
              </div>
              <div className="basis-1/2 w-full flex justify-center items-center pr-4">
                <div className="w-[100%] flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    Last Name
                  </label>
                  <input
                    type="email"
                    id="lastName"
                    className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="w-full flex flex-row gap-2 pt-4">
              <div className="basis-1/2 w-full flex justify-center items-center">
                <div className="w-[90%] flex flex-col">
                  <label
                    htmlFor="email"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                    placeholder="example@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>
              <div className="basis-1/2 w-full flex justify-center items-cente pr-4">
                <div className="w-[100%] flex flex-col">
                  <label
                    htmlFor="password"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    Password
                  </label>
                  <div className="w-[100%] flex flex-row">
                    <div className="w-[90%]">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-[100%] py-1 bg-slate-500 rounded-l-md flex justify-start items-center pl-2"
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </div>
                    <div
                      className="w-[10%] flex justify-center items-center rounded-r-md hover:cursor-pointer bg-violet-400"
                      onClick={handleToggleShowPassword}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="" />
                      ) : (
                        <FaEye className="" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full flex flex-row gap-2 pt-4">
              <div className="basis-1/2 w-full flex justify-center items-center">
                <div className="w-[90%] flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    Confirm Password
                  </label>
                  <div className="w-[100%] flex flex-row">
                    <div className="w-[90%]">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="password"
                        className="w-[100%] py-1 bg-slate-500 rounded-l-md flex justify-start items-center pl-2"
                        placeholder="********"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                      />
                    </div>
                    <div
                      className="w-[10%] flex justify-center items-center rounded-r-md hover:cursor-pointer bg-violet-400"
                      onClick={handleToggleConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="" />
                      ) : (
                        <FaEye className="" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-1/2 w-full flex justify-center items-center pr-4">
                <div className="w-[100%] flex flex-col">
                  <label
                    htmlFor="phoneNumber"
                    className="pb-1 text-violet-500 font-originTech"
                  >
                    Phone Number
                  </label>
                  <input
                    type="email"
                    id="phoneNumber"
                    className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                    placeholder="9999933333"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center pt-4">
              <div className="w-[95%] flex flex-col">
                <label
                  htmlFor="college"
                  className="pb-1 text-violet-500 font-originTech"
                >
                  School/College/University
                </label>
                <div className="w-full">
                  <select
                    name="institutionName"
                    id="institutionName"
                    className="w-full text-slate-200 py-1 rounded-md bg-slate-400 pl-1"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      e.preventDefault();
                      setCollege(e.target.value);
                    }}
                  >
                    <option value="choose" selected>
                      Choose an option
                    </option>
                    <option value="school">School</option>
                    <option value="college">College/University</option>
                  </select>
                </div>
              </div>
            </div>

            {college === "school" && (
              <div className="w-full flex flex-row gap-2 pt-4">
                <div className="basis-1/2 w-full flex justify-center items-center">
                  <div className="w-[90%] flex flex-col">
                    <label
                      htmlFor="username"
                      className="pb-1 text-violet-500 font-originTech"
                    >
                      School Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                      placeholder="name"
                    />
                  </div>
                </div>
                <div className="basis-1/2 w-full flex justify-center items-center pr-4">
                  <div className="w-[100%] flex flex-col">
                    <label
                      htmlFor="email"
                      className="pb-1 text-violet-500 font-originTech"
                    >
                      Class Range
                    </label>
                    <div className="w-full">
                      <select
                        name="classRange"
                        id="classRange"
                        className="w-full text-slate-200 py-1 rounded-md bg-slate-400 pl-1"
                      >
                        <option value="default" selected>
                          Choose an Option
                        </option>
                        <option value="oneToFour">Class 1-4</option>
                        <option value="fiveToEight">Class 5-8</option>
                        <option value="nineToTwelve">Class 9-12</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {college === "college" && (
              <div className="w-full flex flex-row gap-2 pt-4">
                <div className="basis-1/2 w-full flex justify-center items-center">
                  <div className="w-[90%] flex flex-col">
                    <label
                      htmlFor="username"
                      className="pb-1 text-violet-500 font-originTech"
                    >
                      College/University Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
                      placeholder="name"
                    />
                  </div>
                </div>
                <div className="basis-1/2 w-full flex justify-center items-center pr-4">
                  <div className="w-[100%] flex flex-col">
                    <label
                      htmlFor="email"
                      className="pb-1 text-violet-500 font-originTech"
                    >
                      Graduate level
                    </label>
                    <div className="w-full">
                      <select
                        name="classRange"
                        id="classRange"
                        className="w-full text-slate-200 py-1 rounded-md bg-slate-400 pl-1"
                      >
                        <option value="default" selected>
                          UG/PG
                        </option>
                        <option value="ug">UG</option>
                        <option value="pg">PG</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Avatar */}
            <div className="col-span-2 flex flex-col items-center pt-4">
              <div className="w-full">
                <label
                  htmlFor="avatar"
                  className="pb-1 font-originTech text-violet-500 pl-4"
                >
                  Upload Avatar
                </label>
              </div>
              <div className="w-full flex justify-center pt-1">
                <input
                  type="file"
                  id="avatar"
                  className="w-[95%] py-1 bg-slate-500 rounded-md pl-2"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Avatar Preview */}
            {avatarPreview && (
              <div className="col-span-2 flex justify-center pt-4">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-gray-500"
                />
              </div>
            )}

            <div className="w-full flex justify-center items-center pt-8">
              <button
                type="button"
                className="w-[40%] px-4 py-1 rounded-md bg-violet-600 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-violet-800 font-originTech"
                onClick={handleSignup}
              >
                Signup
              </button>
            </div>
            <div className="w-full flex justify-center items-center pt-1">
              <p className="text-sm text-center text-violet-600 font-originTech">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-violet-600 hover:text-violet-300 transition ease-in-out duration-150"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
