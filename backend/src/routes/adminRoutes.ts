import express from 'express';
import { dummyJSON, login, getAllUsers, changeRoll, newEvent, getEventsEnrolledByUser, isUserEnrolled } from '../controllers/adminController';

const router = express.Router();

router.route('/login').post(login);
router.route('/users/all').get(getAllUsers);
router.route('/users/byID/:id').put(changeRoll);
router.route('/events/new').post(newEvent);
router.route('/events/user/:id').get(getEventsEnrolledByUser);
router.route('/:event_id/user/:user_id').get(isUserEnrolled);

export default router;