import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser, roleEnum } from '../models/user.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import Event from '../models/event.model.js';

const generateAccessToken = (user: IUser) => {
	const secret = process.env.ACCESS_TOKEN_SECRET || "default-secret";
	return jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		secret,
		{
			expiresIn: "15m",
		}
	);
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
		const foundUser = await User.findOne({ email: user.email });
    if(!foundUser){
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'User does not exist'
        });
        return;
    }
    if (foundUser.role !== roleEnum.ADMIN) {
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
	req: CustomRequest,
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

export const changeRoll = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
    const { id } = req.params
    const { role } = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate(
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
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
    const { title, description, price, info, images } = req.body;
     // Validations
    if (!title || !description || !price || !info?.date || !info?.location || !images) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all required fields" });
    }

    try {
        const new_event = await Event.create({
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
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
    const { id } = req.params
    try {
        const getUser = await User.findById(id)
        const events = await Event.find({ _id: { $in: getUser?.events } });
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        next(error);
    }
}

export const isUserEnrolled = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
    const { event_id, user_id  } = req.params
    try {
        const getUser = await User.findById(user_id)
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

export const userVerification = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) => {
    const { id } = req.params
    try {
        const updatedUser = await User.findByIdAndUpdate
        (id, { physical_verification: true }, { new: true });
        res.status(StatusCodes.OK).json({ message: 'User verified successfully', updatedUser });
    } catch (error) {
        next(error);
    }
};