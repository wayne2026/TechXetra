import { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import { StatusCodes } from "http-status-codes";
import "./utils/emailQueue.js";
import Redis from "ioredis";

process.on("uncaughtException", (err: Error) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Uncaught Exception`);

	process.exit(1);
});

dotenv.config();

export const redis = new Redis.default();
const PORT = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Welcome to TechXetra API",
		version: "1.0.1",
	});
});

const start = () => {
	connectDB();

	const server = app.listen(PORT, () => {
		console.log(`App listening at http://localhost:${PORT}`);
	});

	process.on("unhandledRejection", (err: any) => {
		console.log(`Error: ${err.message}`);
		console.log(
			`Shutting down the server due to Unhandled Promise Rejection`
		);

		server.close(() => {
			process.exit(1);
		});
	});
};

start();
