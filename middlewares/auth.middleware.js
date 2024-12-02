import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import config from "../config/config.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
    //  const token = req.headers.authorization.split(" ")[1];
    const token = req.headers.authorization?.split(' ')[1];
    //  console.log("-------------------------------------",token)
      // console.log(config.JSON_WEB_TOKEN_SECRET_KEY)
      if (token) {
        const validateToken = jwt.verify(
          token,
          config.JSON_WEB_TOKEN_SECRET_KEY
        );
     //  console.log("validation token : ", validateToken);
        try {
          if (validateToken) {
            const userValidate = await user.findById({ _id: validateToken.id });
            //console.log(userValidate);

            req.user = userValidate;

     
        
       // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.user);
            next();
           // console.log("------................>>>>>>>>>>>>>")

          }
        } catch (error) {
          console.log("middleware : ", error.message);
        }
      }
    } else {
      return res.status(401).json({ success : false,message: "Unauthorized user !!!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const authorize =
  (...roles) =>
  async (req, res, next) => {
    if (roles.includes(req.user.role)) {
  //    console.log("you are admin user");
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "You are not a authorized user to access this resources",
      });
    }
  };


