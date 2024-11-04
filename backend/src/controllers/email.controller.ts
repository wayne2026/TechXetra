import { NextFunction, Request, Response } from "express";
import EmailModel from "../models/email.model.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { StatusCodes } from "http-status-codes";

export const getAllEmails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultPerPage = 10;
        const count = await EmailModel.countDocuments();

        const apiFeatures = new ApiFeatures(EmailModel.find().sort({ $natural: -1 }), req.query).search().filter();

        let filteredEmails = await apiFeatures.query;
        let filteredEmailsCount = filteredEmails.length;

        apiFeatures.pagination(resultPerPage);
        filteredEmails = await apiFeatures.query.clone();

        res.status(StatusCodes.OK).json({
            success: true,
            count,
            resultPerPage,
            users: filteredEmails,
            filteredEmailsCount
        });
    } catch (error) {
        next(error);
    }
}