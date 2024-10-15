import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.model.js";

const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const expireTime = Number(process.env.REFRESH_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;

    if (isNaN(expireTime)) {
        throw new Error("Invalid COOKIE_EXPIRE environment variable");
    }

    const options: CookieOptions = {
        expires: new Date(
            Date.now() + expireTime
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    };

    res
        .status(statusCode)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            user,
            accessToken,
            refreshToken
        });
};

export default sendToken;