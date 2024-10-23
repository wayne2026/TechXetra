import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.model.js";

const generateOptions = (expireTime: number) => {
    if (isNaN(expireTime)) {
        throw new Error("Invalid COOKIE_EXPIRE environment variable");
    }

    const options: CookieOptions = {
        expires: new Date(Date.now() + (expireTime * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
    };
    
    return options;
}

const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateBeforeSave: false });

    const accessTokenOptions = generateOptions(Number(process.env.ACCESS_COOKIE_EXPIRE));
    const refreshTokenOptions = generateOptions(Number(process.env.REFRESH_COOKIE_EXPIRE));

    res
        .status(statusCode)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json({
            success: true,
            user,
            accessToken,
            refreshToken
        });
};

export default sendToken;