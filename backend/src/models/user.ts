import mongoose, { Schema, Document } from "mongoose";

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
	createdAt: Date;
	updatedAt: Date;
	events: String[];
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
		events: {
			type: [String], // Array of strings for image paths or URLs
			validate: {
				validator: function(arr: string[]) {
					// Validator to ensure images array length can be user-defined
					const maxSize = 30; // Change this to any maximum size limit you need
					return arr.length <= maxSize;
				},
				message: "Events array exceeds the maximum size allowed.",
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);