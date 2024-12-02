import express from 'express';

import productRoute from './product.route.js';
import userRoute from './user.route.js';
import cartRoute from './cart.route.js';
import reviewsRoute from './review.routes.js';


import orderRoute from './orders.route.js'
//import prodRoute from "./prod.route.js";

const router = express.Router();



//router.use('/categories',categoryRoute);// api route of category
router.use('/products',productRoute); // api route of products
router.use('/users', userRoute);
router.use('/carts',cartRoute);
router.use('/reviews',reviewsRoute);
router.use('/orders',orderRoute);

export default router;