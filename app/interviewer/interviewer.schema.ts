import mongoose from "mongoose";
import { type IInterviewer } from "./interviewer.dto";

const Schema = mongoose.Schema;

const InterviewerSchema = new Schema<IInterviewer>(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IInterviewer>("interviewer", InterviewerSchema);
