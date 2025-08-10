import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { Syllabus } from "../models/syllabus.model.js";
import { parseSyllabus } from "../utils/regex.js";
import { User } from "../models/user.model.js";

const getStarted = asyncHandler(async(req,res)=>{

    console.log("get started works fine")
    const userId = req.user._id;
    if(!userId){
        throw new apiError(400,"please first login or register yourself after that you can start")
    }
 let syllabus = await Syllabus.findOne({ userId });
    if(!syllabus){    
    syllabus = await Syllabus.create({
        userId:userId
    })
       }

    res.status(200).json(
        new apiResponse(200,syllabus,"ready to add subjects")
    )
})

const getSubject = asyncHandler(async(req,res)=>{
     const userId = req.user._id;
     const {subjectId} = req.params;

    

      if(!userId){
        throw new apiError(400,"please first login or register yourself after that you can start")
    }

     if(!subjectId){
      throw apiError(401,"subject not found");
     }

    const syllabus = await Syllabus.findOne({ userId });
    if(!syllabus){
      throw new apiError(400,"syllabus not fouund");
    }

    const subject = syllabus.subjects.id(subjectId);
     
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

    
    res.status(200).json(
      new apiResponse(200,subject,"subject is found")
    )
})


const getChapter = asyncHandler(async(req,res)=>{
     const userId = req.user._id;
     const {subjectId,chapterId} = req.params;

      if(!userId){
        throw new apiError(400,"please first login or register yourself after that you can start")
    }

     if(!subjectId){
      throw apiError(401,"subject not found");
     }

     
     if(!chapterId){
      throw apiError(401,"chapter not found");
     }

    const syllabus = await Syllabus.findOne({ userId });
    if(!syllabus){
      throw new apiError(400,"syllabus not fouund");
    }

    const subject = syllabus.subjects.id(subjectId);
     
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

   const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

    
    res.status(200).json(
      new apiResponse(200,chapter,"subject is found")
    )
})

const uploadSyllabus = asyncHandler(async(req,res)=>{
    
   const {subjectName,rawSyllabus} = req.body;
          
if(!subjectName || !rawSyllabus){
    throw new apiError(400,"both feilds are required")
}
   
  const userId = req.user._id;
    
     if(!userId){
        throw new apiError(400,"please first login or register yourself after that you can start")
    }
 const syllabus = await Syllabus.findOne({ userId });
    
     
    if(!syllabus){
        throw new apiError(404,"unauthorized access to syllabus");
    }

    const chapterArr = parseSyllabus(rawSyllabus);
    
    
   
    
     
const transformedChapters = chapterArr.map(chap => ({title:chap.Chapter ,topics: chap.topics.map(
        topic=>({
        name: topic.title,
        isCompleted: false,
        notes: '',
        resources: [],
        reminder: null
      })
      )}))

      
   syllabus.subjects.push({
        name:subjectName,
        chapters :transformedChapters
    });

  

    

   const finalSyllabus = await syllabus.save();
   if(!finalSyllabus){
    throw new apiError(400,"there is some error in final syllabus");
   }
     
   await User.findByIdAndUpdate(
        userId,
        {
            $set: {
               syllabi:finalSyllabus
            } 
        },
        {new: true}
        
    )

    

    res.status(200).json(
        new apiResponse(200,finalSyllabus,"syllabus uploaded")
    )

})

const editSubjectName = asyncHandler(async (req, res) => {
  const { subjectId, newName } = req.body;
  const userId = req.user._id;

  if (!subjectId || !newName) {
    throw new apiError(400, "Subject ID and new name are required");
  }

  const syllabus = await Syllabus.findOne({ userId });

  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);

  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  subject.name = newName;

  await syllabus.save({ validateBeforeSave: false });

  res.status(200).json(new apiResponse(200, syllabus, "Subject name updated successfully"));
});

const editChapterName = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, newTitle } = req.body;
  const userId = req.user._id;

  if (!subjectId || !chapterId || !newTitle) {
    throw new apiError(400, "Subject ID, Chapter ID, and new title are required");
  }

  const syllabus = await Syllabus.findOne({ userId });

  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

  chapter.title = newTitle;

  await syllabus.save({ validateBeforeSave: false });

  res.status(200).json(new apiResponse(200, syllabus, "Chapter name updated successfully"));
});

