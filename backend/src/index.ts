import express from "express";
import cors from "cors";
import { Request, Response } from "express";

import userRouter from "./routes/user";

import { connectDB } from "./db/connect";

import errorHandlerMiddleware from "./middleware/error-handler";

import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT;
const URI = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ msg: "Hello Worldssss!" });
});

app.use("/api/v1/user", userRouter);

app.use(errorHandlerMiddleware);

const start = async () => {
	try {
		if (!URI) throw new Error("No URI provided");
		await connectDB(URI);
		console.log("MongoDB connected");

		app.listen(port, () => {
			console.log(`App listening at http://localhost:${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
