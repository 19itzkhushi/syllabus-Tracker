import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addNotes, addtask, addTopicResource, clearTopicNotesOrReminder, deleteNote, deleteTask, getAllTasks, getUserNotes, markAllTopicsAsDone, markAllTopicsAsUnDone, removeTopicReminder, removeTopicResource, setTopicReminder, toggleTopicCompletion, updateTopicNotes } from "../controllers/functional.controller.js";

const router = Router();

router.route("/toggle/:subjectId/:chapterId/:topicId").patch(verifyJWT,toggleTopicCompletion);
router.route("/update-notes").patch(verifyJWT,updateTopicNotes);
router.route("/add-resource").post(verifyJWT,addTopicResource);
router.route("/set-reminder").post(verifyJWT,setTopicReminder);
router.route("/remove-reminder").post(verifyJWT,removeTopicReminder);
router.route("/remove-resource").patch(verifyJWT,removeTopicResource);
router.route("/clear").patch(verifyJWT,clearTopicNotesOrReminder);
router.route("/all-done").patch(verifyJWT,markAllTopicsAsDone);
router.route("/all-undone").patch(verifyJWT,markAllTopicsAsUnDone);

//notes routes
router.route("/addNotes").post(verifyJWT, upload.single('file'),addNotes)
router.route("/getAllNotes").get(verifyJWT,getUserNotes)
router.route("/deleteNote/:noteId").delete(verifyJWT,deleteNote)

//task routes

router.route("/addTask").post(verifyJWT,addtask)
router.route("/getAllTask").get(verifyJWT,getAllTasks)
router.route("/deleteTask/:taskId").delete(verifyJWT,deleteTask)

export default router;

