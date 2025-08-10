import { Router } from "express";
import { addChapter, addTopic, deleteChapter, deleteSubject, deleteTopic, editChapterName, editSubjectName, editTopicName, getChapter, getStarted, getSubject, toggleChapterComplete, uploadSyllabus } from "../controllers/syllabus.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/get-started").get(verifyJWT,getStarted);
router.route("/get-subject/:subjectId").get(verifyJWT,getSubject);
router.route("/get-chapter/:subjectId/chapter/:chapterId").get(verifyJWT,getChapter);
router.route("/upload-syllabus").patch(verifyJWT,uploadSyllabus);
router.route("/edit-subject-name").patch(verifyJWT,editSubjectName);
router.route("/edit-chapter-name").patch(verifyJWT,editChapterName);
router.route("/edit-topic-name").patch(verifyJWT,editTopicName);
router.route("/add-topic").patch(verifyJWT,addTopic);
router.route("/delete-topic/:subjectId/:chapterId/:topicId").delete(verifyJWT,deleteTopic);
router.route("/add-new-chapter").patch(verifyJWT,addChapter);
router.route("/delete-subject/:subjectId").delete(verifyJWT,deleteSubject);
router.route("/delete-chapter/:subjectId/:chapterId").delete(verifyJWT,deleteChapter);

//functional route
router.route("/toggle-chapter/:subjectId/:chapterId").patch(verifyJWT,toggleChapterComplete);




export default router;