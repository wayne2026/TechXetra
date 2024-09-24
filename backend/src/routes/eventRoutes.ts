import express from 'express';
import { dummyJSON, getAllEvents, getEventsByID } from '../controllers/eventController';

const router = express.Router();

router.route('/all').get(getAllEvents);
router.route('/byID/:id').get(getEventsByID);
router.route('/enroll/:userID').get(dummyJSON);

export default router;