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
    subTitle?: string;
    note?: string;
    description: string;
    category: typeof categoryEnum[keyof typeof categoryEnum];
    participation: typeof participationEnum[keyof typeof participationEnum];
    maxGroup?: number;
    isVisible: boolean;
    canRegister: boolean;
    externalRegistration: boolean;
    extrenalRegistrationLink?: string;
    externalLink?: string;
    registrationRequired: boolean;
    paymentRequired: boolean;
    amount?: number;
    eventDate: Date;
    venue?: string;
    deadline?: Date;
    image?: string;
    rules?: string[];
    backgroundImage?: string;
    eligibility?: {
        schoolOrCollege?: typeof schoolEnum[keyof typeof schoolEnum];
        collegeClass?: Array<typeof collegeClassEnum[keyof typeof collegeClassEnum]>;
        schoolClass?: Array<typeof schoolClassEnum[keyof typeof schoolClassEnum]>;
    }
    limit?: number;
    registered?: number;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subTitle: String,
        note: String,
        description: {
            type: String,
            required: true,
        },
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
        isVisible: {
            type: Boolean,
            required: true,
            default: true,
        },
        canRegister: {
            type: Boolean,
            required: true,
            default: false,
        },
        maxGroup: Number,
        externalRegistration: {
            type: Boolean,
            required: true,
            default: false,
        },
        extrenalRegistrationLink: String,
        externalLink: String,
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
        image: String,
        rules: [String],
        deadline: Date,
        backgroundImage: String,
        eligibility: {
            schoolOrCollege: {
                type: String,
                enum: Object.values(schoolEnum),
            },
            schoolClass: {
                type: [String],
                enum: Object.values(schoolClassEnum),
                set: (value: string) => Array.isArray(value) ? value : [value],
            },
            collegeClass: {
                type: [String],
                enum: Object.values(collegeClassEnum),
                set: (value: string) => Array.isArray(value) ? value : [value],
            },
        },
        limit: Number,
        registered: Number,
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;