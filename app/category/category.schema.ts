import mongoose from "mongoose";
import { type ICategory } from "./category.dto";

const Schema = mongoose.Schema;

const CategorySchema = new Schema<ICategory>(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("category", CategorySchema);
