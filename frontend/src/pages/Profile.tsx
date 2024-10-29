import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/user_context";
import axios from "axios";
import { toast } from "react-toastify";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import moment from 'moment-timezone';
import { MdForwardToInbox } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export const createQRCode = (data: string) => {
	return new QRCodeStyling({
		width: 1000,
		height: 1000,
		margin: 0,
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
	const location = useLocation();
	const [search] = useSearchParams();
	const id = search.get("id");
	const userContext = useUser();
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
	const [openInvites, setOpenInvites] = useState(false);
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
	const [events, setEvents] = useState<UserEvent[]>();
	const [invites, setInvites] = useState<UserInvite[]>();
	const [openEventDetails, setOpenEventDetails] = useState(false);
	const [currentEvent, setCurrentEvent] = useState<UserEvent | null>();

	const from = location.state?.from?.pathname + location.state?.from?.search || "/verify";

	useEffect(() => {
        if (!userContext?.user?.isVerified) {
            // Redirect after a brief timeout for user to see the message
            const timer = setTimeout(() => {
                navigate(from, { replace: true });
            }, 2000); // 2 second delay before redirect

            return () => clearTimeout(timer); // Cleanup timeout on component unmount
        }
    }, [userContext?.user, from, navigate]);

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

	const fetchEvents = async () => {
		try {
			const { data }: { data: UserEventResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/events`, { withCredentials: true });
			setEvents(data.user.events);
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log(error.response.data.message);
		}
	}

	const fetchInvites = async () => {
		try {
			const { data }: { data: UserInviteResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/invites`, { withCredentials: true });
			setInvites(data.user.invites);
		} catch (error: any) {
			toast.error(error.response.data.message);
			console.log(error.response.data.message);
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

	useEffect(() => {
		fetchInvites();
		fetchEvents();
	}, []);

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

	const handleCheckoutInvitation = async (choice: string, userId: string, eventId: string) => {
		try {
            const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/events/invite/${userId}/${eventId}`, { choice }, { withCredentials: true });
            setEvents(data.user.events);
			setInvites(data.user.invites);
            toast.success("Invite checked out successfully");
        } catch (error: any) {
			toast.error(error.response.data.message);
        } finally {
            setOpenInvites(false);
		}
	}

	useEffect(() => {
		if (open || openReset || openInvites || openEventDetails) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [open, openReset, openInvites, openEventDetails]);

	const handleDelteUserEvent = async (eventId: string) => {
		try {
            const { data }: { data: UserEventResponse } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/events/byId/${eventId}`, { withCredentials: true });
            setEvents(data.user.events);
			console.log(data)
            toast.success("Event deleted successfully");
            setOpenEventDetails(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
	}

	const handleDeleteMember = async (eventId: string, memberId: string) => {
		try {
			const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/events/member/del/${eventId}`, { memberId }, { withCredentials: true });
			console.log(data)
            toast.success("Memver Removed successfully");
            setOpenEventDetails(false);
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	}

	if (userContext?.user && !userContext?.user?.isVerified) {
        return <div className="text-center mt-8">You are not verified. Redirecting to verify...</div>
    }

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b] text-white">
			<div className="bg-gray-900 rounded-lg shadow-lg p-8 my-6 border border-gray-400">
				<div className="flex justify-center items-center gap-6">
					<h1 className="sm:text-5xl max-sm:pt-12 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FD8444] to-[#7527ED]">
						Profile
					</h1>
					<button className="relative mb-4" onClick={() => setOpenInvites(true)}>
						<MdForwardToInbox className="" size={40} />
						<p className="absolute bottom-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs rounded-full">
							{invites?.length || 0}
						</p>
					</button>
				</div>

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
									<p className="text-center text-4xl font-semibold">{`${userContext?.user?.firstName[0]}${userContext?.user?.lastName[0]}`}</p>
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
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-xl md:text-2xl font-semibold'>Update Profile</h1>
										<button className='border-2 rounded-lg px-2 py-1 text-lg' onClick={() => setOpen(false)}><RxCross2 size={20} /></button>
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
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-xl md:text-2xl font-semibold'>Reset Password</h1>
										<button className='border-2 rounded-lg px-2 py-1 text-lg' onClick={() => setOpenReset(false)}><RxCross2 size={20} /></button>
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

						{openInvites && (
							<div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[50%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-xl md:text-2xl font-semibold'>Invites</h1>
										<button className='border-2 rounded-lg px-2 py-1 text-lg' onClick={() => setOpenInvites(false)}><RxCross2 size={20} /></button>
									</div>
									<div className="mt-8 flex flex-col justify-center space-y-2">
										{invites ? (
											<>
												{invites?.map((invite, index) => (
													<div key={index} className="flex flex-col md:flex-row justify-between items-center bg-slate-200 p-2 rounded-lg">
														<div>
															<Link className="underline" to={`/event?id=${invite?.eventId._id}`}>Event: {invite.eventId.title}</Link>
															<p>Inviter: {invite.userId.email}</p>
														</div>
														<div className="flex flex-row md:flex-col">
															<p className="underline">Status</p>
															<p>{invite?.status}</p>
														</div>
														<div className="flex gap-2 text-white">
															<button onClick={() => handleCheckoutInvitation("ACCEPTED", invite.userId._id, invite.eventId._id)} className="bg-green-500 px-3 py-2 rounded-lg">ACCEPT</button>
															<button onClick={() => handleCheckoutInvitation("REJECTED", invite.userId._id, invite.eventId._id)} className="bg-red-500 px-3 py-2 rounded-lg">REJECT</button>
														</div>
													</div>
												))}
											</>
										) : (
											<p>No Invites Yet.</p>
										)}
									</div>
								</div>
							</div>
						)}

						{openEventDetails && (
							<div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
								<div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[50%]">
									<div className='flex justify-between items-center'>
										<h1 className='text-xl md:text-2xl font-semibold'>User Event Details</h1>
										<button
											className='border-2 rounded-lg px-2 py-1 text-lg'
											onClick={() => {
												setOpenEventDetails(false);
												setCurrentEvent(null);
											}}
										>
											<RxCross2 size={20} />
										</button>
									</div>
									{currentEvent && (
										<div className="mt-8 flex flex-col justify-center space-y-2">
											<div>
												<p className="text-xl font-semibold">Event Title: {currentEvent?.eventId.title}</p>
												<p>Event Date: {new Date(currentEvent?.eventId.eventDate!).toLocaleDateString('en-GB')}</p>
												<p>Event Time: {moment.utc(currentEvent?.eventId.eventDate).format('hh:mm A')} onwards</p>
												<p>isGroup: {currentEvent.isGroup.toString()}</p>
												<p>Group Leader: {currentEvent.group?.leader?.email}</p>
												{currentEvent.group?.members && currentEvent.group?.members?.length > 0 && (
													<>
														<p>Group Members: </p>
														<div>
															{currentEvent.group?.members?.map((member, index) => (
																<div key={index} className="pl-6">{member.user.email} - {member?.status}
																{userContext?.user?.role === "ADMIN" && userContext?.user?._id === currentEvent.group?.leader?._id && (
																	<button className="bg-slate-200 text-red-500 m-1 p-1 rounded-lg" onClick={() => handleDeleteMember(currentEvent.eventId._id, member.user._id)}>
																		<MdDelete />
																	</button>
																)}
																</div>
															))}
														</div>
													</>
												)}
												{currentEvent.paymentRequired && (
													<>
														<p>Payment Status: {currentEvent?.payment?.status}</p>
														<p>TransactionId: {currentEvent?.payment?.transactionId}</p>
														{currentEvent?.payment?.paymentImage && (
															<Link onClick={(e) => e.stopPropagation()} to={currentEvent?.payment?.paymentImage} target="blank" className="mt-2 flex items-center gap-4">Payment ScreenShot: <img className="h-10 w-10 rounded-lg" src={currentEvent?.payment?.paymentImage} alt={currentEvent.payment.transactionId} /></Link>
														)}
														<p>Physical Verified: {currentEvent?.physicalVerification?.status ? "TRUE" : "FALSE"}</p>
													</>
												)}
												<Link to={`/event?id=${currentEvent?.eventId._id}`} className="underline">Go to events page</Link>
											</div>
										</div>
									)}
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
								<span className="font-semibold">Academic Level: </span>
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
						Registered Events ({events?.length || 0})
					</h2>
					{events && events?.length > 0 ? (
						<div className="w-full flex flex-col justify-center items-center gap-2">
							{events?.map((event, index) => (
								<div
									key={index}
									onClick={() => {
										setOpenEventDetails(true);
										setCurrentEvent(event)
									}}
									className="w-full bg-gradient-to-r from-[#6b3065] via-[#42129c] to-[#812368] py-2 px-6 rounded-xl shadow-md"
								>
									<div className="flex flex-col md:flex-row justify-between md:items-center space-y-4">
										<div>
											<h3 className="text-xl font-semibold">
												Event: {event.eventId.title}
											</h3>
											<div className="mt-2 text-sm">
												<p>Venue: {event.eventId.title}</p>
												<p>Event Date: {new Date(event?.eventId.eventDate!).toLocaleDateString('en-GB')}</p>
												<p>Event Time: {moment.utc(event.eventId.eventDate).format('hh:mm A')} onwards</p>
											</div>
										</div>
										{userContext?.user?.role === "ADMIN" && (
											<div>
												<button 
													onClick={(e) => {
														handleDelteUserEvent(event.eventId._id);
														e.stopPropagation();
													}}
												>
													Delete
												</button>
											</div>
										)}
										{event.paymentRequired && (
											<div>
												<h3 className="text-xl font-semibold">
													Status: {event?.payment?.status}
												</h3>
												<div className="mt-2 text-sm">
													<p>Amount: {event?.payment?.amount}</p>
													<p>TransactionId: {event?.payment?.transactionId}</p>
													{event?.payment?.paymentImage && (
														<Link onClick={(e) => e.stopPropagation()} to={event?.payment?.paymentImage} target="blank" className="mt-2 flex items-center gap-4">Payment ScreenShot: <img className="h-10 w-10 rounded-lg" src={event.payment.paymentImage} alt={event.payment.transactionId} /></Link>
													)}
												</div>
											</div>
										)}
									</div>
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