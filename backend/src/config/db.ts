import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);
    }

    mongoose
        .connect(process.env.MONGO_URL)
        .then((data) => {
            console.log(`Mongodb connected: ${data.connection.host}`);
        })
        .catch((error) => {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            process.exit(1);
        });
};

export default connectDB;