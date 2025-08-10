import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}));
app.use(express.text());
app.use(express.urlencoded({extended:true,limit:"20kb"}));
app.use(express.static("public"));
app.use(cookieParser());



import userRouter from './routes/user.route.js';
import syllabusRouter from './routes/syllabus.route.js';
import functionRouter from './routes/function.route.js';
import notificationRouter from './routes/notify.route.js';


app.use("/api/v1/users",userRouter);
app.use("/api/v1/syllabus",syllabusRouter);
app.use("/api/v1/function",functionRouter);
app.use("/api/v1/notify",notificationRouter);




export {app}