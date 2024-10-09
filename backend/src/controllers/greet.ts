import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomRequest } from "../middleware/auth_middleware";

export const greet = (req: CustomRequest, res: Response) => {
	const user = req?.user;
	console.log(user);

	if (!user) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ msg: "Unauthorized" });
	}
	res.status(StatusCodes.OK).json({ msg: `Hello, ${user.email}` });
};
