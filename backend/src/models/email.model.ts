import mongoose, { Document, Schema } from "mongoose";

export interface IEmail extends Document {
	_id: mongoose.Schema.Types.ObjectId;
    email: string;
	status: boolean;
    error: string;
	createdAt: Date;
	updatedAt: Date;
}

const EmailSchema: Schema<IEmail> = new Schema(
    {
        email: String,
        status: String,
        error: String
    },
    {
		timestamps: true
	}
);

const EmailModel = mongoose.model<IEmail>("EmailModel", EmailSchema);
export default EmailModel;