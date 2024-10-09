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
) => {
    const { eventID } = req.body;
    const userDetail = req?.user;
    const email = userDetail?.email;

    try {
        // Fetch the user based on the authenticated user ID
        const user = await User.findOne({email})
        // Check if the user exists
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "User not found",
            });
        }

        // Check if the user is already enrolled in the event
        if (user.events.includes(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User already enrolled in this event",
            });
        }

        // Fetch the event by ID
        const event = await EventModel.findById(eventID);

        // Check if the event exists
        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Event not found",
            });
        }

        // Push the eventID to the user's events array
        user.events.push(eventID);

        // Save the user document with the new event
        const savedUser = await user.save();

        // Check if the user was saved successfully
        if (!savedUser) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to enroll in the event",
            });
        }

        // Respond with success
        return res.status(StatusCodes.OK).json({
            message: "Event enrolled successfully",
            enrolledEvents: savedUser.events, // Return the updated events array
        });
    } catch (error) {
        next(error);
    }
};

