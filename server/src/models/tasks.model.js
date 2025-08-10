import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema({
  about: {
     type: String,
    required: true
 },
  isCompleted: { 
    type: Boolean, 
    default: false 
},
  reminder: { 
    type: Date 
}
});

export const Task = mongoose.model('Task', TaskSchema);