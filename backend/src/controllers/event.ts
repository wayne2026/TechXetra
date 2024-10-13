import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/event.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

export const getAllEvents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) =>  {
    try {
        const getEvents = await Event.find();
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
        const getEvent = await Event.findById(id);
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
    const userDeatils = req?.user;
    const user_id = userDeatils?.id;

    try {
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "User not found",
            });
        }

        if (user.events.includes(eventID)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User already enrolled in this event",
            });
        }

        const event = await Event.findById(eventID);

        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Event not found",
            });
        }

        user.events.push(eventID);

        const savedUser = await user.save();

        if (!savedUser) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to enroll in the event",
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Event enrolled successfully",
            enrolledEvents: savedUser.events, 
        });
    } catch (error) {
        next(error);
    }
};