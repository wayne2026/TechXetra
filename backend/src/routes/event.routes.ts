import { Router } from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authorizeRoles, isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents } from "../middlewares/multer.middlware.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

router.route("/new").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.array("events", 5), createEvent);

export default router;