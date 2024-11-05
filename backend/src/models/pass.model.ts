import mongoose, { Document, Schema } from "mongoose";

interface IEventsRegistered {
    eventId: mongoose.Schema.Types.ObjectId;
    title: string;
    paymentRequired: boolean;
}

export const paymentStatusEnum = {
	PENDING: "PENDING",
	SUBMITTED: "SUBMITTED",
	VERIFIED: "VERIFIED",
} as const;

interface IPass extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    schoolOrCollege: string;
    institutionName: string;
    institutionClass: string;
    eventsRegistered: IEventsRegistered[];
    paymentRequired: boolean;
    payment?: {
        status: typeof paymentStatusEnum[keyof typeof paymentStatusEnum];
        transactionId?: string;
        paymentImage?: string;
        amount: number;
    };
    qrCodeUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema<IEventsRegistered> = new Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        paymentRequired: {
            type: Boolean,
            required: true
        }
    }
)

const PassSchema: Schema<IPass> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        schoolOrCollege: {
            type: String,
            required: true
        },
        institutionName: {
            type: String,
            required: true
        },
        institutionClass: {
            type: String,
            required: true
        },
        eventsRegistered: {
            type: [EventSchema]
        },
        paymentRequired: {
            type: Boolean,
            default: true
        },
        payment: {
            status: {
                type: String,
                enum: Object.values(paymentStatusEnum),
                required: function (this: IPass) {
                    return this.paymentRequired
                }
            },
            transactionId: {
                type: String,
                required: function (this: IPass) {
                    return this.payment?.status === paymentStatusEnum.SUBMITTED
                }
            },
            paymentImage: {
				type: String,
				required: function (this: IPass) {
					return this.payment?.status === paymentStatusEnum.SUBMITTED;
				},
			},
			amount: {
				type: Number,
				required: function (this: IPass) {
					return this.paymentRequired;
				},
			},
        },
        qrCodeUrl: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date(Date.now()),
            required: true
        },
        updatedAt: {
            type: Date,
            default: new Date(Date.now()),
            required: true
        }
    },{
        timestamps: true
    }
);

const Pass = mongoose.model<IPass>("Pass", PassSchema);
export default Pass;