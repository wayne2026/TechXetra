import { Router } from "express";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { roleEnum } from "../models/user.model.js";
import { getAllEmails } from "../controllers/email.controller.js";

const router = Router();

router.route("/all").get(verifyToken, authorizeRoles(roleEnum.ADMIN), getAllEmails);

export default router;