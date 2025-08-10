// models/Chapter.js
import mongoose,{Schema} from 'mongoose';

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  topics: {
    type:Schema.Types.ObjectId,
    ref:'Topic'
  }
},
{timestamps:true});

export const Chapter = mongoose.model("Chapter",ChapterSchema);
