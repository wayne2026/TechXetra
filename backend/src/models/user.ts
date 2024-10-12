import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "./Event"; // Assuming the Event interface is exported from the Event model

export const roleEnum = {
	USER: "user",
	ADMIN: "admin",
	MODERATOR: "moderator",
};

export interface IUser extends Document {
	_id: mongoose.Schema.Types.ObjectId;
	username: string;
	password: string;
	email: string;
	avatar: string;
	role: string;
	"college/university": string;
	phone_number: string;
	physical_verification: boolean;
	createdAt: Date;
	updatedAt: Date;
	events: mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Event
}

const UserSchema: Schema<IUser> = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required."],
			maxlength: [30, "Username must be less than 30 characters."],
			minlength: [3, "Username must be more than 3 characters."],
		},
		password: {
			type: String,
			required: [true, "Password is required."],
			minlength: [6, "Password must be more than 6 characters."],
		},
		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
			validate: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		avatar: { type: String, required: true },
		role: {
			type: String,
			enum: Object.values(roleEnum),
			default: roleEnum.USER,
		},
		"college/university": {
			type: String,
			required: [true, "College/University is required."],
		},
		phone_number: {
			type: String,
			maxlength: [10, "Phone number must be less than 10 characters."],
			minlength: [10, "Phone number must be more than 10 characters."],
		},
		physical_verification: { type: Boolean, default: false },
		events: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Event", // Reference to the Event model
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
