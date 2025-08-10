import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },        
  message: { type: String, required: true },
  type: { type: String, default: 'reminder' },
  read: { type: Boolean, default: false },
  popped:{type:Boolean,default:false},
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', NotificationSchema);
