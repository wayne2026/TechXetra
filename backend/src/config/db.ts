import { error } from "console";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default function connectDB (): void{
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in .env")
        process.exit(1)
    }
    mongoose.connect(process.env.MONGO_URI).then((data) => {
        console.log(`MongoDb connected`)
    }).catch((error) => {
        console.error('Error connecting to MongoDB')
        process.exit(1)
    })
}