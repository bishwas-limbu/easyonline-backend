//import express from "express";
import user from '../models/user.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js'
import {sendEmail} from  '../utils/sendEmail.js'
import crypto  from 'crypto'
import paginationHelper from '../utils/pagination.js';
import validator from 'validator';




export const register = async(req,res) => {
    const {fName,lName,email,phoneNumber,address,password} = req.body;
    console.log("request body",req.body)
    const name = fName + " " + lName;
    const password_ = password;

    try{
        const existingUser = await  user.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }else{
            if(!validator.isEmail(email)){
                return res.status(400).json({
                    message: "Email or password not valid, Please Enter valid email or password."
                });
            }
            if(password_.length < 8){
                return res.status(400).json({
                    message: "Please enter a strong password with at least 8 characters."
                });
            }
            const  registerUser = new user(
                {
                    name:name,
                    email:email,
                    phoneNumber:phoneNumber,
                    address:address,
                    password:password_,
                }
            );
            await registerUser.save();
            res.status(201).json({
                success : true,
                message: "User created successfully",
            });

        }

    } catch (error){
       res.status(500).json({
        status : false,
        error : error,
       });
    }
}

export const  login = async(req,res) => {

    try{
       const  {email,password} = req.body;
        
        console.log(req.body);
        const user_detail = await user.findOne({email:email});
        //console.log("isADMIN",user_detail.isAdmin);

        if (!user_detail)
            { 
                return res.status(400).json({status: false, message : "User doesn't exit !!!"});
            } else {
               // const isMatched = await  bcrypt.compare(password,user.password);
                const isMatched = await user_detail.matchPassword(password);
                //console.log(isMatched);
                if (!isMatched){
                    return res.status(400).json({message : "Invalid email or password !!!" });
                } else {
                    const token  = jwt.sign(
                        {
                            id: user_detail._id,
                            isAdmin: user_detail.isAdmin,
                            role:user_detail.role
                        },
                        config.JSON_WEB_TOKEN_SECRET_KEY,
                        {  }              
                    );
                    const updateUser = await user.findOneAndUpdate(
                         { _id: user_detail._id },
                         {$set : { jwt: token }},
                         {new : true}
                    );
                    if (!updateUser ) {
                        return res.status(404).json({ status: false, message: "User  not found" });
                    }
                    res.status(200).json({status: true, message :  "Login Successful",data:token});

                }

            }

    }catch(err){
        res.status(500).json({message:err.message});
    }

}

export const  adminLogin = async(req,res) => {

    try{
       const  {email,password} = req.body;
        
        console.log(req.body);
        const user_detail = await user.findOne({email:email});
        //console.log("isADMIN",user_detail.isAdmin);

        if (!user_detail)
            { 
                return res.status(400).json({status: false, message : "User doesn't exit !!!"});
            } else {
               // const isMatched = await  bcrypt.compare(password,user.password);
                const isMatched = await user_detail.matchPassword(password);
                //console.log(isMatched);
                if (!isMatched){
                    return res.status(400).json({message : "Invalid email or password !!!" });
                } else {
                    const token  = jwt.sign(
                        {
                            id: user_detail._id,
                            isAdmin: user_detail.isAdmin,
                            role:user_detail.role
                        },
                        config.JSON_WEB_TOKEN_SECRET_KEY,
             
                    );
                    const updateUser = await user.findOneAndUpdate(
                         { _id: user_detail._id },
                         {$set : { jwt: token }},
                         {new : true}
                    );
                    if (!updateUser ) {
                        return res.status(404).json({ status: false, message: "User  not found" });
                    }
                    res.status(200).json({status: true, message :  "Login Successful",data:token});

                }

            }

    }catch(err){
        res.status(500).json({message:err.message});
    }

}

export const logOut  = async(req,res) => {
    try{
       // const token = req.headers.authorization.split(' ')[1];
       const userId = req.user._id;
        const user_detail  = await user.findById({_id:userId});

        console.log("logout",user_detail)

        if  (!user_detail) {
            return res.status(404).json({ status: false, message: "Please login to do logout." });

        }else{
            const updateUser = await user.findOneAndUpdate(
                { _id:userId },
                {$set : { jwt: null }},
                {new : true}
           );
           return  res.status(200).json({status: true, message :  "Logout Successful"});

        }
    }catch(err){
        res.status(500).json({message:err.message});
    } 
}