const editTopicName = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId, newName } = req.body;
  const userId = req.user._id;

  if (!subjectId || !chapterId || !topicId || !newName) {
    throw new apiError(400, "Subject ID, Chapter ID, Topic ID, and new name are required");
  }

  const syllabus = await Syllabus.findOne({ userId });

  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

  const topic = chapter.topics.id(topicId);
  if (!topic) {
    throw new apiError(404, "Topic not found");
  }

  topic.name = newName;

  await syllabus.save({ validateBeforeSave: false });

  res.status(200).json(new apiResponse(200, syllabus, "Topic name updated successfully"));
});

const addChapter = asyncHandler(async (req, res) => {
  const { subjectId, chapterTitle } = req.body;
  const userId = req.user._id;

  if (!subjectId || !chapterTitle) {
    throw new apiError(400, "Subject ID and chapter title are required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

   const chapterArr = parseSyllabus(chapterTitle);

   const transformedChapters = chapterArr.map(chap => ({title:chap.Chapter ,topics: chap.topics.map(
        topic=>({
        name: topic.title,
        isCompleted: false,
        notes: '',
        resources: [],
        reminder: null
      })
      )}))

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }


subject.chapters.push(...transformedChapters);

  
const finalSyllabus = await syllabus.save();
   if(!finalSyllabus){
    throw new apiError(400,"there is some error in final syllabus");
   }
     
   await User.findByIdAndUpdate(
        userId,
        {
            $set: {
               syllabi:finalSyllabus
            } 
        },
        {new: true}   
        
    )


  res.status(200).json(new apiResponse(200, finalSyllabus, "Chapter added successfully"));
});



const deleteChapter = asyncHandler(async (req, res) => {
  const { subjectId, chapterId } = req.params;
  const userId = req.user._id;

  if (!subjectId || !chapterId) {
    throw new apiError(400, "Subject ID and Chapter ID are required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  subject.chapters.id(chapterId).deleteOne(); // or .remove()

  await syllabus.save();
  res.status(200).json(new apiResponse(200, syllabus, "Chapter deleted successfully"));
});

const toggleChapterComplete = asyncHandler(async (req, res) => {
  const { subjectId, chapterId } = req.params;
  const userId = req.user._id;

  if (!subjectId || !chapterId) {
    throw new apiError(400, "Subject ID and Chapter ID are required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

  chapter.completed = !chapter.completed;
  chapter.completedDate = chapter.completed ? new Date() : null;

  if(chapter.completed){
    chapter.completedOn = new Date().toISOString().split("T")[0];
  }
  
  await syllabus.save({ validateBeforeSave: false });
  res.status(200).json(new apiResponse(200, chapter, "Chapter toggled successfully"));
});
          

const addTopic = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicName } = req.body;
  const userId = req.user._id;

  if (!subjectId || !chapterId || !topicName) {
    throw new apiError(400, "Subject ID, Chapter ID, and topic name are required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

  chapter.topics.push({
    name: topicName,
    isCompleted: false,
    notes: '',
    resources: [],
    reminder: null
  });

  await syllabus.save();
  res.status(200).json(new apiResponse(200, syllabus, "Topic added successfully"));
});

const deleteTopic = asyncHandler(async (req, res) => {
  const { subjectId, chapterId, topicId } = req.params;
  const userId = req.user._id;

  if (!subjectId || !chapterId || !topicId) {
    throw new apiError(400, "Subject ID, Chapter ID, and Topic ID are required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }

  const subject = syllabus.subjects.id(subjectId);
  if (!subject) {
    throw new apiError(404, "Subject not found");
  }

  const chapter = subject.chapters.id(chapterId);
  if (!chapter) {
    throw new apiError(404, "Chapter not found");
  }

  chapter.topics.id(topicId).deleteOne();

  await syllabus.save();
  res.status(200).json(new apiResponse(200, syllabus, "Topic deleted successfully"));
});

const deleteSubject = asyncHandler(async(req,res)=>{
   const {subjectId} = req.params;
    const userId = req.user._id;
  
       
  if (!subjectId) {
    throw new apiError(400, "Subject ID is required");
  }

  const syllabus = await Syllabus.findOne({ userId });
  if (!syllabus) {
    throw new apiError(404, "Syllabus not found");
  }
   
 await syllabus.subjects?.id(subjectId).deleteOne();


  await syllabus.save();
  res.status(200).json(new apiResponse(200, syllabus, "subject deleted successfully"));

});





export {getStarted,toggleChapterComplete,uploadSyllabus,editSubjectName,editChapterName,editTopicName,addChapter,deleteChapter,addTopic,deleteTopic,deleteSubject,getChapter,getSubject}