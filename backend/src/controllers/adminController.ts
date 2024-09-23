import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';

export const dummyJSON = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'This is a dummy JSON response.'
    });
});