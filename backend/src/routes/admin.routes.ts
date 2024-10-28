import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { getAllUsers, loginUser, toggleAllIsVisible, toggleBlockUser, updatedUserRole } from "../controllers/admin.controller.js";
import { roleEnum } from "../models/user.model.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/users/all").get(verifyToken, authorizeRoles(roleEnum.ADMIN, roleEnum.MODERATOR), getAllUsers);
router.route("/users/byId/:id").get(verifyToken, authorizeRoles(roleEnum.ADMIN, roleEnum.MODERATOR), getAllUsers);
router.route("/users/block/:id").put(verifyToken, authorizeRoles(roleEnum.ADMIN), toggleBlockUser);
router.route("/users/role/:id").put(verifyToken, authorizeRoles(roleEnum.ADMIN), updatedUserRole);
router.route("/events/isVisible/all").put(verifyToken, authorizeRoles(roleEnum.ADMIN), toggleAllIsVisible);

export default router;