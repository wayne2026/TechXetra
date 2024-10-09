import { Router } from 'express';
import { login, getAllUsers, changeRoll, newEvent, getEventsEnrolledByUser, isUserEnrolled } from '../controllers/admin';

const router = Router();

router.post('/login', login);
router.get('/users/all', getAllUsers);
router.put('/users/byID/:id', changeRoll);
router.post('/events/new', newEvent);
router.get('/events/user/:id', getEventsEnrolledByUser);
router.get('/:event_id/user/:user_id', isUserEnrolled);

export default router;