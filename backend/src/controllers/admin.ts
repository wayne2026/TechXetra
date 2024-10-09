import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user'
import EventModel from '../models/events';
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (user: { email: string; password: string }) => {
	const secret = process.env.ACCESS_TOKEN_SECRET || "default-secret";
	return jwt.sign({ email: user.email }, secret, {
		expiresIn: "15s",
	});
};

const verifyRefreshToken = (refreshToken: string) => {
	const secret = process.env.REFRESH_TOKEN_SECRET || "default-secret";
	return jwt.verify(refreshToken, secret);
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		const foundUser = await userModel.findOne({ email: user.email });
    if(!foundUser){
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'User does not exist'
        });
        return;
    }
    if (foundUser.role !== 'admin') {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are not authorized to access this route'
        });
        return;
    }
    const isMatch = await bcrypt.compare(user.password, foundUser.password);
    if (!isMatch) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid credentials",
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
    
};

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await userModel.find();
		res.status(StatusCodes.OK).json({ users, count: users.length });
	} catch (error) {
		next(error);
	}
};

export const changeRoll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    const { id } = req.params
    const { role } = req.body
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            { role: role },
            { new: true }
        );
        res.status(StatusCodes.OK).json({ message: 'Role updated successfully', updatedUser });
    } catch (error) {
        next(error);    
    }
};

export const newEvent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    const { title, description, price, info, images } = req.body;
     // Validations
     if (!title || !description || !price || !info?.date || !info?.location || !images) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all required fields" });
    }

    try {
        const new_event = await EventModel.create({
            title,
            description,
            price,
            info: {
                date: info.date,
                location: info.location
            },
            images,
            createdAt: new Date()
        });

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event created successfully",
            new_event,
        });
    }
    catch (error) {
        next(error);
    }
};

export const getEventsEnrolledByUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    const { id } = req.params
    try {
        const getUser = await userModel.findById(id)
        const events = await EventModel.find({ _id: { $in: getUser?.events } });
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        next(error);
    }
}

export const isUserEnrolled = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    const { event_id, user_id  } = req.params
    try {
        const getUser = await userModel.findById(user_id)
        if (getUser?.events.includes(event_id)) {
            res.status(StatusCodes.OK).json({
                message: 'User is enrolled'
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'User is not enrolled'
            });
        }
    } catch (error) {
        next(error);
    }
}