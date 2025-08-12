import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId)=>{
   try {
      const user = await User.findById(userId);
      const accessToken =  await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
     await user.save({validateBeforeSave : false});
     
     return {accessToken,refreshToken};

   } catch (error) {
      throw new apiError(500,"something went wrong while generating the refresh and access token");
   }
}


const registerUser = asyncHandler(async (req,res)=>{
   
       const {name,email,password} = req.body;
      

       if(name ==="" || email ==="" || password === ""){
         throw new apiError(400,"All feilds are required")
       }
        
       //check existing user
       const existedUser = await User.findOne({email})
      

       if(existedUser){
         throw new apiError(400,"you are already registered");
       }



       //handling file by multer
      
    
     
       const profileLocalPath = req.file?.path
      
     
       
     
      const profilePath = await uploadOnCloudinary(profileLocalPath);
      
      

    const user = await User.create({
         name,
         profilePic:profilePath?.url || "",
         email,
         password
      })
       
      const createdUser = await User.findById(user._id).select(
         "-password -refreshToken"
      )
      if(!createdUser){
         throw new apiError(500,"something went wrong while creating the user");
      }
   

      return res.status(200).json(
         new apiResponse(200,createdUser,"user created succefully")
      )
       
})

const loginUser = asyncHandler(async(req,res)=>{
   const {email,password} = req.body;
   if(email === "" || password === ""){
      throw new apiError(400,"email and password required");
   }

    const user = await User.findOne({email});
    if(!user){
      throw new apiError(400,"user not found! please register to log in");
    }

   const ispassword = await user.isPasswordCorrect(password);
   
    if(!ispassword){
        throw new apiError(400,"password is incorrect");
    }
    
   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id); 
    
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
   

   const options ={
      httpOnly:true,
      secure:true,
      sameSite: 'none'
   }

  return res.status(200).cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options).json(
   new apiResponse(200,{user:loggedInUser,refreshToken,accessToken},"loggedIn successfully")
  )

});

const logoutUser = asyncHandler(async(req,res)=>{
     await User.findByIdAndUpdate(req.user._id,
         {
            $set:{
               refreshToken:undefined
            }
         },{
            new:true 
         }
      )
      const options ={
      httpOnly:true,
      secure:true,
       sameSite: 'none'
   }
      return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
         new apiResponse(200,{},"user logged out succesfully")
      )
});

const refreshAccessToken = asyncHandler(async (req,res)=>{

    try {
      const token = req.cookies?.refreshTokenToken || req.body.refreshToken;
     
            if(!token){
             throw new apiError(500,"unauthorized access")
            }
            const decodedtoken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decodedtoken._id);
            
            if(!user){
              throw new apiError(400,"there is something went wrong while accessing the access token")
            }
             
            if(token !== user?.refreshToken){
                throw new apiError(400,"refresh token may be expired or used");
            }
           
  
            const options = {
              httpOnly:true,
              secure:true,
              sameSite: 'none' 
            }
  
           const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
         
           
           return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
              new apiResponse(200,{
                 accessToken:accessToken,
                 refreshToken:refreshToken
              },"new access and refresh token is generated")
           )
  
    } catch (error) {
       new apiError(401,"refresh token is invalid") 
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {

    const userId = req.user?._id;

    const user = await User.findById(userId)
     .populate("task")
      .populate({
        path: "syllabi",
        populate: {
          path: "subjects", // Optional, based on depth
        },
      });



    return res
    .status(200)
    .json(new apiResponse(
        200,
        user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new apiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name:fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new apiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                profilePic: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new apiResponse(200, user, "Avatar image updated successfully")
    )
})

const removeUserAvatar = asyncHandler(async(req, res) => {
   
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                profilePic: "/temp/profilepicture.png"
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new apiResponse(200, { profilePic: user.profilePic }, "Avatar image remmoved successfully")
    )
})



// @desc    Toggle reminder notifications
// @route   PATCH /api/v1/users/reminder-toggle
// @access  Private (user must be authenticated)
const toggleReminderNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id; // assuming you're using auth middleware

  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(400,"unauthorized access");
  }

  user.preferences.reminderNotifications = !user.preferences.reminderNotifications;
  await user.save();

  res.status(200).json(
    new apiResponse(200,{},"toggled")
  );
});


export {registerUser,removeUserAvatar,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,toggleReminderNotification}