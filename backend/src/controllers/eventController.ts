import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import connectDB from '../config/db';
import EventModel from '../models/events';

export const dummyJSON = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'This is a dummy JSON response.'
    });
});
export const getAllEvents = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    await connectDB()
    try {
        const getEvents = await EventModel.find();
        res.status(200).json(getEvents);
    } catch (error) {
        res.status(404).json({
            message: 'Events not found'
        });
    }
    }
);
export const getEventsByID = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    await connectDB()
    const { id } = req.params
    try {
        const getEvent = await EventModel.findById(id);
        res.status(200).json(getEvent);
    } catch (error) {
        res.status(404).json({
            message: 'Event not found'
        });
    }
});