export const forgotPassword  = async(req,res) => {
    try{
        const {email} = req.body;
        const user_detail = await user.findOne({email:email});
        console.log(user_detail);
        if(!user_detail){
            return res.status(404).json({ status: false, message: "User not found"});
        }else{
           // res.send(user);
          const resetToken = await user_detail.getResetToken();
        // const resetToken = crypto.randomBytes(20).toString('hex');
         console.log(resetToken);
         const message =  `Your password reset token is : ${resetToken}.` +' \nYour token will expires in 10 minutes.';

        try{
            await sendEmail({
                email : user_detail.email,
                subject:'Password reset token',
                message: message,
             });
        }catch(err){
            console.log(err);
            user_detail.resetPasswordToken =  null;
            user_detail.resetPasswordExpire =  null;
            await user_detail.save({validateBeforeSave:false});
            return res.status(400).json({ status: false, message: "Sending email failed"});

        }
        await user_detail.save();
        res.status(200).json({ success: true, message: `Password reset token sent to your email ${user_detail.email}.`});
        }

    }catch(err){
        console.log(error)
        res.status(500).json({message:err.message});
    } 
    
}

export const resetPassword  = async(req,res) => {
    try{
        const {resettoken} = req.params;
        console.log("params",req.params);
        const hashToken = crypto.createHash('sha512').update(resettoken).digest('hex');
       // res.send(hashToken);

        const user_detail =  await user.findOne({
            resetPasswordToken:hashToken, 
            resetPasswordExpire: { $gt: Date.now() } // checking expiry of token time
           
        });
       // console.log(user);
        if(!user_detail){
            return res.status(404).json({ status: false, message: "Invalid Token  or password token has expired"});

        } else{
                // user.password = req.body.password;
                // user.resetPasswordToken = undefined;
                // user.resetPasswordExpire =  undefined;
                    const newPassword = await hashPassword(req.body.password);
                    console.log("new password",newPassword)
                    const updatedPass = await user.findOneAndUpdate(
                        { _id:user_detail._id },
                        {
                            $set:{
                                password:newPassword,
                                resetPasswordToken: null,
                                resetPasswordExpire: null,

                            }
                        },
                        {new:true}
                    );
                    
                  //  await updatedPass.save(); 
                    console.log(updatedPass);
                    return res.status(200).json({ success: true, message: "Password reset successfully"});
        }


    } catch (err){
       return res.status(500).json({message: err.message});
    }

}

export const verifyResetToken = async (req, res) => {
    try{
        const {resettoken} = req.body;
        console.log("params",req.body);

        const hashToken = crypto.createHash('sha512').update(resettoken).digest('hex');
       // res.send(hashToken);

        const user_detail =  await user.findOne({
            resetPasswordToken:hashToken, 
            resetPasswordExpire: { $gt: Date.now() } // checking expiry of token time
           
        });
        if(user_detail){
            res.status(200).json({success: true});
        }else{
            res.status(404).json({success: false, message: "Invalid Token or password token"});
        }
        
    } catch(error){
        return res.status(500).json({success: false,message: error.message})
    }
}

export const userProfile  = async(req,res) => {
    try{
        const user_detail =  await user.findById(req.user._id);
        if(user_detail){
            const {name,phoneNumber,email,address} = user_detail;
            console.log(name);
            res.status(200).json({
                success: true,
                data: {
                    name :name,
                    phone:phoneNumber,
                    email:email,
                    address:address,
        
                },
            });
        }
    }catch{
        return res.status(500).json({success: false,message: error.message});
    }





}
//---------------------------------------------------//////////////
export  const userList = async(req,res) => {
    
    try{
        const queryPage = req.query.page;
        const perPage = 2;
        const paginationData = await paginationHelper(user,queryPage,perPage);

        console.log(paginationData);
        if (paginationData === false){
            return res.status(404).json({message : "Page not found"})
        }

        const usersList = paginationData.items;

        if (usersList) {
            res.status(200).json({
                success : true
,                "usersList" : usersList,
                "totalPages": paginationData.totalPages,
                "currentPage": paginationData.currentPage,

            });
        }else {
            res.status(404).json({success : false,message: "No users found"})
        }
        
    }catch (err){
        res.status(500).json({success : false,message: "Error fetching users"})
    }


}

