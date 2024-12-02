import express from 'express';
import multer from 'multer';
import {addProduct,getAllProducts,getProductById,delProductById,updateProductById} from "../controller/product.controller.js"
import { authMiddleware,authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();
const storage = multer.memoryStorage(); // Creating memory storage
const upload = multer({ storage: storage }); // Storing images in memory, not on disk

// Get all products
router.get('/',getAllProducts);

// Create a new product
//router.post('/create',upload.single('image'),addProduct);
router.post('/create',authMiddleware,authorize('admin'),upload.single('image'),addProduct);

router.get('/:id',getProductById);

router.delete('/del/:id',authMiddleware,authorize('admin'),delProductById);

router.put('/update/:id', authMiddleware,authorize('admin'),upload.single('image'),updateProductById);

export default router;