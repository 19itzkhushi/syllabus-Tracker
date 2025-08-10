import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import "./jobs/remindercron.js"; // 🧠 make sure this runs at startup
// import "./jobs/testcron.js"; // 🧠 make sure this runs at startup
import "./jobs/deletecron.js";
import "./jobs/notiCron.js";



dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
 app.on("error",(error)=>{
  console.log("ERROR",error);
  throw error
 })   
 // Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
  });
});

 app.listen(process.env.PORT || 3000,()=>{
    console.log(`server error is on port: ${process.env.PORT || 3000}`)
 })
})
.catch((err)=>{
    console.log(`mongoDB connection failed`,err)
})