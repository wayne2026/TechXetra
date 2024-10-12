import React from "react";

type User = {
	_id: string;
	username: string;
	email: string;
	avatar: string;
	role: string;
	"college/university": string;
	phone_number: string;
	physical_verification: boolean;
	createdAt: string;
	updatedAt: string;
	events: string[];
};

interface UserDetailsModalProps {
	user: User | null;
	onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
	user,
	onClose,
}) => {
	if (!user) return null;

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${user._id}`;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg w-2/3 p-8 shadow-lg relative">
				<button
					onClick={onClose}
					className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 text-2xl font-semibold"
				>
					&times;
				</button>

				<div className="flex items-center space-x-4">
					<img
						src={user.avatar}
						alt={user.username}
						className="w-20 h-20 rounded-full"
					/>
					<div>
						<h2 className="text-2xl font-bold">{user.username}</h2>
						<p>{user.email}</p>
						<p>Role: {user.role}</p>
						<p>College: {user["college/university"]}</p>
						<p>Phone: {user.phone_number}</p>
						<p>
							Verified:{" "}
							{user.physical_verification ? (
								<span className="text-green-500">Yes</span>
							) : (
								<span className="text-red-500">No</span>
							)}
						</p>
					</div>
					<div>
						<img className=" max-h-40" src={qrUrl} alt="" />
					</div>
				</div>

				<div className="mt-6">
					<h3 className="text-xl font-semibold mb-2">
						Registered Events
					</h3>
					{user.events.length > 0 ? (
						<div className="space-y-4 py-2">
							{user.events.map((event, index) => (
								<div
									key={index}
									className="bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b] p-4 rounded-lg shadow-md text-white"
								>
									<h4 className="font-bold text-lg">
										Event {index + 1}
									</h4>
									<p className="mt-2">Event Name: {event}</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No events registered</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserDetailsModal;
