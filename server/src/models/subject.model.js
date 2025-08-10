// models/Subject.js
import mongoose,{Schema} from 'mongoose';

const SubjectSchema = new Schema({
  name: {
   type: String, 
   required: true
 },
  chapters: {
    type:Schema.Types.ObjectId,
    ref:'Chapter'
  }
},{timestamps:true});

export const Subject = mongoose.model("Subject",SubjectSchema);
