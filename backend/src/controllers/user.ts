import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";

import dotenv from "dotenv";
dotenv.config();
import { IUser } from "../models/user";

const generateAccessToken = (user: IUser) => {
	const secret = process.env.ACCESS_TOKEN_SECRET || "default-secret";
	return jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		secret,
		{
			expiresIn: "15s",
		}
	);
};

const verifyRefreshToken = (refreshToken: string) => {
	const secret = process.env.REFRESH_TOKEN_SECRET || "default-secret";
	return jwt.verify(refreshToken, secret);
};

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find();
		res.status(StatusCodes.OK).json({ users, count: users.length });
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user: { email: string; password: string } = req.body;
		if (!user.email || user.email === "") {
			res.status(StatusCodes.BAD_REQUEST).json({
				msg: "Please provide a valid email",
			});
			return;
		}

		if (!user.password || user.password === "") {
			res.status(StatusCodes.BAD_REQUEST).json({
				msg: "Please provide a valid password",
			});
			return;
		}

		const foundUser = await User.findOne({ email: user.email });
		if (!foundUser) {
			res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
			return;
		}

		const isMatch = await bcrypt.compare(user.password, foundUser.password);
		if (!isMatch) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				msg: "Invalid credentials",
			});
			return;
		}

		const accessToken = generateAccessToken(foundUser);
		const refreshSecret =
			process.env.REFRESH_TOKEN_SECRET || "default-secret";
		const refreshToken = jwt.sign(
			{ email: foundUser.email },
			refreshSecret,
			{
				expiresIn: "1y",
			}
		);

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.status(StatusCodes.OK).json({ user: foundUser, accessToken });
	} catch (error) {
		next(error);
	}
};

export const handleRefreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		return res.sendStatus(StatusCodes.UNAUTHORIZED);
	}

	const refreshToken = cookies.jwt;
	try {
		const decoded = verifyRefreshToken(refreshToken);

		if (typeof decoded === "string") {
			return res.sendStatus(StatusCodes.UNAUTHORIZED);
		}

		const foundUser = await User.findOne({ email: decoded.email });
		if (!foundUser) {
			return res.sendStatus(StatusCodes.UNAUTHORIZED);
		}

		const accessToken = generateAccessToken(foundUser);
		res.status(StatusCodes.OK).json({ accessToken });
	} catch (error) {
		res.sendStatus(StatusCodes.FORBIDDEN);
	}
};

export const logoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		return res.sendStatus(StatusCodes.OK);
	}

	const refreshToken = cookies.jwt;

	const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "default-secret";
	jwt.verify(refreshToken, refreshSecret, async (err: any, decoded: any) => {
		if (err) {
			return res.sendStatus(StatusCodes.FORBIDDEN);
		}

		await User.findOneAndUpdate(
			{ email: decoded.email },
			{ refreshToken: "" }
		);
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		return res.sendStatus(StatusCodes.OK);
	});
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		res.status(StatusCodes.OK).json({ user });
	} catch (error) {
		next(error);
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(StatusCodes.OK).json({ user });
	} catch (error) {
		next(error);
	}
};

export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;

		const hashedPassword = await bcrypt.hash(user.password, 10);
		user.password = hashedPassword;

		await User.create(user);

		res.status(StatusCodes.CREATED).json(user);
	} catch (error) {
		next(error);
	}
};
