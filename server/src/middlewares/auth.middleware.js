import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
const verifyJWT = asyncHandler(async (req,res,next)=>{
try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
       if(!token){
        throw new apiError(500,"unauthorized access")
       }
       const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");
     if(!user){
        throw new apiError(401,"there is something wrong in the access token")
     }
       req.user = user;
       next()
} catch (error) {
    throw new apiError(400,error?.message || "invalid access token");
} 
})

export {verifyJWT};