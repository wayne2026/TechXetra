import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/better/error-boundary";
import ProtectedRoute from "../components/better/protected-routes";
import { useUser } from "./context/user_context";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";

import Events_Page from './pages/Events_Page'
import Verify from "./pages/verify";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/not-found";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";

// const ChatAssistant = lazy(() => import("../components/better/assitant"));

function App() {
	const userContext = useUser();

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
			{/* {!userContext?.user?.isVerified && (
				<div className="text-md">
					Please verify your email, an OTP was sent to your email address (check spam if not)
				</div>
			)} */}
			<ErrorBoundary>
				<Suspense fallback={null}>
					{/* <div
						className="z-[60] fixed bottom-8 right-8 bg-gray-900 text-white p-2 rounded-md"
					>
						<ChatAssistant />
					</div> */}
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						<Route
							element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/login" />}
						>
							<Route path="/verify" element={<Verify />} />
							<Route path="/event" element={<Events_Page />} />
							<Route path="/profile" element={<Profile />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}

export default App;
