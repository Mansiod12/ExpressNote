const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();
const noteRoutes = require("./routes/noteRoutes");

const app=express();

app.use(express.json());


app.use("/api", noteRoutes);
app.use(cors({
   origin: process.env.FRONTEND_URL, // Allow frontend requests
   credentials: true, // If using cookies or authentication
 }));

// Connect to MongoDB
const conn = async()=>{
    try{
     await mongoose.connect(`${process.env.URI}`);
     console.log("database connected");
    }catch(error){
       console.log(error);
    }
 
 };
 conn();

 export default app;
