import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    details?: { [key: string]: string };
    path?: string;
}

const ErrorMiddleware =  (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    // Wrong MongoDb Id Error
    if (err.name === "CastError") {
        const errorMessage = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(errorMessage, StatusCodes.BAD_REQUEST);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.details || {})[0];
        const errorMessage = `Duplicate ${field} entered.`;
        err = new ErrorHandler(errorMessage, StatusCodes.BAD_REQUEST);
    }

    if (err.name === "ValidationError") {
        const errors = err.details || {};
        const errorMessage = Object.values(errors).join(", ");
        err = new ErrorHandler(errorMessage, StatusCodes.BAD_REQUEST);
	}

    // Wrong JWT Error
    if (err.name === "TokenExpiredError") {
        const errorMessage = `Json Web Token is Expired, Try again later`;
        err = new ErrorHandler(errorMessage, StatusCodes.BAD_REQUEST);
    }

    // JWT Expire Error
    if (err.name === "JsonWebTokenError") {
        const errorMessage = `Json Web Token is Invalid, Try again later`;
        err = new ErrorHandler(errorMessage, StatusCodes.BAD_REQUEST);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || message,
        details: err.details || {},
    });
}

export default ErrorMiddleware;