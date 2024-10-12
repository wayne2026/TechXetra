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

interface UserRowProps {
	user: User;
	hoveredUserId: string | null;
	setHoveredUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserRow: React.FC<UserRowProps> = ({
	user,
	hoveredUserId,
	setHoveredUserId,
}) => {
	return (
		<tr
			onMouseEnter={() => setHoveredUserId(user._id)}
			onMouseLeave={() => setHoveredUserId(null)}
			className={`border-b border-gray-700 transition-all duration-300 ${
				hoveredUserId === user._id ? "bg-gray-800" : ""
			}`}
		>
			<td className="py-4 px-6">
				<img
					src={user.avatar}
					alt={user.username}
					className="w-10 h-10 rounded-full"
				/>
			</td>
			<td className="py-4 px-6">{user.username}</td>
			<td className="py-4 px-6">{user.email}</td>
			<td className="py-4 px-6">{user.role}</td>
			<td className="py-4 px-6">{user["college/university"]}</td>
			<td className="py-4 px-6">{user.phone_number}</td>
			<td className="py-4 px-6">
				{user.physical_verification ? (
					<span className="text-green-500">Yes</span>
				) : (
					<span className="text-red-500">No</span>
				)}
			</td>
			<td className="py-4 px-6">
				{new Date(user.createdAt).toLocaleDateString()}
			</td>
		</tr>
	);
};

export default UserRow;
