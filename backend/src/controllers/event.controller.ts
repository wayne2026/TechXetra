import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/event.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import path from 'path';
import fs from "fs";

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
        const events = await Event.find();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "All events",
            events,
        });
    } catch (error) {
        next(error);
    }
}

export const getEventById = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND))
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Events ${event._id}`,
            event,
        });
    } catch (error) {
        next(error);
    }
}

export const createEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, price, date, location } = req.body;

        const files = req.files as Express.Multer.File[];
        const filenames = files ? files.map(file => `${process.env.SERVER_URL}/events/${file.filename}`) : [];

        const event = await Event.create({
            title,
            description,
            price,
            info: {
                date,
                location,
            },
            images: filenames,
            creator: req.user?._id,
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        next(error);
    }
}

export const updateEventDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const { title, description, price, date, location } = req.body;

        const updatedData = {
			title: title || event.title,
            description: description || event.description,
            price: price || event.price,
            info: {
                date: date || event.info.date,
                location: location || event.info.location,
            },
        };
	
		const updatedEvent = await User.findByIdAndUpdate(
			req.user?._id,
			updatedData,
			{ new: true, runValidators: true, useFindAndModify: false }
		);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event updated successfully",
            updatedEvent,
        });
    } catch (error) {
        next(error);
    }
}

export const addEventImages = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const files = req.files as Express.Multer.File[];
        const filenames = files ? files.map(file => `${process.env.SERVER_URL}/events/${file.filename}`) : [];

        const updatedEvent = await User.findByIdAndUpdate(
			req.user?._id,
			{ $push: { images: { $each: filenames } } },
			{ new: true, runValidators: true }
		);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event Images updated successfully",
            updatedEvent,
        });
    } catch (error) {
        next(error);
    }
};

export const updateEventImages = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const { oldImageUrls } = req.body;
        const newFiles = req.files as Express.Multer.File[];
        const newImageUrls = newFiles.map(file => `${process.env.SERVER_URL}/events/${file.filename}`);

        event.images = event.images.filter((image: string) => !oldImageUrls.includes(image));
        event.images.push(...newImageUrls);
        await event.save();

        for (const url of oldImageUrls) {
            const basename = url.split('/').pop() || "";
            const imagePath = path.join('./public/events', basename);
    
            try {
                if (fs.existsSync(imagePath)) {
                    await fs.promises.unlink(imagePath);
                    console.log(`Deleted image: ${imagePath}`);
                }
            } catch (error) {
                console.error(`Error deleting image at ${imagePath}:`, error);
            }
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event images updated successfully",
            images: event.images,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteEventImages = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const { imageUrls } = req.body;

        event.images = event.images.filter((image: string) => !imageUrls.includes(image));
        await event.save();

        for (const url of imageUrls) {
            const basename = url.split('/').pop() || "";
            const imagePath = path.join('./public/events', basename);
    
            try {
                if (fs.existsSync(imagePath)) {
                    await fs.promises.unlink(imagePath);
                    console.log(`Deleted image: ${imagePath}`);
                }
            } catch (error) {
                console.error(`Error deleting image at ${imagePath}:`, error);
            }
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event images deleted successfully",
            images: event.images,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        await Event.findByIdAndDelete(req.params.id);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

// Needs changes ***
export const enrollEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
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