import mongoose, { Schema, Document } from "mongoose";

interface IPayment extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    orderId: string;
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: {
        methodType: string,
        cardInfo: {
            cardType: string,
            issuer: string,
            last4: string,
            name: string,
            network: string,
        },
        bankInfo: string,
        walletInfo: string,
        upiInfo: string,
    },
    userId: mongoose.Schema.Types.ObjectId;
    eventId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: true,
            default: "JUST_CREATED"
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        },
        currency: {
            type: String,
            required: true,
            default: "INR"
        },
        paymentMethod: {
            methodType: String,
            cardInfo: {
                cardType: String,
                issuer: String,
                last4: String,
                name: String,
                network: String,
            },
            bankInfo: String,
            walletInfo: String,
            upiInfo: String,
        },
        userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
            required: true,
		},
        eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
            required: true,
		},
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;