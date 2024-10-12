import React, { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "../components/UserRow";
import UserDetailsModal from "../components/UserDetailsModal";

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

const AdminPanel: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null); // Modal state

	useEffect(() => {
		// Fetch all users from your API
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/v1/user"
				);
				setUsers(response.data.users);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	const openModal = (user: User) => {
		setSelectedUser(user);
	};

	const closeModal = () => {
		setSelectedUser(null);
	};

	return (
		<div className="overflow-x-hidden relative">
			<div className="w-full h-screen z-50 mx-auto bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b]">
				<h1 className="font-semibold font-manrope text-7xl w-fit h-fit pt-6 pl-9 ml-10 text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">
					Admin Panel: Users
				</h1>

				<div className="px-10 py-5">
					<table className="min-w-full table-auto text-left text-white">
						<thead>
							<tr className="border-b border-gray-500">
								<th className="py-3 px-6">Avatar</th>
								<th className="py-3 px-6">Username</th>
								<th className="py-3 px-6">Email</th>
								<th className="py-3 px-6">Role</th>
								<th className="py-3 px-6">
									College/University
								</th>
								<th className="py-3 px-6">Phone</th>
								<th className="py-3 px-6">Verified</th>
								<th className="py-3 px-6">Created At</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<UserRow
									key={user._id}
									user={user}
									hoveredUserId={hoveredUserId}
									setHoveredUserId={setHoveredUserId}
									openModal={openModal} // Pass openModal function
								/>
							))}
						</tbody>
					</table>
				</div>

				{selectedUser && (
					<UserDetailsModal
						user={selectedUser}
						onClose={closeModal}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminPanel;
