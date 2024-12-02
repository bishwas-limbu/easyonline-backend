import mongoose from "mongoose";
import { validationMessage } from "../constants/validationMessage.constants.js";
import bcrypt  from "bcrypt";
import crypto  from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber :{
        type:String,

    },
    address:{
        type:Object,
    },
    cartData:{
        type: Object,
        default: {}
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
     },     
    jwt :{
        type : String,
     },
     resetPasswordToken:{
        type:String,
     },
     resetPasswordExpire:{
        type:Date,
     },
     passwordExpire:{
        type:Date,
     }
},
{
    minimize:false //help to create empty object
     
});

// hashing password before it is saved
userSchema.pre('save', async function(pass) {
    const salt  = await bcrypt.genSalt(10);
    this.password = await  bcrypt.hash(this.password, salt);
});

// hashing password before it is saved
// userSchema.pre('update', async function(pass) {
//     const salt  = await bcrypt.genSalt(10);
//     this.password = await  bcrypt.hash(this.password, salt);
// });

//creating  password matching function
userSchema.methods.matchPassword = async  function(pass){
    return await bcrypt.compare(pass, this.password);
}

userSchema.methods.getResetToken = async  function(){
    const resetToken = crypto.randomBytes(2).toString('hex'); // send to user
    this.resetPasswordToken = crypto.createHash('sha512').update(resetToken).digest('hex');// store to database
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000// expires  in 10 minutes
    return resetToken;
}
// Creating the User model
const user = mongoose.models.user || mongoose.model('user', userSchema);

// Export the model and the schema



// const User = mongoose.model('User',userSchema);
export default user;
// In another file, e.g., controllers/authController.js
//import { User, userSchema } from '../models/User';