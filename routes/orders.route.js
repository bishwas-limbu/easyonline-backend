import express from 'express';


import {verifyStripe,placeOrder,stripeOrder,getAllOrders,getUserOrders,updateOrderStatus} from "../controller/order.controller.js";
import { authMiddleware,authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get('/list',authMiddleware,authorize('admin'),getAllOrders); //post admin
router.put('/status',authMiddleware,authorize('admin'),updateOrderStatus);//post admin

router.post('/placeorder',authMiddleware,placeOrder); // for cash on delivery auth user
router.post('/stripe',authMiddleware,stripeOrder); // for stripe payment auth user
router.post('/stripeVerify',authMiddleware,verifyStripe)

router.get('/user',authMiddleware,getUserOrders); // post



export default router;