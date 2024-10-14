import { useRef, useState } from "react";
import { StarsBackground } from "../../../components/StarBackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setToken, setUser }: { setToken: any; setUser: any }) => {
	const starsBG = useRef<HTMLDivElement>(null);
	const formDiv = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

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

	const handleLogin = async () => {
		if (!email || !password) {
			alert("Please enter email and password");
			return;
		}
		try {
			const axiosResponse = await axios.post(
				"http://localhost:3000/api/v1/user/login",
				{
					email,
					password,
				}
			);
			console.log(axiosResponse.data);
			setToken(axiosResponse.data.accessToken);
			setUser(axiosResponse.data.user);
			navigate("/profile");
		} catch (error) {
			console.error(error);
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
						<div className="w-full flex justify-center items-center">
							<div className="w-[80%] flex flex-col">
								<label
									htmlFor=""
									className="pb-1 text-slate-400"
								>
									Email Address
								</label>
								<input
									type="text"
									name=""
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
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
									className="pb-1 text-slate-400"
								>
									Password
								</label>
								<input
									type="password"
									name=""
									className="w-[100%] py-1 bg-slate-500 rounded-md flex justify-start items-center pl-2"
									placeholder="Siuuuu"
									onChange={(e) =>
										setPassword(e.target.value)
									}
									value={password}
								/>
							</div>
						</div>
						<div className="w-full flex justify-center items-center pt-8">
							<button
								type="button"
								className="w-[80%] px-4 py-1 rounded-md bg-gray-900 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-gray-800"
								onClick={() => {
									console.log(email, password);
									handleLogin();
								}}
							>
								Login
							</button>
							<button
								className="w-[80%] px-4 py-1 rounded-md bg-gray-900 hover:cursor-pointer transform ease-in-out duration-150 hover:bg-gray-800"
								onClick={() => navigate("/signup")}
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

export default Login;
