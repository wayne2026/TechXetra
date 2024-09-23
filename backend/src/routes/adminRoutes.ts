import express from 'express';
import { dummyJSON } from '../controllers/adminController';

const router = express.Router();
router.route('/login').get(dummyJSON);
router.route('/users/all').get(dummyJSON);
router.route('/users/byID/:id').put(dummyJSON);
router.route('/events/new').post(dummyJSON);
router.route('/events/user/:id').get(dummyJSON);
router.route('/hackathon/user/:id').get(dummyJSON);

export default router;