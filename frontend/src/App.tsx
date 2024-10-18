import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/better/error-boundary";
import ProtectedRoute from "../components/better/protected-routes";
import { useUser } from "./context/user_context";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/not-found";
import Verify from "./pages/verify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function App() {
	const userContext = useUser();
	const [fontLoaded, setFontLoaded] = useState(false);

	useEffect(() => {
		const font = new FontFace(
			'AutoTechno', // Replace with your font's name
			'/auto-techno.ttf' // Replace with your font's URL
		);

		// Load the font
		font.load().then(() => {
			// Add the font to the document
			document.fonts.add(font);
			setFontLoaded(true);
		}).catch((error) => {
			console.error('Font loading failed:', error);
			setFontLoaded(true);  // You can still render the content even if font loading fails
		});
	}, []);

	return userContext?.loading || !fontLoaded ? (
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
			<ErrorBoundary>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route
						element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/login" />}
					>
						<Route path="/verify" element={<Verify />} />
					</Route>
					<Route
						element={<ProtectedRoute isAuthenticated={userContext?.user && userContext?.user?.isVerified ? true : false} redirect="/login" />}
					>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ErrorBoundary>
		</div>
	);
}

export default App;
