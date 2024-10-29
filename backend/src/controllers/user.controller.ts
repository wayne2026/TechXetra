import fs from "fs";
import path from "path";
import crypto from "crypto";
import sendToken from "../utils/jwtToken.js";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../utils/errorHandler.js";
import { addEmailToQueue } from "../utils/emailQueue.js";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import User, { collegeClassEnum, roleEnum, schoolClassEnum, schoolEnum } from "../models/user.model.js";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { firstName, lastName, email, password, phoneNumber, schoolOrCollege, schoolName, collegeName, collegeClass, schoolClass } = req.body;

		if (!firstName || !lastName || !email || !password || !phoneNumber || !schoolOrCollege) {
			return next(new ErrorHandler("Please enter FirstName, LastName, Email, Password, SchoolOrCollege and PhoneNumber", StatusCodes.NOT_FOUND));
		}

		if (!Object.values(schoolEnum).includes(schoolOrCollege)) {
			return next(new ErrorHandler("Invalid field SchoolOrCollege", 400));
		}

		if (schoolClass && !Object.values(schoolClassEnum).includes(schoolClass)) {
			return next(new ErrorHandler("Invalid field SchoolClass", 400));
		}

		if (collegeClass && !Object.values(collegeClassEnum).includes(collegeClass)) {
			return next(new ErrorHandler("Invalid field CollegeClass", 400));
		}

		const filename = req?.file ? `${process.env.SERVER_URL}/avatars/${req?.file?.filename}` : "";

		const user = await User.create({
			firstName,
			lastName,
			email,
			password,
			avatar: filename,
			role: email === process.env.ADMIN_EMAIL ? roleEnum.ADMIN : roleEnum.USER,
			schoolOrCollege,
			schoolName: schoolOrCollege === schoolEnum.SCHOOL ? schoolName : undefined,
			collegeName: schoolOrCollege === schoolEnum.COLLEGE? collegeName : undefined,
            collegeClass: schoolOrCollege === schoolEnum.COLLEGE? collegeClass : undefined,
            schoolClass: schoolOrCollege === schoolEnum.SCHOOL? schoolClass : undefined,
            phoneNumber,
		});

		if (!user) {
			return next(new ErrorHandler("Error Registering User, Try Again Later", StatusCodes.INTERNAL_SERVER_ERROR));
		}

		const otp = user.getOneTimePassword();
		await user.save({ validateBeforeSave: false });

		const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

		try {
			await addEmailToQueue({
				email: user.email,
				subject: `TechXetra | Email Veification`,
				message,
			});
		} catch (error) {
			user.oneTimePassword = undefined;
			user.oneTimeExpire = undefined;
			await user.save({ validateBeforeSave: false });
		}

		sendToken(user, StatusCodes.CREATED, res);
	} catch (error) {
		next(error);
	}
};

export const requestVerification = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
		}
	
		const otp = user.getOneTimePassword();
		await user.save({ validateBeforeSave: false });
	
		const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;
	
		try {
			await addEmailToQueue({
				email: user.email,
				subject: `TechXetra | Email Veification`,
				message,
			});
	
			res.status(200).json({
				success: true,
				message: `Email sent to ${user.email} successfully`,
			});
		} catch (error) {
			user.oneTimePassword = undefined;
			user.oneTimeExpire = undefined;
	
			await user.save({ validateBeforeSave: false });
	
			return next(new ErrorHandler((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
		}
	} catch (error) {
		next(error);
	}
};

export const verifyUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const { otp } = req.body;
	
		if (!otp) {
			return next(new ErrorHandler("Please enter OTP", StatusCodes.NOT_FOUND));
		}
	
		const oneTimePassword = crypto
			.createHash("sha256")
			.update(otp.toString())
			.digest("hex");
	
		const user = await User.findOne({
			_id: req.user?._id,
			oneTimePassword,
			oneTimeExpire: { $gt: Date.now() },
		});
	
		if (!user) {
			return next(new ErrorHandler("Email Veification OTP has Expired", StatusCodes.BAD_REQUEST));
		}
	
		user.isVerified = true;
		user.oneTimePassword = undefined;
		user.oneTimeExpire = undefined;
	
	
		await user.save();
	
		sendToken(user, StatusCodes.OK, res);
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new ErrorHandler("Please enter Email and Password", StatusCodes.NOT_FOUND));
		}
	
		const user = await User.findOne({ email }).select("+password");
	
		if (!user) {
			return next(new ErrorHandler("Invalid Credentials", StatusCodes.UNAUTHORIZED));
		}
	
		if (user.isBlocked) {
			return next(new ErrorHandler("Account is blocked", StatusCodes.FORBIDDEN));
		}
	
		const isPasswordMatched = await user.comparePassword(password);
	
		if (!isPasswordMatched) {
			return next(new ErrorHandler("Invalid Credentials", StatusCodes.UNAUTHORIZED));
		}
	
		sendToken(user, StatusCodes.OK, res);
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id).select("+password");
	
		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}
	
		const { oldPassword, newPassword, confirmPassword } = req.body;
		if (!oldPassword || !newPassword || !confirmPassword) {
			return next(new ErrorHandler("All fields are required", 404));
		}
	
		const isPasswordMatched = await user.comparePassword(oldPassword);
	
		if (!isPasswordMatched) {
			return next(new ErrorHandler("Old password is incorrect", 400));
		}
	
		if (newPassword !== confirmPassword) {
			return next(new ErrorHandler("Password does not match", 400));
		}
	
		user.password = newPassword;
	
		await user.save();
	
		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

