import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { Syllabus } from "../models/syllabus.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

const getallnotification = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    if(!userId){
     throw new apiError(400,"unauthorized access")
    }

    const notifications = await Notification.find({userId}).sort({createdAt : -1});
     
  

    res.status(200).json(
        new apiResponse(200,notifications,"got all notifications")
    )

});
const togglePopped = asyncHandler(async(req,res)=>{
      const { notificationId } = req.body;
  const userId = req.user?._id;

  if(!userId){
    throw new apiError(404,"user id not found");
  }

  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { popped: true } },
    { new: true }
  );

  if (!updated) {
    throw new apiError(404,"Notification not popped");
  }

  res.status(200).json(
    new apiResponse(200,updated,"notification is popped")
  )

});

   
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  const userId = req.user?._id;

  if(!userId){
    throw new apiError(404,"user id not found");
  }

  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!updated) {
    throw new apiError(404,"Notification not found");
  }

  res.status(200).json(
    new apiResponse(200,updated,"notification is marked as read")
  )
});

const markAllRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(404, "User ID not found");
  }

  const result = await Notification.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json(
    new apiResponse(200, result, "All notifications marked as read")
  );
});






export {getallnotification,markNotificationAsRead,togglePopped,markAllRead}
