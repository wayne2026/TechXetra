import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { IUser } from "../models/user";

export interface CustomRequest extends Request {
	user?: IUser;
}

export const authMiddleware = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;
		if (
			!authHeader ||
			authHeader === "" ||
			!authHeader.startsWith("Bearer ")
		) {
			return res.status(401).json({
				success: false,
				message: "Invalid access token.",
			});
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
		req.user = decoded as IUser;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid access token.",
		});
	}
};
