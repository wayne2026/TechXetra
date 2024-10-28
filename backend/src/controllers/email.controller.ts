import { NextFunction, Request, Response } from "express";
import EmailModel from "../models/email.model.js";

export const getAllEmails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emails = await EmailModel.find();

        res.status(200).json({
            success: true,
            count: emails.length,
            emails
        })
    } catch (error) {
        next(error);
    }
}