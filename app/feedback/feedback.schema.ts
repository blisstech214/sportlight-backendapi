import mongoose from "mongoose";
import { IFeedback } from "./feedback.dto";

const Schema = mongoose.Schema;

const QAItemSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String},
  status: { type: String, enum: ['answered', 'unanswered'], required: true }
});

const FeedbackSchema = new Schema<IFeedback>(
  {
    category: { type: Schema.Types.ObjectId, ref: "category" },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    overallFeedback: {
      type: String 
    },
    rating: {
      type: Number
    },
    qaList: [QAItemSchema],
    interviewee: { type: Schema.Types.ObjectId, ref: "interviewee", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>("feedback", FeedbackSchema);