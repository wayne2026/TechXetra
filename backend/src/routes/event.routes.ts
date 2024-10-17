import { Router } from "express";
import { addEventDetailsArray, createEvent, getAllEvents, updateEventBackGroundImages } from "../controllers/event.controller.js";
import { authorizeRoles, isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents } from "../middlewares/multer.middlware.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

router.route("/new").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.array("events", 5), createEvent);
router.route("/all").get(getAllEvents);
router.route("/array").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), addEventDetailsArray);
router.route("/edit/background/:id").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.single("image"), updateEventBackGroundImages);

export default router;