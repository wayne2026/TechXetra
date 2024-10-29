import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event, { participationEnum } from '../models/event.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import User, { collegeClassEnum, invitationStatusEnum, paymentStatusEnum, schoolClassEnum, schoolEnum } from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import path from 'path';
import fs from "fs";
import { addEmailToQueue } from '../utils/emailQueue.js';

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find().select('title description backgroundImage category participation');

        res.status(StatusCodes.OK).json({
            success: true,
            events,
        });
    } catch (error) {
        next(error);
    }
}

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND))
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Events ${event._id}`,
            event,
        });
    } catch (error) {
        next(error);
    }
}

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            subTitle,
            note,
            description,
            category,
            participation,
            maxGroup,
            isVisible,
            canRegister,
            externalRegistration,
            extrenalRegistrationLink,
            externalLink,
            registrationRequired,
            paymentRequired,
            amount,
            eventDate,
            venue,
            deadline,
            rules,
            schoolOrCollege,
            schoolClass,
            collegeClass
        } = req.body;

        if (!title || !description || !category || !participation || !eventDate) {
            return next(new ErrorHandler("All fields are required", StatusCodes.NOT_FOUND));
        }
        if (rules && !Array.isArray(rules)) {
            return next(new ErrorHandler("Rules should be an array", StatusCodes.BAD_REQUEST));
        }
        if (rules && !rules.every((rule: any) => typeof rule === 'string')) {
            return next(new ErrorHandler("All rules should be strings", StatusCodes.BAD_REQUEST));
        }
        if (schoolOrCollege && !Object.values(schoolEnum).includes(schoolOrCollege)) {
            return next(new ErrorHandler("Invalid field SchoolOrCollege", 400));
        }
        if (schoolClass && !Object.values(schoolClassEnum).includes(schoolClass)) {
            return next(new ErrorHandler("Invalid field SchoolClass", 400));
        }
        if (collegeClass && !Object.values(collegeClassEnum).includes(collegeClass)) {
            return next(new ErrorHandler("Invalid field CollegeClass", 400));
        }

        const eventImage = req.files && !Array.isArray(req.files) && req.files["image"]
            ? `${process.env.SERVER_URL}/events/${(req.files["image"] as Express.Multer.File[])[0].filename}`
            : "";

        const eventBackground = req.files && !Array.isArray(req.files) && req.files["event"]
            ? `${process.env.SERVER_URL}/events/${(req.files["event"] as Express.Multer.File[])[0].filename}`
            : "";

        const event = await Event.create({
            title,
            subTitle,
            note,
            description,
            category,
            participation,
            maxGroup,
            isVisible: Boolean(isVisible),
            canRegister: Boolean(canRegister),
            externalRegistration: Boolean(externalRegistration),
            extrenalRegistrationLink,
            externalLink,
            registrationRequired: Boolean(registrationRequired),
            paymentRequired: Boolean(paymentRequired),
            amount,
            eventDate,
            venue,
            deadline,
            rules,
            images: eventImage,
            backgroundImage: eventBackground,
            eligibility: {
                schoolOrCollege,
                schoolClass,
                collegeClass
            },
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        next(error);
    }
}

const deleteOldImage = async (imageUrl: string, folder: string) => {
    if (imageUrl && imageUrl.length > 0) {
        const basename = imageUrl.split('/').pop() || "";
        const imagePath = path.join(`./public/${folder}`, basename);

        try {
            if (fs.existsSync(imagePath)) {
                await fs.promises.unlink(imagePath);
            }
        } catch (error) {
            console.error(`Error deleting ${folder} image:`, error);
        }
    }
};

export const updateEventDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const {
            title,
            subTitle,
            note,
            description,
            category,
            participation,
            maxGroup,
            isVisible,
            canRegister,
            externalRegistration,
            extrenalRegistrationLink,
            externalLink,
            registrationRequired,
            paymentRequired,
            amount,
            eventDate,
            venue,
            deadline,
            rules,
            schoolOrCollege,
            schoolClass,
            collegeClass
        } = req.body;

        if (rules && !Array.isArray(rules)) {
            return next(new ErrorHandler("Rules should be an array", StatusCodes.BAD_REQUEST));
        }
        if (rules && !rules.every((rule: any) => typeof rule === 'string')) {
            return next(new ErrorHandler("All rules should be strings", StatusCodes.BAD_REQUEST));
        }
        if (schoolOrCollege && !Object.values(schoolEnum).includes(schoolOrCollege)) {
            return next(new ErrorHandler("Invalid field SchoolOrCollege", 400));
        }
        if (schoolClass && !Object.values(schoolClassEnum).includes(schoolClass)) {
            return next(new ErrorHandler("Invalid field SchoolClass", 400));
        }
        if (collegeClass && !Object.values(collegeClassEnum).includes(collegeClass)) {
            return next(new ErrorHandler("Invalid field CollegeClass", 400));
        }

        const eventImage = req.files && !Array.isArray(req.files) && req.files["image"]
            ? `${process.env.SERVER_URL}/events/${(req.files["image"] as Express.Multer.File[])[0].filename}`
            : "";

        const eventBackground = req.files && !Array.isArray(req.files) && req.files["event"]
            ? `${process.env.SERVER_URL}/events/${(req.files["event"] as Express.Multer.File[])[0].filename}`
            : "";

        if (eventImage && event?.image && event?.image.length > 0) {
            await deleteOldImage(event?.image, 'events');
        }

        if (eventBackground && event?.backgroundImage && event?.backgroundImage.length > 0) {
            await deleteOldImage(event?.backgroundImage, 'events');
        }

        const updatedData = {
            title: title || event.title,
            subTitle: subTitle || event.subTitle,
            note: note || event.note,
            description: description || event.description,
            category: category || event.category,
            participation: participation || event.participation,
            maxGroup: maxGroup || event.maxGroup,
            isVisible: typeof isVisible === 'string' ? isVisible === 'true' : event.isVisible,
            canRegister: typeof canRegister === 'string' ? canRegister === 'true' : event.canRegister,
            externalRegistration: typeof externalRegistration === 'string' ? externalRegistration === 'true' : event.externalRegistration,
            extrenalRegistrationLink: extrenalRegistrationLink || event.extrenalRegistrationLink,
            externalLink: externalLink || event.externalLink,
            registrationRequired: typeof registrationRequired === 'string' ? registrationRequired === 'true' : event.registrationRequired,
            paymentRequired: typeof paymentRequired === 'string' ? paymentRequired === 'true' : event.paymentRequired,
            amount: amount || event.amount,
            eventDate: eventDate || event.eventDate,
            venue: venue || event.venue,
            deadline: deadline || event.deadline,
            rules: rules || event.rules,
            eligibility: {
                schoolOrCollege: schoolOrCollege || event?.eligibility?.schoolOrCollege,
                schoolClass: schoolClass || event?.eligibility?.schoolClass,
                collegeClass: collegeClass || event?.eligibility?.collegeClass,
            },
            image: eventImage || event.image,
            backgroundImage: eventBackground || event.backgroundImage,
        };

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            updatedData,
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event updated successfully",
            updatedEvent,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteEventById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const deleteAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Event.deleteMany();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "All Events deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const addEventDetailsArray = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return next(new ErrorHandler("Data should be an array of events", StatusCodes.BAD_REQUEST));
        }

        const events = await Event.insertMany(data);

        res.status(StatusCodes.CREATED).json({
            success: true,
            count: events.length,
            events,
        });
    } catch (error) {
        next(error);
    }
}

export const updateEventBackGroundImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND))
        }

        const filename = req.file ? `${process.env.SERVER_URL}/events/${req.file.filename}` : "";
        if (req.file && event?.backgroundImage && event?.backgroundImage?.length > 0) {
            const basename = event?.backgroundImage?.split('/').pop() || "";
            const imagePath = path.join('./public/events', basename);
            try {
                if (fs.existsSync(imagePath)) {
                    await fs.promises.unlink(imagePath);
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { backgroundImage: filename },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.status(200).json({
            success: true,
            event: updatedEvent,
            message: "BackGround Image updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const enrollEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }

        if (user.events.some(userEvent => userEvent.eventId.toString() === event._id.toString())) {
            return next(new ErrorHandler("Already registered for this event", StatusCodes.FORBIDDEN));
        }

        if (!event.canRegister || !event.isVisible) {
            return next(new ErrorHandler("Registration is not allowed for this event", StatusCodes.FORBIDDEN));
        }
        if (!event.registrationRequired) {
            return next(new ErrorHandler("No registration required for this event", StatusCodes.FORBIDDEN));
        }
        if (event.externalRegistration) {
            return next(new ErrorHandler("Registration will be done externally for this event", StatusCodes.FORBIDDEN));
        }
        if (event.deadline && event.deadline.getTime() <= Date.now()) {
            return next(new ErrorHandler("Registration deadline has passed", StatusCodes.FORBIDDEN));
        }

        const schoolOrCollegeEligibility = event.eligibility?.schoolOrCollege
            ? event.eligibility.schoolOrCollege === user.schoolOrCollege
            : true; // If undefined, treat it as eligible

        const schoolClassEligibility = event.eligibility?.schoolClass && event.eligibility.schoolOrCollege === 'SCHOOL'
            ? event.eligibility.schoolClass === user.schoolClass
            : true; // If undefined or not a SCHOOL event, treat it as eligible

        const collegeClassEligibility = event.eligibility?.collegeClass && event.eligibility.schoolOrCollege === 'COLLEGE'
            ? event.eligibility.collegeClass === user.collegeClass
            : true; // If undefined or not a COLLEGE event, treat it as eligible

        const eligible = schoolOrCollegeEligibility && schoolClassEligibility && collegeClassEligibility;

        if (event.eligibility && !eligible) {
            return next(new ErrorHandler(`User's eligibility does not match with the event`, StatusCodes.FORBIDDEN));
        }

        const { memberEmails } = req.body;
        if (memberEmails && !Array.isArray(memberEmails)) {
            return next(new ErrorHandler("Data should be an array of events", StatusCodes.BAD_REQUEST));
        }
        if (memberEmails.length > (event.maxGroup! - 1)) {
            return next(new ErrorHandler("Data exceeded limit", StatusCodes.BAD_REQUEST));
        }
        if ((event.participation === participationEnum.TEAM) && (!memberEmails || memberEmails.length === 0)) {
            return next(new ErrorHandler("Group members are required", StatusCodes.BAD_REQUEST));
        }

        const groupMembers = await User.find({ email: memberEmails }).select('email isVerified events schoolOrCollege schoolClass collegeClass');
        const teamMembersArray = groupMembers.map(member => ({
            status: invitationStatusEnum.PENDING,
            user: member._id,
        }));

        let alreadyJoinedMembers: string[] = [];
        groupMembers.forEach(userEvents => {
            if (userEvents.events.some(userEvent => userEvent.eventId.toString() === event._id.toString())) {
                alreadyJoinedMembers.push(userEvents.email);
            }
        });
        if (alreadyJoinedMembers.length > 0) {
            return next(new ErrorHandler(`The following users have already participated in the event: ${alreadyJoinedMembers.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        const unverifiedMembers = groupMembers.filter(member => !member.isVerified);
        if (unverifiedMembers.length > 0) {
            const unverifiedEmails = unverifiedMembers.map(member => member.email);
            return next(new ErrorHandler(`The following users are not verified: ${unverifiedEmails.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        let notEligibleMembers: string[] = []
        groupMembers.forEach(member => {
            const schoolOrCollegeEligibility = event.eligibility?.schoolOrCollege
                ? event.eligibility.schoolOrCollege === member.schoolOrCollege
                : true; // If undefined, treat it as eligible

            const schoolClassEligibility = event.eligibility?.schoolClass && event.eligibility.schoolOrCollege === 'SCHOOL'
                ? event.eligibility.schoolClass === member.schoolClass
                : true; // If undefined or not a SCHOOL event, treat it as eligible

            const collegeClassEligibility = event.eligibility?.collegeClass && event.eligibility.schoolOrCollege === 'COLLEGE'
                ? event.eligibility.collegeClass === member.collegeClass
                : true; // If undefined or not a COLLEGE event, treat it as eligible

            const eligible = schoolOrCollegeEligibility && schoolClassEligibility && collegeClassEligibility;

            if (event.eligibility && !eligible) {
                notEligibleMembers.push(member.email);
            }
        });
        if (notEligibleMembers.length > 0) {
            return next(new ErrorHandler(`The following users are not eligible to participate in the event: ${notEligibleMembers.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        const isGroup = ((event.participation === participationEnum.TEAM) || ((event.participation === participationEnum.HYBRID) && teamMembersArray.length > 0)) ? true : false;

        const eventObject: any = {
            eventId: event._id,
            paymentRequired: event.paymentRequired,
            eligible,
            isGroup,
            group: {
                leader: user._id,
                members: isGroup ? teamMembersArray : undefined,
            },
        }

        if (event.paymentRequired) {
            eventObject.payment = {
                status: paymentStatusEnum.PENDING,
                amount: event.amount ? Number(event.amount) : 100,
            }
        }

        const updateUserEvent = await User.findByIdAndUpdate(
            user._id,
            {
                $push: {
                    events: eventObject,
                }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        ).select("events")
            .populate("events.eventId", "title eventDate venue")
            .populate({
                path: 'events.group.leader', // Populate the leader field in events.group
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            })
            .populate({
                path: 'events.group.members.user', // Populate the members' user field in events.group
                select: 'firstName lastName email' // Select the fields you want from the populated User documents
            })
            .populate({
                path: 'events.payment.verifierId', // Populate the verifierId field in events.payment
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            })
            .populate({
                path: 'events.physicalVerification.verifierId', // Populate verifierId in physicalVerification
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            });

        groupMembers.forEach(async (member) => {
            try {
                const message = `${user.firstName} has sent you an invite to participate in ${event.title} \n\n Please check you profile and click on ✉ \n\n ${process.env.CLIENT_URL}/profile`;

                await addEmailToQueue({
                    email: member.email,
                    subject: `TechXetra | Event Invitation`,
                    message,
                });

                const inviteObject = {
                    eventId: event._id,
                    userId: user._id,
                    status: invitationStatusEnum.PENDING,
                }

                await User.findByIdAndUpdate(
                    member._id,
                    {
                        $push: {
                            invites: inviteObject,
                        }
                    },
                    { new: true, runValidators: true, useFindAndModify: false }
                );
            } catch (error) {
                console.error('Error sending email:', error);
            }
        });

        res.status(200).json({
            success: true,
            user: updateUserEvent,
            message: `Event registered successfully. ${isGroup ? `Invite sent to ${memberEmails.join(', ')}, tell them to check their email or profile.` : ""}`
        });
    } catch (error) {
        next(error);
    }
};

export const addMembers = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }

        if (!user.events.some(userEvent => userEvent.eventId.toString() === event._id.toString())) {
            return next(new ErrorHandler(`Event is not regostered yet`, StatusCodes.BAD_REQUEST));
        }

        if (event.participation === participationEnum.SOLO) {
            return next(new ErrorHandler("Solo event cannot be registered with members", StatusCodes.BAD_REQUEST));
        }

        if (event.deadline && event.deadline.getTime() <= Date.now()) {
            return next(new ErrorHandler("Registration deadline has passed", StatusCodes.FORBIDDEN));
        }

        const prevMembers = user.events.filter(userEvent => userEvent.eventId.toString() === event._id.toString())[0].group?.members || [];

        const { memberEmails } = req.body;
        if (memberEmails && !Array.isArray(memberEmails)) {
            return next(new ErrorHandler("Data should be an array of events", StatusCodes.BAD_REQUEST));
        }

        if (memberEmails && memberEmails.length > (event.maxGroup! - (1 + prevMembers?.length))) {
            return next(new ErrorHandler("Data exceeded limit", StatusCodes.BAD_REQUEST));
        }
        if ((event.participation === participationEnum.TEAM) && (!memberEmails || memberEmails.length === 0)) {
            return next(new ErrorHandler("Group members are required", StatusCodes.BAD_REQUEST));
        }

        const groupMembers = await User.find({ email: memberEmails }).select('email isVerified events schoolOrCollege schoolClass collegeClass');
        const teamMembersArray = groupMembers.map(member => ({
            status: invitationStatusEnum.PENDING,
            user: member._id,
        }));

        const newMembers = teamMembersArray.filter(newMember => {
            return !prevMembers.some(prevMember => prevMember.user.toString() === newMember.user.toString());
        });

        if (newMembers.length === 0) {
            return next(new ErrorHandler("No new members to add", StatusCodes.BAD_REQUEST));
        }

        let alreadyJoinedMembers: string[] = [];
        groupMembers.forEach(user => {
            if (user.events.some(userEvent => userEvent.eventId.toString() === event._id.toString())) {
                alreadyJoinedMembers.push(user.email);
            }
        });
        if (alreadyJoinedMembers.length > 0) {
            return next(new ErrorHandler(`The following users have already participated in the event: ${alreadyJoinedMembers.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        const unverifiedMembers = groupMembers.filter(member => !member.isVerified);
        if (unverifiedMembers.length > 0) {
            const unverifiedEmails = unverifiedMembers.map(member => member.email);
            return next(new ErrorHandler(`The following users are not verified: ${unverifiedEmails.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        let notEligibleMembers: string[] = []
        groupMembers.forEach(member => {
            const schoolOrCollegeEligibility = event.eligibility?.schoolOrCollege
                ? event.eligibility.schoolOrCollege === member.schoolOrCollege
                : true; // If undefined, treat it as eligible

            const schoolClassEligibility = event.eligibility?.schoolClass && event.eligibility.schoolOrCollege === 'SCHOOL'
                ? event.eligibility.schoolClass === member.schoolClass
                : true; // If undefined or not a SCHOOL event, treat it as eligible

            const collegeClassEligibility = event.eligibility?.collegeClass && event.eligibility.schoolOrCollege === 'COLLEGE'
                ? event.eligibility.collegeClass === member.collegeClass
                : true; // If undefined or not a COLLEGE event, treat it as eligible

            // Final eligibility check: All conditions that are defined must be true for the user to be eligible.
            const eligible = schoolOrCollegeEligibility && schoolClassEligibility && collegeClassEligibility;

            if (event.eligibility && !eligible) {
                notEligibleMembers.push(member.email);
            }
        });
        if (notEligibleMembers.length > 0) {
            return next(new ErrorHandler(`The following users are not eligible to participate in the event: ${notEligibleMembers.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        const updateUserEvent = await User.findOneAndUpdate(
            { _id: user._id, 'events._id': event._id },
            {
                $push: { 'events.$.group.members': teamMembersArray }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        groupMembers.forEach(async (member) => {
            try {
                const message = `${user.firstName} has sent you an invite to participate in ${event.title} \n\n Please check you profile and click on ✉ \n\n ${process.env.CLIENT_URL}/profile`;

                await addEmailToQueue({
                    email: member.email,
                    subject: `TechXetra | Event Invitation`,
                    message,
                });

                const inviteObject = {
                    eventId: event._id,
                    userId: user._id,
                    status: invitationStatusEnum.PENDING,
                }

                await User.findByIdAndUpdate(
                    member._id,
                    {
                        $push: {
                            invites: inviteObject,
                        }
                    },
                    { new: true, runValidators: true, useFindAndModify: false }
                );
            } catch (error) {
                console.error('Error sending email:', error);
            }
        });

        res.status(200).json({
            success: true,
            event: updateUserEvent,
            message: `Event registered successfully. ${memberEmails.length > 0 ? `Invite sent to ${memberEmails.join(', ')}, tell them to check their email or profile.` : ""}`
        });
    } catch (error) {
        next(error);
    }
}

export const removeMember = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }

        const userEvent = user.events.find(userEvent => userEvent.eventId.toString() === event._id.toString());
        if (!userEvent) {
            return next(new ErrorHandler(`User is not registered for this event`, StatusCodes.BAD_REQUEST));
        }

        if (event.participation === participationEnum.SOLO) {
            return next(new ErrorHandler("Solo event cannot have members", StatusCodes.BAD_REQUEST));
        }

        if (event.deadline && event.deadline.getTime() <= Date.now()) {
            return next(new ErrorHandler("Registration deadline has passed", StatusCodes.FORBIDDEN));
        }

        if (userEvent?.group?.leader && userEvent?.group?.leader?.toString() !== user._id.toString()) {
            return next(new ErrorHandler("Only the leader can remove members", StatusCodes.FORBIDDEN));
        }

        const { memberId } = req.body;
        if (!memberId) {
            return next(new ErrorHandler("Member id is required", StatusCodes.BAD_REQUEST));
        }

        const member = await User.findById(memberId);
        if (!member) {
            return next(new ErrorHandler("Member not found", StatusCodes.NOT_FOUND));
        }

        if (!userEvent.group?.members?.length) {
            return next(new ErrorHandler("No members to remove", StatusCodes.BAD_REQUEST));
        }

        const isMemberInGroup = userEvent.group.members.some(eventMember => eventMember.user.toString() === member._id.toString());
        if (!isMemberInGroup) {
            return next(new ErrorHandler("The ID provided does not belong to a member in this group", StatusCodes.BAD_REQUEST));
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, 'events.eventId': event._id },
            {
                $pull: { 'events.$.group.members': { user: member._id } }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        await User.findOneAndUpdate(
            { _id: member._id },
            {
                $pull: { events: { eventId: event._id } }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Member removed successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const checkOutInvitation = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }

        const { eventId, userId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${eventId}`, StatusCodes.NOT_FOUND));
        }
        const inviter = await User.findById(userId);
        if (!inviter) {
            return next(new ErrorHandler("Inviter not found", StatusCodes.NOT_FOUND));
        }

        if (!inviter.events.some(inviterEvent => inviterEvent.eventId.toString() === event._id.toString())) {
            return next(new ErrorHandler("Invalid Invite request! 1", StatusCodes.BAD_REQUEST));
        }

        if (user.events.some(userEvent => userEvent.eventId.toString() === event._id.toString())) {
            return next(new ErrorHandler("Invalid Invite request! 2", StatusCodes.BAD_REQUEST));
        }

        if (!user.invites.some(userInvite => (userInvite.eventId.toString() === event._id.toString() && userInvite.userId.toString() === inviter._id.toString()))) {
            return next(new ErrorHandler("Invalid Invite request! 3", StatusCodes.BAD_REQUEST));
        }

        const { choice } = req.body;
        if (!choice) {
            return next(new ErrorHandler("Choice is required", StatusCodes.BAD_REQUEST));
        }
        if (![invitationStatusEnum.ACCEPTED, invitationStatusEnum.REJECTED].includes(choice)) {
            return next(new ErrorHandler("Choice should be either ACCEPTED or REJECTED", StatusCodes.NOT_ACCEPTABLE));
        }

        const updatedInviter = await User.findOneAndUpdate(
            { _id: inviter._id, 'events.eventId': event._id, 'events.group.members.user': user._id },
            {
                $set: {
                    'events.$[event].group.members.$[member].status': choice,
                }
            },
            {
                arrayFilters: [
                    { 'event.eventId': event._id },
                    { 'member.user': user._id }
                ],
                new: true,
                runValidators: true
            }
        )

        if (!updatedInviter) {
            return next(new ErrorHandler("Failed to update inviter", StatusCodes.BAD_REQUEST));
        }

        try {
            await addEmailToQueue({
                email: inviter.email,
                subject: `TechXetra | Event Invitation`,
                message: `${user.firstName} has accepted your Invitation for ${event.title}`,
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    invites: {
                        eventId,
                        // userId,
                    },
                },
                ...(choice === invitationStatusEnum.ACCEPTED && {
                    $push: {
                        events: updatedInviter?.events.find(inviterEvent => inviterEvent.eventId.toString() === event._id.toString())
                    }
                })
            },
            { new: true, runValidators: true, useFindAndModify: false }
        ).select("events invites");

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update user", StatusCodes.BAD_REQUEST));
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Invite checked out successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { keyword } = req.query;
        const query = keyword ? { email: { $regex: keyword, $options: 'i' } } : {};

        const users = await User.find(query).select("email").sort({ $natural: -1 }).limit(5);

        res.status(StatusCodes.OK).json({
            success: true,
            users,
            count: users.length
        });
    } catch (error) {
        next(error);
    }
};

export const updatePaymentDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }
        if (!event.paymentRequired) {
            return next(new ErrorHandler("Event isn't required in this event", StatusCodes.BAD_REQUEST));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
        }
        const userEvent = user.events.find(userEvent => userEvent.eventId.toString() === event._id.toString());
        if (!userEvent) {
            return next(new ErrorHandler("Event isn't registered yet", StatusCodes.BAD_REQUEST));
        }

        if (userEvent?.payment && userEvent.payment.status !== paymentStatusEnum.PENDING) {
            return next(new ErrorHandler("Payment already done", StatusCodes.BAD_REQUEST));
        }

        if (userEvent.group?.leader?.toString() !== user._id.toString()) {
            return next(new ErrorHandler("Only leader can make payment", StatusCodes.BAD_REQUEST));
        }

        if (!req.file || !req.file.filename) {
            return next(new ErrorHandler("No payment image uploaded", StatusCodes.BAD_REQUEST));
        }
        const filename = `${process.env.SERVER_URL}/payments/${req.file.filename}`;

        const { transactionId } = req.body;
        if (!transactionId) {
            return next(new ErrorHandler("Transaction ID is required", StatusCodes.BAD_REQUEST));
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user?._id, 'events.eventId': event._id },
            {
                $set: {
                    'events.$.payment.status': paymentStatusEnum.SUBMITTED,
                    'events.$.payment.transactionId': transactionId,
                    'events.$.payment.paymentImage': filename,
                }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        ).select("events")
            .populate("events.eventId", "title eventDate venue")
            .populate({
                path: 'events.group.leader', // Populate the leader field in events.group
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            })
            .populate({
                path: 'events.group.members.user', // Populate the members' user field in events.group
                select: 'firstName lastName email' // Select the fields you want from the populated User documents
            })
            .populate({
                path: 'events.payment.verifierId', // Populate the verifierId field in events.payment
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            })
            .populate({
                path: 'events.physicalVerification.verifierId', // Populate verifierId in physicalVerification
                select: 'firstName lastName email' // Select the fields you want from the populated User document
            });

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update inviter", StatusCodes.BAD_REQUEST));
        }

        const members = userEvent.group?.members?.map(member => member.user);

        if (members && members?.length > 0) {
            await User.updateMany(
                { _id: { $in: members }, 'events.eventId': event._id },
                {
                    $set: {
                        'events.$.payment.status': paymentStatusEnum.SUBMITTED,
                        'events.$.payment.transactionId': transactionId,
                        'events.$.payment.paymentImage': filename,
                    }
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "User Payment details updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUserEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);
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
        ).select("events invites");

        if (!updatedUser) {
            return next(new ErrorHandler("Failed to update user", StatusCodes.BAD_REQUEST));
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Delete UserEvent successfully"
        });
    } catch (error) {
        next(error);
    }
}