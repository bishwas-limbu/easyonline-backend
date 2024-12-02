import express from "express";
import {updateAddress,verifyResetToken,resetPassword,register,userList,login,forgotPassword, userById,deleteById, getCount, updateUser,userProfile, logOut, adminLogin} from '../controller/user.controller.js';
import {authMiddleware,authorize} from '../middlewares/auth.middleware.js';



const router =  express.Router();


//router.get('/check-auth',authMiddleware,authCheck);

router.post('/register', register); //--
router.post('/login',login);//---
router.patch('/logout',authMiddleware,logOut);
//router.get('/',userList);
//router.get('/:id',userById);
//router.delete('/:id',authMiddleware,authorize('admin'),deleteById)
//router.get('/get/count',getCount);
//router.put('/:id',updateUser);
router.get('/myprofile',authMiddleware,userProfile);
router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
router.post('/verifyResetToken',verifyResetToken)
//router.put('/update/address',updateAddress);


router.post('/login/admin',adminLogin);

// router.post('/signin/admin', authMiddleware,authorize('admin'), async (req, res) => {
//     try {
//         console.log("Admin user");

//         // You can send a response indicating success
//         res.status(200).json({ message: "Welcome to the admin panel!" });
//     } catch (error) {
//         console.error("Error accessing admin route:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

//router.get('/auth/check-auth',authMiddleware, checkAuth)



export default router;