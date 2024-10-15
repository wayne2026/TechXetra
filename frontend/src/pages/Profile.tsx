import { useNavigate } from "react-router-dom";

type User = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
	role: string;
	account: string[];
	college: string;
	phoneNumber: string;
	isVerified: boolean;
	isBlocked: boolean;
	events: string[];
	createdAt: string;
	updatedAt: string;
};

const Profile = ({
	user,
	handleLogout,
}: {
	user: User | null;
	handleLogout: () => void;
}) => {
	const navigate = useNavigate();

	if (!user) {
		return (
			<div className="text-center py-10 text-gray-400">
				<p>User profile not available</p>
			</div>
		);
	}

	const capitalize = (str: string) =>
		str.charAt(0).toUpperCase() + str.slice(1);

	// Generate QR code URL
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${user._id}`;

	return (
		<div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b] text-white">
			<div className="bg-gray-900 rounded-lg shadow-lg p-8 w-3/4 max-w-4xl">
				{/* Profile Heading */}
				<h1 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FD8444] to-[#7527ED]">
					Profile
				</h1>

				<div className="flex items-center justify-between space-x-8">
					{/* Left side: Avatar and user info */}
					<div className="flex items-center space-x-8">
						{/* Avatar */}
						<img
							src={user.avatar}
							alt={`${user.firstName} ${user.lastName}`}
							className="w-32 h-32 rounded-full shadow-md border-4 border-purple-500"
						/>

						{/* User Info */}
						<div>
							<h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FD8444] to-[#7527ED]">
								{capitalize(user.firstName)}{" "}
								{capitalize(user.lastName)}
							</h1>
							<p className="text-lg mb-1">
								<span className="font-semibold">Email: </span>
								{user.email}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">Role: </span>
								{user.role}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">
									Account Types:{" "}
								</span>
								{user.account.join(", ")}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">College: </span>
								{capitalize(user.college)}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">Phone: </span>
								{user.phoneNumber}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">
									Verified:{" "}
								</span>
								{user.isVerified ? (
									<span className="text-green-500">Yes</span>
								) : (
									<span className="text-red-500">No</span>
								)}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">Blocked: </span>
								{user.isBlocked ? (
									<span className="text-red-500">Yes</span>
								) : (
									<span className="text-green-500">No</span>
								)}
							</p>
						</div>
					</div>

					{/* Right side: QR Code */}
					<div className="flex-shrink-0">
						<img
							className="max-h-40"
							src={qrUrl}
							alt="User QR Code"
						/>
					</div>
				</div>

				{/* Registered Events */}
				<div className="mt-8">
					<h2 className="text-2xl font-bold mb-4">
						Registered Events
					</h2>
					{user.events.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{user.events.map((event, index) => (
								<div
									key={index}
									className="bg-gradient-to-r from-[#1f021c] via-[#190341] to-[#22071b] p-4 rounded-lg shadow-md"
								>
									<h3 className="text-xl font-semibold">
										Event {index + 1}
									</h3>
									<p className="mt-2">Event Name: {event}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No events registered</p>
					)}
				</div>

				{/* Logout Button */}
				<div className="mt-8 text-center">
					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
						onClick={() => {
							handleLogout();
							navigate("/login");
						}}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
