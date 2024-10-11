import { Router } from 'express';
import { login, getAllUsers, changeRoll, newEvent, getEventsEnrolledByUser, isUserEnrolled, userVerification } from '../controllers/admin';
import { authMiddleware, isRoleAdmin } from '../middleware/auth_middleware';

const router = Router();


router.post('/login', login);
router.get('/users/all', getAllUsers);
router.put('/users/byID/:id', authMiddleware, isRoleAdmin, changeRoll);
router.post('/events/new', authMiddleware, isRoleAdmin, newEvent);
router.get('/events/user/:id', authMiddleware, isRoleAdmin, getEventsEnrolledByUser);
router.get('/:event_id/user/:user_id', authMiddleware, isRoleAdmin,  isUserEnrolled);
router.put('/users/verify/:id', authMiddleware, isRoleAdmin, userVerification);

export default router;