import mongoose, { Schema, Document } from "mongoose";
import { collegeClassEnum, schoolClassEnum, schoolEnum } from "./user.model.js";

export const participationEnum = {
	SOLO: "SOLO",
    TEAM: "TEAM",
    HYBRID: "HYBRID"
} as const;

export const categoryEnum = {
    TECHNICAL: "TECHNICAL",
    CULTURAL: "CULTURAL",
    SPORTS: "SPORTS",
    ESPORTS: "ESPORTS",
    GENERAL: "GENERAL",
    MISCELLANEOUS: "MISCELLANEOUS"
} as const;

interface IEvent extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    smallDescription: string;
    description?: string;
    category: typeof categoryEnum[keyof typeof categoryEnum];
    participation: typeof participationEnum[keyof typeof participationEnum];
    maxGroup?: number;
    registrationRequired: boolean;
    paymentRequired: boolean;
    amount?: number;
    eventDate: Date;
    venue?: string;
    deadline?: Date;
    images?: string[];
    backgroundImage?: string;
    eligibility?: {
        schoolOrCollege: typeof schoolEnum[keyof typeof schoolEnum];
        collegeClass?: typeof collegeClassEnum[keyof typeof collegeClassEnum];
        schoolClass?: typeof schoolClassEnum[keyof typeof schoolClassEnum];
    }
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        smallDescription: {
            type: String,
            required: true,
        },
        description: String,
        category: {
            type: String,
            enum: Object.values(categoryEnum),
            required: true,
        },
        participation: {
            type: String,
            enum: Object.values(participationEnum),
            required: true,
        },
        maxGroup: Number,
        registrationRequired: {
            type: Boolean,
            required: true,
            default: true,
        },
        paymentRequired: {
            type: Boolean,
            required: true,
            default: true,
        },
        amount: Number,
        eventDate: {
            type: Date,
            required: true,
            default: Date.now()
        },
        venue: String,
        images: [String],
        deadline: Date,
        backgroundImage: String,
        eligibility: {
            schoolOrCollege: {
                type: String,
                enum: Object.values(schoolEnum),
            },
            schoolClass: {
                type: String,
                enum: Object.values(schoolClassEnum),
            },
            collegeClass: {
                type: String,
                enum: Object.values(collegeClassEnum),
            },
        },
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;