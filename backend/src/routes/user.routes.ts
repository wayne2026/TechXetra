import { Router } from "express";
import {
	getUser,
	loginUser,
	logoutUser,
	registerUser,
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
router.route("/verify").put(verifyToken, verifyUser);
router.route("/logout").get(verifyToken, logoutUser);
router.route("/update/password").put(verifyToken, resetPassword);
router.route("/upload/avatar").put(verifyToken, uploadAvatar.single("avatar"), uploadProfilePicture);
router.route("/update/profile").put(verifyToken, updateProfileDetails);

export default router;
