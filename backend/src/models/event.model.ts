import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    info: {
        date: Date;
        location: string;
    };
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        info: {
            date: {
                type: Date,
                required: true,
            },
            location: {
                type: String,
                required: true,
            },
        },
        images: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;