export const requestForgot = async (req: Request, res: Response, next: NextFunction) => {
	try {

		const { email } = req.body;
		if (!email) {
            return next(new ErrorHandler("Please enter Email", 400));
        }

		const user = await User.findOne({ email });
	
		if (!user) {
			return next(new ErrorHandler("User not Found", 404));
		}
	
		const resetToken = user.getResetPasswordToken();
	
		await user.save({ validateBeforeSave: false });
	
		const resetPasswordUrl = `${process.env.CLIENT_URL}/reset?token=${resetToken}&user=${user._id}`;
	
		const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n Please ignore if you didn't requested this email.`;
	
		try {
			await addEmailToQueue({
				email: user.email,
				subject: `TechXetra | Password Recovery`,
				message,
			});
	
			res.status(200).json({
				success: true,
				message: `Email sent to ${user.email} successfully`,
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
	
			await user.save({ validateBeforeSave: false });
	
			return next(new ErrorHandler((error as Error).message, 500));
		}
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { token } = req.params;
	
		if (!token) {
			return next(new ErrorHandler("Broken Link", 500));
		}
	
		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");
	
		const user = await User.findOne({
			_id: req.body.user,
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});
	
		if (!user) {
			return next(new ErrorHandler("Reset Password Token is either Invalid or has Expired", 400));
		}
	
		const { newPassword, confirmPassword } = req.body;
	
		if (!newPassword || !confirmPassword) {
			return next(new ErrorHandler("All fields are required", 404));
		}
	
		if (newPassword !== confirmPassword) {
			return next(new ErrorHandler("Password does not match", 400));
		}
	
		user.password = newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
	
		await user.save();
	
		sendToken(user, StatusCodes.OK, res);
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id).select("-events -invites").lean();
		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

export const getUserEvents = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id).select("events")
			.populate("events.eventId", "title eventDate venue")
			.populate({
				path: 'events.group.leader', // Populate the leader field in events.group
				select: 'firstName lastName email' // Select the fields you want from the populated User document
			})
			.populate({
				path: 'events.group.members.user', // Populate the members' user field in events.group
				select: 'firstName lastName email' // Select the fields you want from the populated User documents
			})
			.populate({
				path: 'events.payment.verifierId', // Populate the verifierId field in events.payment
				select: 'firstName lastName email' // Select the fields you want from the populated User document
			})
			.populate({
				path: 'events.physicalVerification.verifierId', // Populate verifierId in physicalVerification
				select: 'firstName lastName email' // Select the fields you want from the populated User document
			});

		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}
	
		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
}

export const getUserInvites = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id).select("invites")
			.populate({
				path: 'invites.eventId', // Populate the leader field in events.group
				select: 'title eventDate venue' // Select the fields you want from the populated User document
			})
			.populate({
				path: 'invites.userId', // Populate the leader field in events.group
				select: 'firstName lastName email' // Select the fields you want from the populated User document
			})
		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}
	
		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
}

export const updateProfileDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}
	
		const { firstName, lastName, phoneNumber } = req.body;
	
		const updatedProfile = {
			firstName: firstName || user.firstName,
			lastName: lastName || user.lastName,
            phoneNumber: phoneNumber || user.phoneNumber,
		};
	
		const updatedUser = await User.findByIdAndUpdate(
			req.user?._id,
			updatedProfile,
			{ new: true, runValidators: true, useFindAndModify: false }
		);
	
		res.status(200).json({
			success: true,
			user: updatedUser,
			message: "Profile Details updated successfully"
		});
	} catch (error) {
		next(error);
	}
};

export const uploadProfilePicture = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			return next(new ErrorHandler("User not found", 404));
		}

		const filename = req.file ? `${process.env.SERVER_URL}/avatars/${req.file.filename}` : "";
		if (req.file && user.avatar && user.avatar.length > 0) {
			const basename = user.avatar.split('/').pop() || "";
			const imagePath = path.join('./public/avatars', basename);
			try {
				if (fs.existsSync(imagePath)) {
					await fs.promises.unlink(imagePath);
				}
			} catch (error) {
				console.error('Error deleting image:', error);
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.user?._id,
			{ avatar: filename },
			{ new: true, runValidators: true, useFindAndModify: false }
		);

		res.status(200).json({
			success: true,
			user: updatedUser,
			message: "Profile Picture updated successfully"
		});
	} catch (error) {
		next(error);
	}
}

export const logoutUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
		}

		user.refreshToken = undefined;

        await user.save({ validateBeforeSave: false });

		const option = {
			expires: new Date(Date.now()),
			httpOnly: true,
		}

		res.cookie("accessToken", null, option);
		res.cookie("refreshToken", null, option);
	
		res.status(StatusCodes.OK).json({
			success: true,
			message: "Logged Out",
		});
	} catch (error) {
		next(error);
	}
};

