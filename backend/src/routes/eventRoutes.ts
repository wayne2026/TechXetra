import express from 'express';
import { dummyJSON } from '../controllers/eventController';

const router = express.Router();

router.route('/all').get(dummyJSON);
router.route('/byID/:id').get(dummyJSON);
router.route('/enroll/:userID').get(dummyJSON);

export default router;