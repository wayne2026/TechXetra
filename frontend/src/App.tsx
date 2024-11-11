import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/better/error-boundary";
import ProtectedRoute from "../components/better/protected-routes";
import { useUser } from "./context/user_context";
import { toast, ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";

import Events_Page from './pages/Events_Page'
import Verify from "./pages/verify";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/not-found";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/reset";
import axios from "axios";
import { useState } from "react";
import Krafton from "./pages/kraft";

const ChatAssistant = lazy(() => import("../components/better/assitant"));

function App() {
	const userContext = useUser();
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleLogOut = async () => {
		setLoading(true);
		try {
			await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true });
			userContext?.setUser(null);
			navigate("/login");
			toast.success("Logged Out");
		} catch (error: any) {
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
	}

	return userContext?.loading ? (
		<div className="bg-black h-screen flex justify-center items-center">
			<img src="/TechXetraLogo1.png" width={400} />
		</div>
	) : (
		<div>
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			{!["/login", "/register", "/verify"].includes(location.pathname) && userContext?.user && !userContext?.user?.isVerified && (
				<div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
					<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
						<div className='flex flex-col justify-center space-y-4 items-center text-xl'>
							<p className="text-lg font-semibold">Please verify your email to access resources.</p>
							<Link className="underline italic text-blue-500" to="/verify">Verify Here</Link>
							<button disabled={loading} onClick={handleLogOut} className="px-3 py-2 bg-red-500 text-white rounded-lg">{loading ? "Hold on..." : "Logout"}</button>
							<Link className="underline italic text-blue-500" to="/register">Go To Regsiter</Link>
							<Link className="underline italic text-blue-500" to="/login">Go To Login</Link>
						</div>
					</div>
				</div>
			)}
			<ErrorBoundary>
				{!["/sponsor/krafton"].includes(location.pathname) && (
					<Suspense fallback={<div>Loading Chat Assistant...</div>}>
						<div
							className="z-[60] fixed bottom-8 right-8 bg-gray-900 text-white p-2 rounded-md"
						>
							<ChatAssistant />
						</div>
					</Suspense>
				)}
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/reset" element={<ResetPassword />} />
					<Route path="/sponsor/krafton" element={<Krafton />} />

					<Route
						element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/login" />}
					>
						<Route path="/verify" element={<Verify />} />
						<Route path="/event" element={<Events_Page />} />
						<Route path="/profile" element={<Profile />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</ErrorBoundary>
		</div>
	);
}

export default App;
