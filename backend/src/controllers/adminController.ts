import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';

export const dummyJSON = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'This is a dummy JSON response.'
    });
});
export const login = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    // const {username, password} = req.body
    const username = req.body.username;
    const password = req.body.password;
    const actual_password = "dummy_password" //Will be fetched from database which is stored in hashed form
   // Compare function will be used later , now using this only for testing purpose
    if(password === actual_password){
        res.status(200).json({
            message: 'Login Successful'
        });
    } else {
        res.status(401).json({
            message: 'Login Failed'
        });
    }
});

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    // Will be fetched from db , this is just for testing only
    const users = 
        [
            {
                name: "Dhritiman Saikia",
        email: "ex@gmail.com",
        role: "dummy"
            },
            {
                name: "Nayanjyoti Saikia",
        email: "ex@gmail.com",
        role: "dummy"
            },
            {
                name: "Amartya Saikia",
        email: "ex@gmail.com",
        role: "dummy"
            },
    ]
    
    res.status(200).json(users);
});

