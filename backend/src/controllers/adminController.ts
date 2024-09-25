import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import userModel from '../models/user'
import EventModel from '../models/events';
import connectDB from '../config/db';

export const dummyJSON = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'This is a dummy JSON response.'
    });
});
export const login = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body
    await connectDB()
    const doesUserExist = await userModel.countDocuments({email: email})
    if(doesUserExist == 0){
        res.status(401).json({
            message: 'User does not exist'
        });
    } else {
    const userDetails = await userModel.find({email: email})
    const actual_password = userDetails[0].password
   // Compare function will be used later , now using this only for testing purpose
    if(password === actual_password){
        res.status(200).json({
            message: 'Login Successful'
        });
    } else {
        res.status(401).json({
            message: 'Login Failed',
        });
    }
}
});

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    await connectDB()
    try {
        const userDetails = await userModel.find();
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(404).json({
            message: 'Users not found'
        });
    }
});

export const changeRoll = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { role } = req.body
    await connectDB();
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            { role: role },
            { new: true }
        );
        res.status(200).json({ message: 'Role updated successfully', updatedUser });
    } catch (error) {
        res.status(200).json({ message: 'User does not exist'});
    }
});

export const newEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, price, info, images } = req.body;
     // Validations
     if (!title || !description || !price || !info?.date || !info?.location || !images) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    await connectDB();
    try {
        const new_event = await EventModel.create({
            title,
            description,
            price,
            info: {
                date: info.date,
                location: info.location
            },
            images, // This should be an array
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            new_event,
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Event creation failed'
        });
    }
});
export const getEventsEnrolledByUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    await connectDB()
    try {
        const getUser = await userModel.findById(id)
        const events = await EventModel.find({ _id: { $in: getUser?.events } });
        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({
            message: 'User not found'
        });
    }
}
)