import { NextFunction, Request, Response } from "express";
import User, { paymentStatusEnum } from "../models/user.model.js";
import Pass from "../models/pass.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import QRCode from "qrcode";

interface UserRegisteredEvent {
  eventId: string;
  title: string;
  paymentRequired: boolean;
}

interface Payment {
  status: (typeof paymentStatusEnum)[keyof typeof paymentStatusEnum];
  transactionId: string;
  paymentImage: string;
  amount: number;
}

export const getPass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existingPass = await Pass.findOne({
      userId: id,
    });
    if (!existingPass) {
      console.log("no existing pass found");
      res.status(404).json({
        success: false,
        message: "Pass not found",
      });
      return;
    }
    console.log("existing pass successfully found");
    res.status(200).json({
      success: true,
      message: "Pass fetched successfully",
      pass: existingPass,
    });
  } catch (error) {
    next(error);
  }
};

export const makePass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // const events = await User.findById(id).select("events.eventId events.title events.paymentRequired");
    // console.log("events registered: ", events);
    // const eventsRegistered = events;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      schoolOrCollege,
      institutionName,
      institutionClass,
      eventsRegistered,
      paymentRequired,
      payment,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      schoolOrCollege: string;
      institutionName: string;
      institutionClass: string;
      eventsRegistered: UserRegisteredEvent[];
      paymentRequired: boolean;
      payment?: Payment;
    } = req.body;
    console.log("events registered: ", eventsRegistered);
    const existingPass = await Pass.findOne({
      userId: id,
    });
    if (!existingPass) {
      const newPassData = {
        userId: id,
        firstName,
        lastName,
        email,
        phoneNumber,
        schoolOrCollege,
        institutionName,
        institutionClass,
        eventsRegistered,
        paymentRequired,
        payment: {
          status: payment?.status,
          transactionId: payment?.transactionId,
          paymentImage: payment?.paymentImage,
          amount: payment?.amount,
        },
      };
      // const qrData = JSON.stringify(newPassData);
      const qrData = `${process.env.ADMIN_URL}/passes/${id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      const newPass = await Pass.create({
        userId: id,
        firstName,
        lastName,
        email,
        phoneNumber,
        schoolOrCollege,
        institutionName,
        institutionClass,
        eventsRegistered,
        paymentRequired,
        payment: {
          status: payment?.status,
          transactionId: payment?.transactionId,
          paymentImage: payment?.paymentImage,
          amount: payment?.amount,
        },
        qrCodeUrl,
      });
      console.log(`pass generated for user with id ${id}: `, newPass);
      await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            "pass.hasPass": true,
            "pass.generatedAt": new Date(Date.now()),
          },
        }
      );
      console.log("User schema updated successfully");

      res.status(201).json({
        success: true,
        message: `Pass generated successfully for user with id ${id}`,
        newPass: newPass,
        qrCode: qrCodeUrl,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Pass already generated for user with id ${id}`,
        existingPass: existingPass,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const fetchEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userEvents = await User.findById(id).select(
      "events.eventId events.title events.paymentRequired"
    );
    console.log("userEvents", userEvents);
    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      userEvents,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }
    const existingPass = await Pass.findOne({
      userId: id,
    });
    if (!existingPass) {
      return next(new ErrorHandler("Pass not found", StatusCodes.NOT_FOUND));
    }

    if (
      existingPass.paymentRequired === false &&
      existingPass.eventsRegistered.length > 0 &&
      existingPass.payment?.status !== "PENDING"
    ) {
      return next(
        new ErrorHandler("Payment already done", StatusCodes.BAD_REQUEST)
      );
    }

    if (!req.file || !req.file.filename) {
      return next(
        new ErrorHandler("No payment image uploaded", StatusCodes.BAD_REQUEST)
      );
    }

    const filename = `${process.env.SERVER_URL}/pass/payment/screenshot?userName=${existingUser.firstName}&filename=${req.file.filename}`;
    const { transactionId } = req.body;

    if (!transactionId) {
      console.log("TransactionId is missing");
      return next(
        new ErrorHandler("Invalid request, missing TransactionId", 400)
      );
    }

    console.log("transactionId: ", transactionId);
    console.log("paymentImage: ", req.file.filename);

    const updatedPass = await Pass.findByIdAndUpdate(
      {
        _id: existingPass._id,
      },
      {
        $set: {
          paymentRequired: false,
          "payment.status": paymentStatusEnum.SUBMITTED,
          "payment.transactionId": transactionId,
          "payment.paymentImage": filename,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    ).select("-qrCodeUrl");
    const updatedqrData = JSON.stringify(updatedPass);
    const qrCodeUrl = await QRCode.toDataURL(updatedqrData);
    const updatedPassWithUpdatedQrCode = await Pass.findByIdAndUpdate(
      {
        _id: updatedPass?._id,
      },
      {
        $set: {
          qrCodeUrl: qrCodeUrl,
        },
      }
    );
    console.log("Updated pass: ", updatedPassWithUpdatedQrCode);
    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      updatedPassWithUpdatedQrCode,
    });
  } catch (error) {
    next(error);
  }
};
