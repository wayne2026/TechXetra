import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import User from "../models/user";

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find();
		res.status(StatusCodes.OK).json({ users, count: users.length });
	} catch (error) {
		next(error);
	}
};

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(StatusCodes.OK).json({ user });
	} catch (error) {
		next(error);
	}
};

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.create(req.body);
		res.status(StatusCodes.CREATED).json(user);
	} catch (error) {
		next(error);
	}
	// res.status(200).json({ msg: "Hello World!" });
};
