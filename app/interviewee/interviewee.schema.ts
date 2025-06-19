import mongoose from "mongoose";
import {  IInterviewee } from "./interviewee.dto";

const Schema = mongoose.Schema

const IntervieweeSchema = new Schema<IInterviewee>(

  {
    name:{
      type:String ,required:true
    },
    email:{
      type: String ,required:true
    },

    
  },
  { timestamps: true }
);


export default mongoose.model<IInterviewee>("interviewee", IntervieweeSchema);
