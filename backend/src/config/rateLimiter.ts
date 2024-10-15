import { rateLimit, Options } from 'express-rate-limit';

const limiterOptions: Partial<Options> = {
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
};

const limiter = rateLimit(limiterOptions);

export default limiter;