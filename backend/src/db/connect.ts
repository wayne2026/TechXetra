import mongoose from "mongoose";

export const connectDB = async (URI: string) => {
	if (!URI) throw new Error("No URI provided");
	await mongoose.connect(URI);
};
