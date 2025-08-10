// models/Topic.js
import mongoose,{Schema} from "mongoose";

const TopicSchema = new mongoose.Schema({
  name: {
     type: String,
    required: true
 },
  isCompleted: { 
    type: Boolean, 
    default: false 
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
        required: true // user must provide URL if resource is added
      }
    }
  ],
  reminder: { 
    type: Date 
} // optional
});

export const Topic  = mongoose.model("Topic",TopicSchema);
