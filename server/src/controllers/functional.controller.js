import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { Notes } from "../models/notes.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/tasks.model.js";
import { Syllabus } from "../models/syllabus.model.js";
import { parseDate } from "chrono-node";

const toggleTopicCompletion = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId } = req.params;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

  const subject = syllabus.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  topic.isCompleted = !topic.isCompleted;
  
  if (topic.isCompleted) {
    topic.completedAt = new Date(); // Set timestamp when completed
  } else {
    topic.completedAt = null; // Clear timestamp when uncompleted
  }

  await syllabus.save();

  res.status(200).json({ message: "Topic completion toggled", topic });
});


const updateTopicNotes = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, note } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  topic.notes = note;
  await syllabus.save();

  res.status(200).json({ message: "Notes updated", topic });
});


const addTopicResource = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, resource } = req.body;
  const userId = req.user._id;

  if (!resource?.url) return res.status(400).json({ message: "URL is required" });

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  topic.resources.push({
    title: resource.title || "",     // fallback to empty string if not provided
    url: resource.url                // required
  });
  await syllabus.save();

  res.status(200).json({ message: "Resource added", topic });
});


const setTopicReminder = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, reminder } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic)throw new apiError(400,"topic is not found");
 

    const parsedReminder = parseDate(reminder);

    

  // Validate the parsed result
  if (!(parsedReminder instanceof Date) || isNaN(parsedReminder)) {
    throw new apiError(400,"invalid date format");
  }
//   if (parsedReminder < new Date()) {
//   throw new apiError(400, "Reminder date cannot be in the past");
// }


  topic.reminder = parsedReminder; // should be a date string or Date object
  await syllabus.save();

  res.status(200).json({ message: "Reminder set", topic });
});

const removeTopicReminder = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic)throw new apiError(400,"topic is not found");
 
  topic.reminder = null; // should be a date string or Date object
  await syllabus.save();

  res.status(200).json({ message: "Reminder removed", topic });
});

const removeTopicResource = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, resourceId } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  topic.resources = topic.resources.filter(r => r._id.toString() !== resourceId);
  await syllabus.save();

  res.status(200).json({ message: "Resource removed", topic });
});


const clearTopicNotesOrReminder = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, clearNote, clearReminder } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  const subject = syllabus?.subjects.id(subjectId);
  const chapter = subject?.chapters.id(chapterId);
  const topic = chapter?.topics.id(topicId);

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (clearNote) topic.notes = '';
  if (clearReminder) topic.reminder = undefined;

  await syllabus.save();

  res.status(200).json({ message: "Cleared successfully", topic });
});


const markAllTopicsAsDone = asyncHandler(async (req, res) => {
  const { subjectId, chapterId } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) return res.status(404).json({ message: "Chapter not found" });

  // ✅ Set all topics to completed
  chapter.topics.forEach(topic => {
    topic.isCompleted = true;
  });

  await syllabus.save();

  res.status(200).json({ message: "All topics marked as done", topics: chapter.topics });
});

const markAllTopicsAsUnDone = asyncHandler(async (req, res) => {
  const { subjectId, chapterId } = req.body;
  const userId = req.user._id;

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) return res.status(404).json({ message: "Chapter not found" });

  // ✅ Set all topics to completed
  chapter.topics.forEach(topic => {
    topic.isCompleted = false;
  });

  await syllabus.save();

  res.status(200).json({ message: "All topics marked as done", topics: chapter.topics });
});

//notes controller

const addNotes =asyncHandler(async(req,res)=>{
  const {title,text} = req.body
  const userId = req.user._id;
  
 if (!text && !req.file) {
  throw new apiError(400, "At least provide either a text or a file");
}

 const fileLocalPath = req.file?.path

 const filePath = await uploadFileToCloudinary(fileLocalPath);
 console.log("file is uplaoded ",filePath.url)
 const notes = await Notes.create({
    title,
    text:text||"",
    file:filePath?.url || ""
 })

 if(!notes){
  throw new apiError(400,"notes is not created")
 }

 const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  user.notes.push(notes._id); // 🛠️ use note._id instead of full object
  await user.save();

 res.status(200).json(
  new apiResponse(200,{},"notes added succesfully")
 )

})


const deleteNote = asyncHandler(async (req, res) => {
  const {noteId} = req.params;
  const userId = req.user._id;

  const note = await Notes.findById(noteId);
  if (!note) {
    throw new apiError(404, "Note not found");
  }

  // Remove note ID from user's notes array
  await User.findByIdAndUpdate(userId, {
    $pull: { notes: note._id },
  });

  // Delete the note document
  await Notes.findByIdAndDelete(noteId);

  res.status(200).json(
    new apiResponse(200, {}, "Note deleted successfully")
  );
});



const getUserNotes = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("notes");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  res.status(200).json(
    new apiResponse(200, { notes: user.notes }, "Fetched user notes")
  );
});

//task controller

const addtask = asyncHandler(async(req,res)=>{
    const {about,reminder} = req.body;
    const userId = req.user._id;
    if(!about || !reminder){
      throw new apiError(400,"please give task and task reminder also");
    }

  const parsedReminder = parseDate(reminder);

    

  // Validate the parsed result
  if (!(parsedReminder instanceof Date) || isNaN(parsedReminder)) {
    throw new apiError(400,"invalid date format");
  }


const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }


   const totalTasks = user.task.length;
  const overdueTasks = user.task.filter(task => new Date(task.reminder) < new Date() && !task.isCompleted);
  const incompleteTasks = user.task.filter(task => !task.isCompleted);

  if (totalTasks >= 50) {
    throw new apiError(
      403,
      `You have reached the maximum limit of 50 tasks. Please complete some tasks or delete overdue ones first.\nYou have ${overdueTasks.length} overdue and ${incompleteTasks.length} incomplete tasks.`
    );
  }

  const mytask = await Task.create({
      about,
      isCompleted: false,
      reminder:parsedReminder
  })

  user.task.push(mytask._id); // 🛠️ use note._id instead of full object
  await user.save();
  
   res.status(200).json(
  new apiResponse(200,{task:user.task},"task added succesfully")
 )

})

const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("task");
  if (!user) {
    throw new apiError(404, "User not found");
  }

  res.status(200).json(
    new apiResponse(200, user.task, "Tasks fetched successfully")
  );
});

const deleteTask = asyncHandler(async(req,res)=>{

const {taskId} = req.params;
  const userId = req.user._id;

  const mytask = await Task.findById(taskId);
  if (!mytask) {
    throw new apiError(404, "task not found");
  }

  // Remove note ID from user's notes array
  await User.findByIdAndUpdate(userId, {
    $pull: { task: mytask._id },
  });

  // Delete the note document
  await Task.findByIdAndDelete(taskId);

  res.status(200).json(
    new apiResponse(200, {}, "task deleted successfully")
  );

})






export  {addtask,getAllTasks,deleteTask,getUserNotes,deleteNote,addNotes,toggleTopicCompletion,markAllTopicsAsUnDone,removeTopicReminder,updateTopicNotes,addTopicResource,setTopicReminder,removeTopicResource,clearTopicNotesOrReminder,markAllTopicsAsDone}


