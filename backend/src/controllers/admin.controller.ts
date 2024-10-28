import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import User, { roleEnum } from '../models/user.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import Event from '../models/event.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/jwtToken.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter Email and Password", StatusCodes.NOT_FOUND));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid Credentials", StatusCodes.UNAUTHORIZED));
        }

        if (user.role === roleEnum.USER) {
            return next(new ErrorHandler("Unauthorized accesss", StatusCodes.UNAUTHORIZED));
        }

        if (user.isBlocked) {
            return next(new ErrorHandler("Account is blocked", StatusCodes.FORBIDDEN));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Credentials", StatusCodes.UNAUTHORIZED));
        }

        sendToken(user, StatusCodes.OK, res);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultPerPage = 3;
        const count = await User.countDocuments();

        const apiFeatures = new ApiFeatures(User.find().sort({ $natural: -1 }), req.query).search().filter();

        let filteredUsers = await apiFeatures.query;
        let filteredUsersCount = filteredUsers.length;

        apiFeatures.pagination(resultPerPage);
        filteredUsers = await apiFeatures.query.clone();

        return res.status(200).json({
            success: true,
            count,
            resultPerPage,
            users: filteredUsers,
            filteredUsersCount
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            user,
            message: "User role updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const toggleBlockUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (String(req.user?._id) === req.params.id) {
            return next(new ErrorHandler("Cannot block or unblock yourself", 400));
        }

        const newUser = await User.findById(
            user._id,
            { isBlocked: !user.isBlocked },
            { new: true, runValidators: true, useFindAndModify: false }
        )

        res.status(200).json({
            success: true,
            user: newUser,
            message: `User ${!user.isBlocked ? "Blocked" : "Unlocked"}`
        });
    } catch (error) {
        next(error);
    }
};

export const updatedUserRole = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (String(req.user?._id) === req.params.id) {
            return next(new ErrorHandler("Changing self role is prohibited", 400));
        }

        const { role } = req.body;
        if (!role) {
            return next(new ErrorHandler("Please provide a role", 400));
        }

        if (!Object.values(roleEnum).includes(role)) {
            return next(new ErrorHandler("Invalid role", 400));
        }

        if (user.role === role) {
            return next(new ErrorHandler(`User is already set to ${role} role`, 400));
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { role },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "User role updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getEventsEnrolledByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const eventIds = user?.events?.map(event => event.eventId) || [];
        const events = await Event.find({ _id: { $in: eventIds } });

        res.status(StatusCodes.OK).json({
            success: true,
            data: events,
            count: events.length
        });
    } catch (error) {
        next(error);
    }
}

export const verifyUsersEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const event = await Event.findById(req.query.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        const userEvent = user.events.find(event => event.eventId === req.query.id as any);
        if (!userEvent) {
            return next(new ErrorHandler("User is not enrolled in this event", 400));
        }
        if (userEvent && userEvent.physicalVerification.status) {
            return next(new ErrorHandler("User has already verified this event", 400));
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, "events.eventId": event._id },
            {
                $set: {
                    "events.$.physicalVerification": {
                        status: true,
                        verifierId: user._id
                    }
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const getUsersParticularEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const eventIds = user?.events?.map(event => event.eventId) || [];

        if (eventIds.length > 0 && !eventIds.includes(req.query.id as any)) {
            return next(new ErrorHandler("User is not enrolled in this event", 400));
        }

        const userEvent = user.events.find(event => event.eventId === req.query.id as any);

        const event = await Event.findById(req.query.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            user: user,
            data: userEvent,
            event
        });
    } catch (error) {
        next(error);
    }
}

export const toggleAllIsVisible = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { isVisible } = req.body;

        if (typeof isVisible !== 'boolean') {
            return next(new ErrorHandler("'isVisible' is required and should be a boolean", StatusCodes.BAD_REQUEST));
        }

        const result = await Event.updateMany({}, { isVisible });

        res.status(StatusCodes.OK).json({
            success: true,
            result,
            message: `All events have been updated to isVisible = ${isVisible}`,
        });
    } catch (error) {
        next(error);
    }
}