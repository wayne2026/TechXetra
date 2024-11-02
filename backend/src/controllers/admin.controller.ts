import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import User, { roleEnum } from '../models/user.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import Event from '../models/event.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/jwtToken.js';
import ApiFeatures from '../utils/apiFeatures.js';
import mongoose from 'mongoose';

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
        const resultPerPage = 10;
        const count = await User.countDocuments();

        const apiFeatures = new ApiFeatures(User.find().sort({ $natural: -1 }), req.query).search().filter();

        let filteredUsers = await apiFeatures.query;
        let filteredUsersCount = filteredUsers.length;

        apiFeatures.pagination(resultPerPage);
        filteredUsers = await apiFeatures.query.clone();

        res.status(StatusCodes.OK).json({
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

export const getUsersInEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        const users = await User.aggregate([
            {
                $match: {
                    "events.eventId": new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phoneNumber: 1,
                    schoolOrCollege: 1,
                    schoolName: 1,
                    collegeName: 1,
                    "events": {
                        $filter: {
                            input: "$events",
                            as: "event",
                            cond: { $eq: ["$$event.eventId", new mongoose.Types.ObjectId(req.params.id)] }
                        }
                    }
                }
            },
            {
                $unwind: "$events"
            },
            {
                $lookup: {
                    from: "users",
                    let: { leaderId: "$events.group.leader" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$leaderId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1, schoolOrCollege: 1, schoolClass: 1, collegeClass: 1 } }
                    ],
                    as: "groupLeader"
                }
            },
            {
                $unwind: { path: "$groupLeader", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "users",
                    let: { memberIds: "$events.group.members.user" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1, schoolOrCollege: 1, schoolClass: 1, collegeClass: 1 } }
                    ],
                    as: "groupMembers"
                }
            },
            {
                $group: {
                    _id: {
                        leaderId: { $ifNull: ["$events.group.leader", "$_id"] },
                        isGroup: { $gt: [{ $size: "$events.group.members" }, 0] }
                    },
                    leader: { $first: "$groupLeader" },
                    members: { $first: "$groupMembers" },
                    user: {
                        $first: {
                            userId: "$_id",
                            firstName: "$firstName",
                            lastName: "$lastName",
                            email: "$email",
                            phoneNumber: "$phoneNumber",
                            schoolOrCollege: "$schoolOrCollege",
                            schoolName: "$schoolName",
                            collegeName: "$collegeName",
                            payment: "$events.payment",
                            physicalVerification: "$events.physicalVerification"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $cond: [
                            { $eq: ["$_id.isGroup", true] },
                            {
                                leader: "$leader",
                                members: "$members",
                                payment: "$user.payment",
                                physicalVerification: "$user.physicalVerification"
                            },
                            "$user"
                        ]
                    }
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            users,
            count: users.length
        });
    } catch (error) {
        next();
    }
}

export const getEventsRegistered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await User.aggregate([
            {
                $unwind: "$events"
            },
            {
                $group: {
                    _id: "$events.eventId",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "_id",
                    as: "eventDetails"
                }
            },
            {
                $unwind: "$eventDetails"
            },
            {
                $project: {
                    _id: 0,
                    eventId: "$_id",
                    title: "$eventDetails.title"
                }
            },
            {
                $group: {
                    _id: "$eventId",
                    title: { $first: "$title" }
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            events,
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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            user,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}