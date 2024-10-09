import { Request, Response, NextFunction } from 'express';
import EventModel from '../models/events';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../middleware/auth_middleware';

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

export const getAllEvents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) =>  {
    try {
        const getEvents = await EventModel.find();
        res.status(StatusCodes.OK).json(getEvents);
    } catch (error) {
        next(error);
    }
    }

export const getEventsByID = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) =>  {
    const { id } = req.params
    try {
        const getEvent = await EventModel.findById(id);
        res.status(StatusCodes.OK).json(getEvent);
    } catch (error) {
        next(error);
    }
}

export const enrollEvent = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) =>  {
    const { userID } = req.params
    const { eventID } = req.body
    try {
        const user = await User.findById(userID)
        if (user?.events.includes(eventID)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'User already enrolled in this event'
            });
            return;
        }
        const getEvent = await EventModel.findById(eventID)
        if (!getEvent) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'Event not found'
            });
            return;
        }
        user?.events.push(eventID)
        await user?.save()
        res.status(StatusCodes.OK).json({
            message: 'Event enrolled successfully'
        });
    } catch (error) {
        next(error);
    }
}

