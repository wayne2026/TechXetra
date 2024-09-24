import mongoose, { Schema, Document } from "mongoose";

// Interface for Event Document
interface IEvent extends Document {
    title: string;
    description: string;
    createdAt: Date;
    price: number;
    info: {
        date: Date;
        location: string;
    };
    images: string[]; // Array of strings for image URLs or file paths
}

// Event Schema definition
const EventSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
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
        type: [String], // Array of strings for image paths or URLs
        validate: {
            validator: function(arr: string[]) {
                // Validator to ensure images array length can be user-defined
                const maxSize = 10; // Change this to any maximum size limit you need
                return arr.length <= maxSize;
            },
            message: "Images array exceeds the maximum size allowed.",
        },
    },
});

// Create and export the Event model
const EventModel = mongoose.model<IEvent>("Event", EventSchema);
export default EventModel;
