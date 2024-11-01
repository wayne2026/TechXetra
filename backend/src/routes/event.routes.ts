import { Router } from "express";
import { addEventDetailsArray, createEvent, getAllEvents, updateEventBackGroundImages, deleteAllEvents, enrollEvent, getEventById, updateEventDetails, searchUsers, checkOutInvitation, updatePaymentDetails, deleteUserEvent, addMembers, removeMember, deleteEventById } from "../controllers/event.controller.js";
import { authorizeRoles, isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents, uploadPayments } from "../middlewares/multer.middlware.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

const uploadMultiple = uploadEvents.fields([
    { name: 'event', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);

router.route("/new").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadMultiple, createEvent);
router.route("/search/users/all").get(verifyToken, isUserVerified, searchUsers);
router.route("/byId/:id")
    .get(verifyToken, isUserVerified, getEventById)
    .put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadMultiple, updateEventDetails)
    .delete(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), deleteEventById);
router.route("/user/:id").delete(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), deleteUserEvent);
router.route("/all").get(getAllEvents);
router.route("/array").post(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), addEventDetailsArray);
router.route("/delete/all").delete(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), deleteAllEvents);
router.route("/enroll/:id").put(verifyToken, isUserVerified, enrollEvent);
router.route("/member/add/:id").put(verifyToken, isUserVerified, addMembers);
router.route("/member/del/:id").put(verifyToken, isUserVerified, removeMember);
router.route("/invite/:userId/:eventId").put(verifyToken, isUserVerified, checkOutInvitation);
router.route("/payment/:id").post(verifyToken, isUserVerified, uploadPayments.single("image"), updatePaymentDetails);
router.route("/edit/background/:id").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), uploadEvents.single("image"), updateEventBackGroundImages);

export default router;