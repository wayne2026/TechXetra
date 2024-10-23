import { Router } from "express";
import { addEventDetailsArray, createEvent, getAllEvents, updateEventBackGroundImages, deleteAllEvents, enrollEvent, getEventById } from "../controllers/event.controller.js";
import { authorizeRoles, isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents } from "../middlewares/multer.middlware.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

router.route("/new").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.single("event"), createEvent);
router.route("/byId/:id").get(verifyToken, isUserVerified, getEventById);
router.route("/all").get(getAllEvents);
router.route("/array").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), addEventDetailsArray);
router.route("/delete/all").delete(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), deleteAllEvents);
router.route("/enroll/:id").put(verifyToken, isUserVerified, enrollEvent);
router.route("/edit/background/:id").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.single("image"), updateEventBackGroundImages);

export default router;