import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";

export interface CustomRequest extends Request {
	user?: IUser;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    // const accessToken = req.headers.authorization?.split(" ")[1];
	// const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
	const accessToken = req.cookies.accessToken as string | undefined;
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!accessToken) return res.status(403).json({ message: "Access token required" });

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & { id: string, email: string, role: string };
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
	
		req.user = user;
		next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError && refreshToken) {
            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload & { id: string };
                const user = await User.findById(decodedRefresh.id);

                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: "Invalid refresh token" });
                }

				const newAccessToken = user.generateAccessToken();
				const expireTime = Number(process.env.ACCESS_COOKIE_EXPIRE) * 60 * 1000;

				const options: CookieOptions = {
					expires: new Date(
						Date.now() + expireTime
					),
					httpOnly: true,
					secure: true,
					sameSite: 'strict',
				};

				res.cookie("accessToken", newAccessToken, options);
                // res.setHeader("Authorization", `Bearer ${newAccessToken}`);

                req.user = user;
                next();
            } catch (refreshErr) {
                return res.status(401).json({ message: "Invalid or expired refresh token, please log in again" });
            }
        } else {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: "Unauthorized access"
			});
        }
    }
};

export const isUserVerified = async (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		if (!req.user?.isVerified) {
			return res.status(401).json({ message: "Please verify your email to access this resource" });
		}
		next();
	} catch (error) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			message: "You are not authorized to access this route",
		});
	}
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
		try {
			if (!req.user || !roles.includes(req.user.role)) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					success: false,
					message: `Role: ${req.user?.role} is not allowed to access this resource`
				});
			}
			next();
		} catch (error) {
			return res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: "You are not authorized to access this route",
			});
		}
    };
};