import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import About from "./pages/About";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminPanel from "./pages/Admin";
import axios from "axios";

function App() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState<string | null>(null); // Holds accessToken
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// Utility to get cookies by name
	const getCookie = (name: string) => {
		const cookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith(name));
		return cookie ? cookie.split("=")[1] : null;
	};

	// This effect runs on page load to check login state
	useEffect(() => {
		const checkLoginStatus = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/api/v1/users/me",
					{ withCredentials: true }
				);
				setUser(response.data.user); // If the user is authenticated
				setToken(getCookie("accessToken")); // Update token state from cookies
			} catch (error) {
				console.error("User not authenticated", error);
			}
			setIsLoading(false);
		};

		checkLoginStatus();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
		navigate("/login");
	};

	// Axios interceptor for handling failed requests
	useEffect(() => {
		const axiosInterceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response && error.response.status === 401) {
					handleLogout(); // Log out on 401 error
				}
				return Promise.reject(error);
			}
		);

		return () => axios.interceptors.response.eject(axiosInterceptor);
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<Routes>
				<Route path="/" element={<Landing user={user} />} />
				<Route
					path="/login"
					element={<Login setToken={setToken} setUser={setUser} />}
				/>
				<Route
					path="/signup"
					element={<Signup setToken={setToken} setUser={setUser} />}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute user={user}>
							{/* <Profile user={user} /> */}
							<Profile user={user} handleLogout={handleLogout} />
						</ProtectedRoute>
					}
				/>
				<Route path="/admin" element={<AdminPanel />} />
			</Routes>
			<About />
			<Events />
		</>
	);
}

export default App;
