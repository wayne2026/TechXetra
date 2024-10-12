import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import About from "./pages/About";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminPanel from "./pages/Admin";
import { useState } from "react";
function App() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	return (
		<>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route
					path="/login"
					element={<Login setToken={setToken} setUser={setUser} />}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute user={user}>
							<Profile user={user} />
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
