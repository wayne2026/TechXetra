import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";
import { tryCatch } from "bullmq";


export const generatePassForUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { id } = req.params;
        const existingUser = await User.findById(id);

        if(!existingUser){
            return;
        };

        const updatedUser = await User.updateOne({
            "_id": id
        }, {
            $set: {
                "pass.hasPass": true,
                "pass.generatedAt": new Date(Date.now())
            }
        }).select("firstName lastName email phoneNumber schoolOrCollege schoolClass collegeClass hasPasss");

        console.log("Updated user after generating passes: ", updatedUser);
        res.status(200).json({
            success: true,
            message: "Pass generated successfully, payment is pending...",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    };
};