// models/User.js
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  profilePic: {
    type: String,
    default: "/temp/profilepicture.png" // you can store URL from cloud storage or base64 string
  },

  refreshToken: {
    type: String,   
   
  },

notes: [{
  type:Schema.Types.ObjectId,
  ref:'Notes'
}],

task:[{
  type:Schema.Types.ObjectId,
  ref:'Task'
}]
,
  syllabi: [{
    type: Schema.Types.ObjectId,
    ref: 'Syllabus'
  }],

  preferences: {
    reminderNotifications: {
      type: Boolean,
      default: true
    }
  }
},
{
    timestamps:true
}
);


UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
 this.password = await bcrypt.hash(this.password,10)
 next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
 
     return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
UserSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",UserSchema);
