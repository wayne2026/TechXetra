import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event, { participationEnum } from '../models/event.model.js';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import User, { collegeClassEnum, schoolClassEnum, schoolEnum } from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import path from 'path';
import fs from "fs";

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) =>  {
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

export const getEventById = async (req: Request, res: Response, next: NextFunction) =>  {
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

export const createEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const booleanFields = [
            'isVisible',
            'canRegister',
            'externalRegistration',
            'registrationRequired',
            'paymentRequired'
        ];

        const { 
            title, 
            subTitle, 
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
        for (const field of booleanFields) {
            if (typeof req.body[field] !== 'undefined' && typeof req.body[field] !== 'boolean') {
                return next(new ErrorHandler(`${field} should be a boolean`, StatusCodes.BAD_REQUEST));
            }
        }

        const filename = req.file ? `${process.env.SERVER_URL}/events/${req.file.filename}` : "";

        const event = await Event.create({
            title,
            subTitle,
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
            images: filename,
            eligibility: {
                schoolOrCollege,
                schoolClass,
                collegeClass
            },
            creator: req.user?._id,
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

export const updateEventDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND));
        }

        const { title } = req.body;

        const updatedData = {
			title: title || event.title,
            // description: description || event.description,
        };
	
		const updatedEvent = await User.findByIdAndUpdate(
			req.user?._id,
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
            return next(new ErrorHandler(`Event not found with id ${req.params.id}`, StatusCodes.NOT_FOUND))
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
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

        const eligible = (event.eligibility?.schoolOrCollege === user?.schoolOrCollege) && (event.eligibility?.schoolClass === user?.schoolClass) && (event.eligibility?.collegeClass === user?.collegeClass);
        if (!eligible) {
            return next(new ErrorHandler("User's eligibility does not match with the event", StatusCodes.FORBIDDEN));
        }

        const { memberEmails } = req.body;
        if (memberEmails && !Array.isArray(memberEmails)) {
            return next(new ErrorHandler("Data should be an array of events", StatusCodes.BAD_REQUEST));
        }
        if (memberEmails && memberEmails.length > event.maxGroup!) {
            return next(new ErrorHandler("Data exceeded limit", StatusCodes.BAD_REQUEST));
        }
        if ([participationEnum.HYBRID, participationEnum.TEAM].includes(event.participation as any) && (!memberEmails || memberEmails.length === 0)) {
            return next(new ErrorHandler("Group members are required", StatusCodes.BAD_REQUEST));
        }

        const groupMembers = await User.find({ email: memberEmails }).select('email isVerified');
        const teamMembersArray = groupMembers.map(member => member._id);
        const unverifiedMembers = groupMembers.filter(member => !member.isVerified);
        if (unverifiedMembers.length > 0) {
            const unverifiedEmails = unverifiedMembers.map(member => member.email);
            return next(new ErrorHandler(`The following users are not verified: ${unverifiedEmails.join(', ')}`, StatusCodes.BAD_REQUEST));
        }

        const isGroup = [participationEnum.HYBRID, participationEnum.TEAM].includes(event.participation as any) ? true : false;

        const eventObject = {
            eventId: event._id,
            paymentRequired: event.paymentRequired,
            eligible,
            isGroup,
            members: isGroup ? teamMembersArray : undefined,
        }

        const updateUserEvent = await User.findByIdAndUpdate(
			user._id,
			{
                $push: {
                    events: eventObject,
                }
            },
			{ new: true, runValidators: true, useFindAndModify: false }
		);

        res.status(200).json({
			success: true,
			event: eventObject,
            user: updateUserEvent,
			message: "Event registered successfully"
		});
    } catch (error) {
        next(error);
    }
};

export const unenrollEvent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export const updatePaymentDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
}