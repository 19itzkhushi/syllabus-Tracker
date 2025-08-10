import { Router } from "express";
import {getallnotification,markAllRead,markNotificationAsRead, togglePopped } from "../controllers/notification.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getallnotification").get(verifyJWT,getallnotification);
router.route("/markedread").patch(verifyJWT,markNotificationAsRead );
router.route("/markallread").patch(verifyJWT,markAllRead );
router.route("/pop").patch(verifyJWT,togglePopped )

      
export default router;