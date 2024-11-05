import { Router } from "express";
import {
	forgotPassword,
	getUser,
	getUserEvents,
	getUserInvites,
	getUsersInExcelSheet,
	loginUser,
	logoutUser,
	registerUser,
	requestForgot,
	requestVerification,
	resetPassword,
	updateProfileDetails,
	uploadProfilePicture,
	verifyUser,
} from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/multer.middlware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(uploadAvatar.single("avatar"), registerUser);
router.route("/request/verify").get(verifyToken, requestVerification);
router.route("/login").post(loginUser);
router.route("/me").get(verifyToken, getUser);
router.route("/events").get(verifyToken, getUserEvents);
router.route("/invites").get(verifyToken, getUserInvites);
router.route("/verify").put(verifyToken, verifyUser);
router.route("/logout").get(verifyToken, logoutUser);
router.route("/password/forgot").post(requestForgot);
router.route("/password/reset/:token").put(forgotPassword);
router.route("/update/password").put(verifyToken, resetPassword);
router.route("/upload/avatar").put(verifyToken, uploadAvatar.single("avatar"), uploadProfilePicture);
router.route("/update/profile").put(verifyToken, updateProfileDetails);
router.route("/exportusers").get(getUsersInExcelSheet);

export default router;
