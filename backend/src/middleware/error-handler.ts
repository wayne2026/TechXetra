import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
	statusCode: number;
	value?: string;
	code?: number;
	keyValue?: { [key: string]: string };
	errors?: { [key: string]: { message: string } };
}

const errorHandlerMiddleware = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong",
	};
	// if (err instanceof CustomAPIError) {
	//   return res.status(err.statusCode).json({ msg: err.message })
	// }

	if (err.name === "CastError") {
		customError.msg = `No item found with ID: ${err.value}`;
		customError.statusCode = StatusCodes.NOT_FOUND;
	}

	if (!err.errors) {
		return res.status(customError.statusCode).json({ customError });
	}

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.code && err.code === 11000 && err.keyValue) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			msg: `Duplicate value entered for ${Object.keys(
				err.keyValue
			)} field, please choose another value.`,
		});
	}
	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
	return res.status(customError.statusCode).json({ customError });
};

export default errorHandlerMiddleware;
