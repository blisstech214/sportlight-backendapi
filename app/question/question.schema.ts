import mongoose from "mongoose";
import { type IQuestion } from "./question.dto";

const Schema = mongoose.Schema;

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>("question", QuestionSchema);
