import mongoose from "mongoose";
import { type IUser } from "./user.dto";

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    alias: { type: String},
    email: { type: String, required: true, unique : true },
    active: { type: Boolean, required: false, default: true },
    payment_status: { type: Boolean, required: false, default: false },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "COMPANY", "INTERVIEWER", "USER"],
      default: "USER",
    },
    password: { type: String, required: false },
    resetToken : { type: String, required: false },
    resetTokenExpiration : { type: Date, required: false },
    provider : { type: String, required: false },
    sessionID : { type: String, required : false, default : "" }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("user", UserSchema);
