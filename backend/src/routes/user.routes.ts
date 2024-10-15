import { Router } from "express";
import {
	getUser,
	loginUser,
	logoutUser,
	registerUser,
	updateProfile,
} from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/multer.middlware.js";
import { isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").get(uploadAvatar.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyToken, getUser);
router.route("/logout").get(verifyToken, logoutUser);
router
	.route("/edit/profile")
	.put(
		verifyToken,
		isUserVerified,
		uploadAvatar.single("avatar"),
		updateProfile
	);

export default router;
