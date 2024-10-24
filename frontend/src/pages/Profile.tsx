import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/user_context";
import axios from "axios";
import { toast } from "react-toastify";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

export const createQRCode = (data: string) => {
	return new QRCodeStyling({
		width: 300,
		height: 300,
		margin: 10,
		data: `${window.location.protocol}//${window.location.host}/profile?id=${data}`,
		qrOptions: {
			typeNumber: 0,
			mode: "Byte",
			errorCorrectionLevel: "H",
		},
		image: "/TechXetraLogo1.png",
		imageOptions: {
			hideBackgroundDots: true,
			imageSize: 0.4,
			margin: 0,
		},
		dotsOptions: {
			type: "extra-rounded",
			color: "#60a5fa",
		},
		backgroundOptions: {
			color: "#030229",
		},
		cornersSquareOptions: {
			type: "extra-rounded",
			color: "#3b82f6",
		},
		cornersDotOptions: {
			color: "#60a5fa",
		},
	});
};

const Profile = () => {
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const id = search.get("id");
	const userContext = useUser();
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [openReset, setOpenReset] = useState(false);
	const [updateProfile, setUpdateProfile] = useState({
		firstName: userContext?.user?.firstName || "",
		lastName: userContext?.user?.lastName || "",
		phoneNumber: userContext?.user?.phoneNumber || "",
	});
	const [resetPassword, setResetPassword] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: ""
	});

	const handleLogOut = async () => {
		try {
			await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true });
			userContext?.setUser(null);
			navigate("/login");
			toast.success("Logged Out");
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	}

	const handleDownload = () => {
		if (userContext?.user) {
			const qrCode = createQRCode(userContext?.user?._id);

			qrCode.download({
				name: userContext?.user?._id,
				extension: "png"
			});
		}
	}

	useEffect(() => {
		if (userContext?.user) {
			const qrCode = createQRCode(userContext?.user?._id);

			qrCode.getRawData("png").then((data) => {
				if (data) {
					const dataUrl = URL.createObjectURL(new Blob([data], { type: "image/png" }));
					setQrCodeDataUrl(dataUrl);
				}
			});
		}
	}, [userContext?.user]);

	const handleIconClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!resetPassword.oldPassword || !resetPassword.newPassword || !resetPassword.confirmPassword) {
				toast.warning("All fields are required");
				return;
			}
			await axios.put(`${import.meta.env.VITE_BASE_URL}/users/update/password`, resetPassword, { withCredentials: true });
			toast.success("Password reset successfully");
			setOpenReset(false);
			setResetPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
		} catch (error: any) {
			setOpenReset(false);
			setResetPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
			toast.error(error.response.data.message);
		}
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(URL.createObjectURL(file));
			await handleAvatarUpload(file);
		}
	};

	const handleAvatarUpload = async (file: File) => {
		if (!file) return;

		const formData = new FormData();
		formData.append('avatar', file);

		try {
			const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/upload/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
			userContext?.setUser(data.user);
			toast.success("Uploaded avatar");
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	}

	const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/update/profile`, updateProfile, { withCredentials: true });
			userContext?.setUser(data.user);
			toast.success("Profile Updated");
			setOpen(false);
		} catch (error: any) {
			setOpen(false);
			toast.error(error.response.data.message);
		}
	}

	useEffect(() => {
		if (open || openReset) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [open, openReset]);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b] text-white">
			<div className="bg-gray-900 rounded-lg shadow-lg p-8">
				<h1 className="sm:text-5xl max-sm:pt-12 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FD8444] to-[#7527ED]">
					Profile
				</h1>

				{id && userContext?.user && ["ADMIN", "MODERATOR"].includes(userContext?.user?.role) && (
					<div>
						{id}
					</div>
				)}

				<div className="flex flex-col lg:flex-row items-center justify-center md:space-x-8 gap-5">
					<div className="flex flex-col md:flex-row items-center md:space-x-8 gap-5">
						<div className='relative h-32 w-32 rounded-full border-2 flex justify-center items-center'>
							{userContext?.user?.avatar && userContext?.user?.avatar?.length > 0 ? (
								<img
									src={selectedFile || userContext?.user?.avatar}
									alt={`${userContext?.user?.firstName} ${userContext?.user?.lastName}`}
									className="w-32 h-32 rounded-full shadow-md border-4 border-purple-500"
								/>
							) : (
								<div className="flex justify-center items-center w-32 h-32 rounded-full shadow-md border-4 border-purple-500">
									<p className="text-center text-4xl font-semibold">{`${userContext?.user?.firstName[0]} ${userContext?.user?.lastName[0]}`}</p>
								</div>
							)}
							<div onClick={handleIconClick} className="absolute border border-slate-300 bottom-0 right-0 bg-slate-200 text-black rounded-full p-2">
								<FaCamera size={20} />
							</div>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								style={{ display: 'none' }}
								accept="image/*"
							/>
						</div>

						{open && (
							<div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[80%] lg:w-[60%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-3xl font-semibold'>Update Profile</h1>
										<button className='border-2 rounded-lg px-3 py-1 text-lg' onClick={() => setOpen(false)}>Close</button>
									</div>
									<form className='mt-8 max-h-[70vh] overflow-y-scroll hide-scrollbar' onSubmit={handleUpdateProfile}>
										<div className="flex flex-col justify-center space-y-2">
											<div className="flex flex-col gap-4">
												<label htmlFor="first-name" className="text-lg font-semibold">First Name</label>
												<input type="text" value={updateProfile.firstName} onChange={(e) => setUpdateProfile({ ...updateProfile, firstName: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter First Name' />
											</div>
											<div className="flex flex-col gap-4">
												<label htmlFor="last-name" className="text-lg font-semibold">Last Name</label>
												<input type="text" value={updateProfile.lastName} onChange={(e) => setUpdateProfile({ ...updateProfile, lastName: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter First Name' />
											</div>
											<div className="flex flex-col gap-4">
												<label htmlFor="phone" className="text-lg font-semibold">Phone Number</label>
												<input type="text" value={updateProfile.phoneNumber} onChange={(e) => setUpdateProfile({ ...updateProfile, phoneNumber: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter First Name' />
											</div>
											<button type='submit' className='bg-indigo-500 px-3 py-2 rounded-lg text-white'>Submit</button>
										</div>
									</form>
								</div>
							</div>
						)}

						{openReset && (
							<div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[80%] lg:w-[60%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-3xl font-semibold'>Reset Password</h1>
										<button className='border-2 rounded-lg px-3 py-1 text-lg' onClick={() => setOpenReset(false)}>Close</button>
									</div>
									<form className='mt-8 flex flex-col justify-center space-y-2' onSubmit={handleResetPassword}>
										<div className="flex flex-col gap-4">
											<label htmlFor="role" className="text-lg font-semibold">Old Password</label>
											<input type="text" value={resetPassword.oldPassword} onChange={(e) => setResetPassword({ ...resetPassword, oldPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
										</div>
										<div className="flex flex-col gap-4">
											<label htmlFor="role" className="text-lg font-semibold">New Password</label>
											<input type="text" value={resetPassword.newPassword} onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
										</div>
										<div className="flex flex-col gap-4">
											<label htmlFor="role" className="text-lg font-semibold">Confirm Password</label>
											<input type="text" value={resetPassword.confirmPassword} onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
										</div>
										<button type='submit' className='bg-indigo-500 px-3 py-2 rounded-lg text-white'>Submit</button>
									</form>
								</div>
							</div>
						)}

						<div className="max-sm:flex max-sm:flex-col max-sm:gap-1">
							<h1 className="text-4xl py-2 capitalize font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FD8444] to-[#7527ED]">
								{userContext?.user?.firstName}{" "}{userContext?.user?.lastName}
							</h1>
							<p className="sm:text-lg mb-1">
								<span className="font-semibold">Email: </span>
								{userContext?.user?.email}
							</p>
							<p className="text-lg mb-1 capitalize">
								<span className="font-semibold">{userContext?.user?.schoolOrCollege === "SCHOOL" ? "SCHOOL" : "COLLEGE"}: </span>
								{userContext?.user?.schoolOrCollege === "SCHOOL" ? userContext.user.schoolName : userContext?.user?.collegeName}
							</p>
							<p className="text-lg mb-1 capitalize">
								<span className="font-semibold">{userContext?.user?.schoolOrCollege === "SCHOOL" ? "CLASS RANGE" : "UG/PG"}: </span>
								{userContext?.user?.schoolOrCollege === "SCHOOL" ? userContext.user.schoolClass : userContext?.user?.collegeClass}
							</p>
							<p className="text-lg mb-1">
								<span className="font-semibold">Phone: </span>
								{userContext?.user?.phoneNumber}
							</p>
						</div>
					</div>

					<div className="flex justify-center items-center">
						<img
							className="h-56 rounded-2xl mx-auto"
							src={qrCodeDataUrl}
							alt="User QR Code"
						/>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap justify-center items-center gap-4">
					<button
						className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
						onClick={handleDownload}
					>
						Download QR
					</button>
					<button
						className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
						onClick={() => setOpen(true)}
					>
						Edit Profile
					</button>
					<button
						className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
						onClick={() => setOpenReset(true)}
					>
						Reset Password
					</button>
					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
						onClick={handleLogOut}
					>
						Logout
					</button>
				</div>

				<div className="sm:mt-8 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:pt-10 ">
					<h2 className="text-2xl font-bold mb-4">
						Registered Events
					</h2>
					{userContext?.user?.events && userContext?.user?.events?.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{userContext?.user?.events.map((event, index) => (
								<div
									key={index}
									className="bg-gradient-to-r from-[#1f021c] via-[#190341] to-[#22071b] p-4 rounded-lg shadow-md"
								>
									<h3 className="text-xl font-semibold">
										Event {index + 1}
									</h3>
									<p className="mt-2">Event Name: {event.eventId}</p>
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

export default Profile;