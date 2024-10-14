import { Router } from "express";
import { enrollEvent, getAllEvents, getEventsByID } from '../controllers/event';


const router = Router();

import { authMiddleware } from "../middleware/auth_middleware";


router.get('/all',getAllEvents);
router.get('/byID/:id',getEventsByID);
router.post('/enroll',authMiddleware,enrollEvent);

export default router;