export  const userById = async(req,res) => {
    
    try{
        const id = req.params.id;
        console.log(id);
        const user_detail=  await user.findById({_id:id});
        console.log(user_detail);
        if (user_detail) {
            res.status(200).json(user_detail);
        }else {
            res.status(404).json({success : false,message: "No user found"})
        }
        
    }catch (err){
        res.status(500).json({success : false,message: "Error fetching user"})
    }


}

export  const deleteById = async(req,res) => {

    user.findByIdAndDelete(req.params.id).then(user_ =>{
        if(user_){
            res.status(200).json({success : true, message :  "User deleted successfully"});
        } else {
            res.status(404).json({success : false,message: "No user found"});
        }
    }).catch(err =>{
        res.status(500).json({success : false,error : err, message: "Error deleting user"})
    })

}








export const getCount =  async (req,res) => {
    const userCount = await  user.countDocuments();
    console.log(userCount);
    if(!userCount){
        res.status(400).json({success: false,message : "0" });
    }else{
        res.status(200).json({success: true,userCount : userCount });
    }
}

export  const updateUser = async(req,res) => {
    try{
        const {name,phone,email,password} = req.body;
        const id =  req.params.id;

        const existingUser =  await user.findById({_id:id});
        console.log(existingUser)
        if (!existingUser){
            return res.status(404).json({ status: false, message: "User  not found"});
        }else{
            let newPassword = existingUser.password; 

            if(password){
                newPassword = await bcrypt.hash(password, 10);
            } else {
                newPassword = existingUser.password;
            }
            const updateUser = await user.findOneAndUpdate(
                {_id:id},
                {
        
                    name: name || existingUser.name,
                    phone: phone || existingUser.phone,
                    email: email || existingUser.email,
                    password: newPassword,
                },
                {
                    new: true,
                }
            );
            res.status(200).json({ message: "User  Updated Successfully", user: updateUser// No selection was provided, so I'll generate a code snippet that can be inserted at the cursor position.

});
        }
    }catch (error){
        res.status(500).json({ message: error.message });
    }





        
}






export const updateAddress = async(req,res) => {
    try{
        const {streetAddress, city, state,postalCode,country,note} = req.body;
        console.log(req.body);
        const id = '672859f9a0032a390a7054c3';
        const existUser = await user.findById({_id:id});
    
        if (!existUser){
            return res.status(404).json({message: "User not found"});
        }
        const updateAddress = await user.updateOne({ _id:id }, {
            $set:{
                    'address.streetAddress' : streetAddress||existUser.address.streetAddress,
                    'address.city' : city||existUser.address.city,
                    'address.state' : state||existUser.address.state,
                    'address.postalCode' : postalCode||existUser.address.postalCode,
                    'address.country' : country||existUser.address.Country,
                    'address.note':note ||existUser.address.note,
            }
    
        },{new : true});
        res.status(200).json({success: true,message:"Successfully updated address",data:updateAddress});
    }catch(error){
        return res.status(500).json({message: `error from update address ${error.message}`});
    }

}



// hashing password
const hashPassword = async(password)=>{
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return  hashedPassword;
}


// // for Admin login

// export const adminLogin = async(req,res) => {
//     try{
//         const {email, password} = req.body;

//         if (!email || !password){
//             return res.status(400).json({message: "Please enter both email and password"});
//         }
//         const existAdmin = await admin.findOne({email:email});
//         if (!existAdmin){
//             return res.status(404).json({message: "User not found"});
//         }
//         if(email === existAdmin.email && password === existAdmin.password){
//             return res.status(200).json({success: true,message:"Successfully logged in",data:
//         }


//     }

// }
