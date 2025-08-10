import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser ,getCurrentUser,updateAccountDetails,updateUserAvatar, toggleReminderNotification, removeUserAvatar} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single('profilePic'),
    registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(
     verifyJWT
    ,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword) 
router.route("/current-user").get(verifyJWT, getCurrentUser) 
router.route("/update-account").patch(verifyJWT, updateAccountDetails) 
router.route("/avatar").patch(verifyJWT, upload.single('profilePic'), updateUserAvatar)
router.route("/remove-avatar").patch(verifyJWT,removeUserAvatar)
router.route("/togglereminder").patch(verifyJWT,toggleReminderNotification) 

export default router;