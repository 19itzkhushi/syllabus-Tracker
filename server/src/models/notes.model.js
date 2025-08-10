import mongoose, { Schema } from 'mongoose';

const NotesSchema = new Schema({
   title:{
    type: String,
    default: "",
   },
   text: {
    type: String,
    default:""
  },
  file: 
    {
      type: String, // File storage URL (e.g., Cloudinary or local path)
      default:""
    },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notes = mongoose.model('Notes', NotesSchema);
