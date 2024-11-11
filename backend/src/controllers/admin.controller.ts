import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import User, { paymentStatusEnum, roleEnum } from '../models/user.model.js';
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
        const user = await User.findById(req.params.id)
            .populate("events.eventId", "title eventDate venue")
            .populate({
                path: 'events.group.leader',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'events.group.members.user',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'events.payment.verifierId',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'events.physicalVerification.verifierId',
                select: 'firstName lastName email'
            });

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

        const newUser = await User.findByIdAndUpdate(
            user._id,
            { $set: { isBlocked: !user.isBlocked } },
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
        const { paymentStatus, physicalVerification } = req.query;

        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        const matchFilters: any = {
            "events.eventId": new mongoose.Types.ObjectId(req.params.id)
        };
        if (paymentStatus) {
            matchFilters["events.payment.status"] = paymentStatus;
        }
        if (physicalVerification) {
            matchFilters["events.physicalVerification.status"] = physicalVerification === "true";
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
                    events: {
                        $filter: {
                            input: "$events",
                            as: "event",
                            cond: {
                                $and: [
                                    { $eq: ["$$event.eventId", new mongoose.Types.ObjectId(req.params.id)] },
                                    paymentStatus ? { $eq: ["$$event.payment.status", paymentStatus] } : {},
                                    physicalVerification !== undefined ? { $eq: ["$$event.physicalVerification.status", physicalVerification === "true"] } : {}
                                ]
                            }
                        }
                    }
                }
            },
            { $unwind: "$events" },
            {
                $lookup: {
                    from: "users",
                    let: { leaderId: "$events.group.leader" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$leaderId"] } } },
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
                                schoolClass: 1,
                                collegeClass: 1
                            }
                        }
                    ],
                    as: "groupLeader"
                }
            },
            { $unwind: { path: "$groupLeader", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    let: { memberIds: "$events.group.members.user" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
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
                                schoolClass: 1,
                                collegeClass: 1
                            }
                        }
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
                            schoolClass: "$schoolClass",
                            collegeClass: "$collegeClass",
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
            },
            {
                $addFields: {
                    eventId: event._id,
                    eventTitle: event.title
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            success: true,
            users,
            count: users.length,
            eventId: event._id,
            eventTitle: event.title
        });
    } catch (error) {
        next(error);
    }
};

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
                    title: "$eventDetails.title",
                    participation: "$eventDetails.participation",
                    category: "$eventDetails.category",
                    limit: "$eventDetails.limit",
                    registered: "$eventDetails.registered"
                }
            },
            {
                $group: {
                    _id: "$eventId",
                    title: { $first: "$title" },
                    participation: { $first: "$participation" },
                    category: { $first: "$category" },
                    limit: { $first: "$limit" },
                    registered: { $first: "$registered" }
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

export const checkPhysicalVerification = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const verifier = await User.findById(req.user?._id);
        if (!verifier) {
            return next(new ErrorHandler("Verifier not found", 404));
        }
        const user = await User.findById(req.params.user);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        const userEvent = user.events.find(event => event.eventId.toString() === req.params.id as any);
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
                        verifierId: verifier._id
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update user", StatusCodes.BAD_REQUEST));
        }

        const members = userEvent.group?.members?.map(member => member.user);

        if (members && members?.length > 0) {
            await User.updateMany(
                { _id: { $in: members }, 'events.eventId': event._id },
                {
                    $set: {
                        "events.$.physicalVerification": {
                            status: true,
                            verifierId: verifier._id
                        }
                    }
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }

        res.status(200).json({
            success: true,
            message: "Physical Verification done successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const checkPaymentStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const verifier = await User.findById(req.user?._id);
        if (!verifier) {
            return next(new ErrorHandler("Verifier not found", 404));
        }
        const user = await User.findById(req.params.user);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        const userEvent = user.events.find(event => event.eventId.toString() === req.params.id as any);
        if (!userEvent) {
            return next(new ErrorHandler("User is not enrolled in this event", StatusCodes.NOT_FOUND));
        }

        const { paymentStatus } = req.body;
        if (!paymentStatus) {
            return next(new ErrorHandler("Payment status is required", StatusCodes.NOT_FOUND));
        }
        if (!Object.values(paymentStatusEnum).includes(paymentStatus)) {
            return next(new ErrorHandler("Payment status is not valid", StatusCodes.NOT_ACCEPTABLE));
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, "events.eventId": event._id },
            {
                $set: {
                    "events.$.payment": {
                        status: paymentStatus,
                        verifierId: verifier._id
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update user", StatusCodes.BAD_REQUEST));
        }

        const members = userEvent.group?.members?.map(member => member.user);

        if (members && members?.length > 0) {
            await User.updateMany(
                { _id: { $in: members }, 'events.eventId': event._id },
                {
                    $set: {
                        "events.$.payment": {
                            status: paymentStatus,
                            verifierId: verifier._id
                        }
                    }
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }

        res.status(200).json({
            success: true,
            message: "Physical Verification done successfully",
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

export const toggleAllCanRegister = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { canRegister } = req.body;

        if (typeof canRegister !== 'boolean') {
            return next(new ErrorHandler("'canRegister' is required and should be a boolean", StatusCodes.BAD_REQUEST));
        }

        const result = await Event.updateMany({}, { canRegister });

        res.status(StatusCodes.OK).json({
            success: true,
            result,
            message: `All events have been updated to canRegister = ${canRegister}`,
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
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const migrateEligibilityFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Event.updateMany(
            { "eligibility.schoolClass": { $type: "string" } },
            { $set: { "eligibility.schoolClass": ["$eligibility.schoolClass"] } }
        );

        await Event.updateMany(
            { "eligibility.collegeClass": { $type: "string" } },
            { $set: { "eligibility.collegeClass": ["$eligibility.collegeClass"] } }
        );

        res.status(200).json({
            success: true,
            message: "Eligibility fields migrated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUserEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.user);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const userEvent = user.events.find(userEvent => userEvent.eventId.toString() === event._id.toString());
        if (!userEvent) {
            return next(new ErrorHandler("Event isn't registered yet", StatusCodes.BAD_REQUEST));
        }

        const eventId = event._id;

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    events: {
                        eventId
                    },
                },
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update user", StatusCodes.BAD_REQUEST));
        }

        const members = userEvent.group?.members?.map(member => member.user);

        if (members && members?.length > 0) {
            await User.updateMany(
                { _id: { $in: members }, 'events.eventId': event._id },
                {
                    $pull: {
                        events: {
                            eventId
                        },
                    },
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }

        res.status(200).json({
            success: true,
            message: "Deleted UserEvent successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultPerPage = 10;
        const count = await Event.countDocuments();

        const apiFeatures = new ApiFeatures(Event.find().select('title category participation limit registered').sort({ $natural: -1 }), req.query).searchEvent().filter();

        let filteredEvents = await apiFeatures.query;
        let filteredEventsCount = filteredEvents.length;

        apiFeatures.pagination(resultPerPage);
        filteredEvents = await apiFeatures.query.clone();

        res.status(StatusCodes.OK).json({
            success: true,
            count,
            resultPerPage,
            events: filteredEvents,
            filteredEventsCount
        });
    } catch (error) {
        next(error);
    }
}

export const deleteEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}