import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import userModel from '../models/user'
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
    const userDetails = await userModel.find()
    let userDetailsToSend: { username: string; email: string; role: string; avatar: string; }[] = []
    userDetails.forEach(user => {
        userDetailsToSend.push({
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        })
    })
    res.status(200).json(userDetailsToSend);
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
