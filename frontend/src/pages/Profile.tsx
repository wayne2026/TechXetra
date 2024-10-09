const Profile = ({
	user,
}: {
	user: {
		email: string;
		username: string;
		role: string;
		"college/university": string;
		phone_number: string;
		physical_verification: string;
	} | null;
}) => {
	return (
		<div>
			<h1>Profile</h1>
			<p>{user?.email}</p>
			<p>{user?.username}</p>
			<p>{user?.role}</p>
			{/* <p>{user?["college/university"]}</p> */}
			<p>{user?.phone_number}</p>
			<p>{user?.physical_verification}</p>
		</div>
	);
};

export default Profile;
