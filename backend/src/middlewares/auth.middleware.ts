import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../utils/errorHandler.js";

export interface CustomRequest extends Request {
	user?: IUser;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
	const accessToken = req.cookies.accessToken as string | undefined;
    const refreshToken = req.cookies.refreshToken as string | undefined;

	if (!accessToken) {
		return next(new ErrorHandler("Unauthorised access", StatusCodes.FORBIDDEN));
	}

    try {
        const decoded = jwt.verify(accessToken!, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & { id: string, email: string, role: string };
		const user = await User.findById(decoded.id);
		if (!user) {
			return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
		}
		if (user.isBlocked) {
			return next(new ErrorHandler("Your account has been blocked", StatusCodes.FORBIDDEN));
		}
	
		req.user = user;
		next();
    } catch (err) {
		if (err instanceof jwt.TokenExpiredError && refreshToken) {
            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload & { id: string };
                const user = await User.findById(decodedRefresh.id);

                if (!user || user.refreshToken !== refreshToken) {
					return next(new ErrorHandler("Invalid refresh token", StatusCodes.FORBIDDEN));
                }
				if (user.isBlocked) {
					return next(new ErrorHandler("Your account has been blocked", StatusCodes.FORBIDDEN));
				}

				const newAccessToken = user.generateAccessToken();
				const expireTime = Number(process.env.ACCESS_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;

				const options: CookieOptions = {
					expires: new Date(Date.now() + expireTime),
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: 'strict',
				};

				res.cookie("accessToken", newAccessToken, options);

                req.user = user;
                next();
            } catch (refreshErr) {
				return next(new ErrorHandler("Invalid or expired refresh token, please log in again", StatusCodes.UNAUTHORIZED));
            }
        } else {
			return next(new ErrorHandler("Unauthorized access", StatusCodes.UNAUTHORIZED));
        }
    }
};

export const isUserVerified = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		if (!req.user?.isVerified) {
			return next(new ErrorHandler("Please verify your email to access this resource", StatusCodes.UNAUTHORIZED));
		}
		next();
	} catch (error) {
		return next(new ErrorHandler("You are not authorized to access this route", StatusCodes.FORBIDDEN));
	}
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
		try {
			if (!req.user || !roles.includes(req.user.role)) {
				return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, StatusCodes.UNAUTHORIZED));
			}
			next();
		} catch (error) {
			return next(new ErrorHandler("You are not authorized to access this route", StatusCodes.FORBIDDEN));
		}
    };
};