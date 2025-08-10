import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// models/Syllabus.js

// TopicSchema: NOT a full model

const TopicSchema = new mongoose.Schema({
  name: {
     type: String,
    required: true
 },
  isCompleted: { 
    type: Boolean, 
    default: false 
},
completedAt:{
    type: Date,
  default: null
   },
  notes: { 
    type: String, 
    default: ''  
}, // optional
 resources: [
    {
      title: {
        type: String,
        default: '' // optional title
      },
      url: {
        type: String,
        required: true, // user must provide URL if resource is added
      }
    }
  ],
  reminder: { 
    type: Date 
} // optional
});

// ChapterSchema: contains an array of topics
const ChapterSchema = new Schema({
  title: { type: String, required: true },
  topics:{type:[TopicSchema],default:[]},
  completed:{type: Boolean, 
    default: false },
   completedOn:{
    type:String
   }
},
{timestamps:true});

// SubjectSchema: contains an array of chapters
const SubjectSchema = new Schema({
  name: {
   type: String,
   default:'Subject Name', 
   required: true
 },
  chapters: {
    type:[ChapterSchema],
    default:[]
  }
},{timestamps:true});   


const SyllabusSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },  
  subjects:{
    type:[SubjectSchema],
    default:[]
  },
  
},{timestamps:true});

SyllabusSchema.plugin(mongooseAggregatePaginate)

export const Syllabus =  mongoose.model("Syllabus",SyllabusSchema);
    