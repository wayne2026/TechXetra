import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.model.js";

const generateOptions = (expireTime: number) => {
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

    return options;
}

const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateBeforeSave: false });

    const accessTokenExpireTime = Number(process.env.ACCESS_COOKIE_EXPIRE) * 60 * 1000;
    const refreshTokenExpireTime = Number(process.env.REFRESH_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;

    const accessTokenOptions = generateOptions(accessTokenExpireTime);
    const refreshTokenOptions = generateOptions(refreshTokenExpireTime);

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