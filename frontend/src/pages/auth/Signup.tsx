import { useRef, useState } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setToken, setUser }: { setToken: any; setUser: any }) => {
	const starsBG = useRef<HTMLDivElement>(null);
	const formDiv = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	// Form state
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [college, setCollege] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");

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
			!username ||
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
			// Send signup request to the backend
			const registerResponse = await axios.post(
				"http://localhost:3000/api/v1/user/register",
				{
					avatar: "Ayatar",
					username,
					email,
					password,
					"college/university": college,
					phone_number: phoneNumber,
				}
			);
			console.log(registerResponse.data);

			// Log in the user immediately after registration
			const loginResponse = await axios.post(
				"http://localhost:3000/api/v1/user/login",
				{
					email,
					password,
				}
			);
			console.log(loginResponse.data);

			// Set token and user data
			setToken(loginResponse.data.accessToken);
			setUser(loginResponse.data.user);

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
				<div
					ref={formDiv}
					className="w-full h-full flex justify-center items-center"
				>
					<form
						action=""
						method="post"
						className="border-[0.5px] border-slate-700 rounded-lg mx-auto w-[25rem] pt-6 pb-10 px-4 text-white"
					>
						<div className="w-full pb-4">
							<p className="w-full flex justify-center">
								Welcome to the official website of
							</p>
							<p className="w-full flex justify-center font-bold">
								TechXetra
							</p>
						</div>

						{/* Display error message */}
						{errorMessage && (
							<div className="w-[80%] text-red-500 text-center mx-auto mb-4">
								{errorMessage}
							</div>
						)}

						<div className="w-full flex justify-center items-center">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="username"
									className="pb-1 text-slate-400"
								>
									Username
								</label>
								<input
									type="text"
									id="username"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="Tyler"
									onChange={(e) =>
										setUsername(e.target.value)
									}
									value={username}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-4">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="email"
									className="pb-1 text-slate-400"
								>
									Email Address
								</label>
								<input
									type="email"
									id="email"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="example@example.com"
									onChange={(e) => setEmail(e.target.value)}
									value={email}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-4">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="password"
									className="pb-1 text-slate-400"
								>
									Password
								</label>
								<input
									type="password"
									id="password"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="********"
									onChange={(e) =>
										setPassword(e.target.value)
									}
									value={password}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-4">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="confirmPassword"
									className="pb-1 text-slate-400"
								>
									Confirm Password
								</label>
								<input
									type="password"
									id="confirmPassword"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="********"
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									value={confirmPassword}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-4">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="college"
									className="pb-1 text-slate-400"
								>
									College/University
								</label>
								<input
									type="text"
									id="college"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="Harvard"
									onChange={(e) => setCollege(e.target.value)}
									value={college}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-4">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor="phoneNumber"
									className="pb-1 text-slate-400"
								>
									Phone Number
								</label>
								<input
									type="text"
									id="phoneNumber"
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="+1234567890"
									onChange={(e) =>
										setPhoneNumber(e.target.value)
									}
									value={phoneNumber}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-8">
							<button
								type="button"
								className="w-[80%] px-4 py-1 rounded-md bg-gray-900 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-gray-800"
								onClick={handleSignup}
							>
								Signup
							</button>
							<button
								className="w-[80%] px-4 py-1 rounded-md bg-gray-900 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-gray-800"
								onClick={() => navigate("/login")}
							>
								Go to Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
