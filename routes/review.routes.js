import express from 'express';
import {authMiddleware} from '../middlewares/auth.middleware.js';

import {getReviews,addReview} from '../controller/review.controller.js';

const router = express.Router();

router.get('/id/:productId', getReviews);
router.post('/add',authMiddleware,addReview);


export default router;