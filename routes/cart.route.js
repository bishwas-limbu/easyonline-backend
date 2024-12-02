import express from "express";
import {addToCart, delCart, getCart, updateCart } from "../controller/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



const router =  express.Router();


router.get('/get',authMiddleware,getCart); //getting all  the cart items of the user
router.post('/add', authMiddleware,addToCart); // req.body
router.delete('/:productId',delCart);//req.params
router.put('/update',authMiddleware,updateCart);



export default router;