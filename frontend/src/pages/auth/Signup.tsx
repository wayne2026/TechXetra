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
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [college, setCollege] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // For image preview

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
			const { accessToken, refreshToken, user } = response.data;

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
					className="w-full h-full flex justify-center items-center"
				>
					<form className="border-[0.5px] border-slate-700 rounded-lg mx-auto w-[28rem] pt-6 pb-10 px-4 text-white max-w-[90vw] grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="col-span-2 text-center pb-4">
							<p>Welcome to the official website of</p>
							<p className="font-bold">TechXetra</p>
						</div>

						{/* Display error message */}
						{errorMessage && (
							<div className="col-span-2 text-red-500 text-center mb-4">
								{errorMessage}
							</div>
						)}

						{/* First Name */}
						<div>
							<label
								htmlFor="firstName"
								className="pb-1 text-slate-400"
							>
								First Name
							</label>
							<input
								type="text"
								id="firstName"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="John"
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
							/>
						</div>

						{/* Last Name */}
						<div>
							<label
								htmlFor="lastName"
								className="pb-1 text-slate-400"
							>
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="Doe"
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
							/>
						</div>

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="pb-1 text-slate-400"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="example@example.com"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="pb-1 text-slate-400"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="********"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
						</div>

						{/* Confirm Password */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="pb-1 text-slate-400"
							>
								Confirm Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="********"
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								value={confirmPassword}
							/>
						</div>

						{/* College */}
						<div>
							<label
								htmlFor="college"
								className="pb-1 text-slate-400"
							>
								College/University
							</label>
							<input
								type="text"
								id="college"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="Harvard"
								onChange={(e) => setCollege(e.target.value)}
								value={college}
							/>
						</div>

						{/* Phone Number */}
						<div>
							<label
								htmlFor="phoneNumber"
								className="pb-1 text-slate-400"
							>
								Phone Number
							</label>
							<input
								type="text"
								id="phoneNumber"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								placeholder="+1 123-456-7890"
								onChange={(e) => setPhoneNumber(e.target.value)}
								value={phoneNumber}
							/>
						</div>

						{/* Avatar */}
						<div className="col-span-2 flex flex-col items-center">
							<label
								htmlFor="avatar"
								className="pb-1 text-slate-400"
							>
								Upload Avatar
							</label>
							<input
								type="file"
								id="avatar"
								className="w-full py-1 bg-slate-500 rounded-md pl-2"
								onChange={handleAvatarChange}
							/>
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

						<div className="col-span-2 flex justify-center pt-8">
							<button
								type="button"
								className="w-full py-2 rounded-md bg-gray-900 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-gray-800"
								onClick={handleSignup}
							>
								Sign Up
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
