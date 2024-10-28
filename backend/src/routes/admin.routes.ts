import { Router } from "express";
import { authorizeRoles, isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import {deleteUser, getAllUsers, getUserById, loginUser, toggleAllIsVisible, toggleBlockUser, updatedUserRole } from "../controllers/admin.controller.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/users/all").get(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN, roleEnum.MODERATOR), getAllUsers);
router.route("/users/byId/:id")
    .get(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN, roleEnum.MODERATOR), getUserById)
    .delete(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN, roleEnum.MODERATOR), deleteUser);
router.route("/users/block/:id").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), toggleBlockUser);
router.route("/users/role/:id").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), updatedUserRole);
router.route("/events/isVisible/all").put(verifyToken, isUserVerified, authorizeRoles(roleEnum.ADMIN), toggleAllIsVisible);

export default router;