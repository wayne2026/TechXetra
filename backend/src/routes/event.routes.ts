import { Router } from "express";
import { addEventDetailsArray, createEvent, getAllEvents, updateEventBackGroundImages, deleteAllEvents, enrollEvent, getEventById, updateEventDetails, searchUsers } from "../controllers/event.controller.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents } from "../middlewares/multer.middlware.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

const uploadMultiple = uploadEvents.fields([
    { name: 'event', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);

router.route("/new").post(verifyToken, authorizeRoles(roleEnum.ADMIN), uploadMultiple, createEvent);
router.route("/search/users/all").get(verifyToken, searchUsers);
router.route("/byId/:id")
    .get(verifyToken, getEventById)
    .put(verifyToken, authorizeRoles(roleEnum.ADMIN), uploadMultiple, updateEventDetails);
router.route("/all").get(getAllEvents);
router.route("/array").post(verifyToken, authorizeRoles(roleEnum.ADMIN), addEventDetailsArray);
router.route("/delete/all").delete(verifyToken, authorizeRoles(roleEnum.ADMIN), deleteAllEvents);
router.route("/enroll/:id").put(verifyToken, enrollEvent);
router.route("/edit/background/:id").put(verifyToken, authorizeRoles(roleEnum.ADMIN), uploadEvents.single("image"), updateEventBackGroundImages);

export default router;