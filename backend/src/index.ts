import express from "express";
const app = express();

app.use(express.json());

// import cors from "cors";
import { Request, Response } from "express";

import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import eventRouter from "./routes/events";

import { connectDB } from "./db/connect";

import errorHandlerMiddleware from "./middleware/error-handler";

import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const URI = process.env.MONGO_URI;
// app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ msg: "Hello Worldssss!" });
});

app.use("/api/v1/user", userRouter);
app.use("/admin", adminRouter);
app.use("/events", eventRouter);

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
