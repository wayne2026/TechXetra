import { Router } from "express";
import { generatePassForUser } from "../controllers/pass.controller.js";
import { isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/generate/:id').put(generatePassForUser);

export default router;