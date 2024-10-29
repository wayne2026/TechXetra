import { Link, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "../components/better/error-boundary";
import ProtectedRoute from "../components/better/protected-routes";
import { useUser } from "./context/user_context";
import { ToastContainer } from "react-toastify";
// import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";

import Events_Page from './pages/Events_Page'
import Verify from "./pages/verify";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/not-found";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/reset";

// const ChatAssistant = lazy(() => import("../components/better/assitant"));

function App() {
	const userContext = useUser();
	const location = useLocation();

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
						<div className='flex flex-col justify-center items-center text-xl'>
							<p>Please verify your email to access resources.</p>
							<Link className="underline italic text-blue-500" to="/verify">Verify Here</Link>
						</div>
					</div>
				</div>
			)}
			<ErrorBoundary>
				{/* <Suspense fallback={null}> */}
					{/* <div
						className="z-[60] fixed bottom-8 right-8 bg-gray-900 text-white p-2 rounded-md"
					>
						<ChatAssistant />
					</div> */}
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/reset" element={<ResetPassword />} />

						<Route
							element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/login" />}
						>
							<Route path="/verify" element={<Verify />} />
						</Route>

						<Route
							element={<ProtectedRoute isAuthenticated={(userContext?.user && userContext.user.isVerified) ? true : false} redirect="/verify" />}
						>
							<Route path="/event" element={<Events_Page />} />
							<Route path="/profile" element={<Profile />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				{/* </Suspense> */}
			</ErrorBoundary>
		</div>
	);
}

export default App;
