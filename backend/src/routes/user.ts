import { Router } from "express";
import { Request, Response } from "express";

import { getAllUsers, getUser, createUser } from "../controllers/user";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.post("/", createUser);

export default router;
