import { Router } from "express";
import { fetchEvents, getPass, makePass, updatePassPaymentStatus } from "../controllers/pass.controller.js";
import { isUserVerified, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadPassPayments } from "../middlewares/multer.middlware.js";

const router = Router();

router.route('/get/:id').get(getPass);
router.route('/generate/:id').put(makePass);
router.route('/getEvents/:id').get(fetchEvents);
router.route('/updatePassPayment/:id').put(uploadPassPayments.single("image"), updatePassPaymentStatus);

export default router;