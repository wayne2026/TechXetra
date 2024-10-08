import { Router } from "express";

import {
	getAllUsers,
	loginUser,
	registerUser,
	handleRefreshToken,
	logoutUser,
} from "../controllers/user";

import { greet } from "../controllers/greet";

import { authMiddleware } from "../middleware/auth_middleware";

const router = Router();

router.get("/", getAllUsers);

// router.get("/:id", loginUser);
router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/refresh", handleRefreshToken);

router.get("/logout", logoutUser);

router.get("/greet", authMiddleware, greet);

export default router;
