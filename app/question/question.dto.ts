import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IQuestion extends BaseSchema {
  title: String;
  videoUrl: String;
  category: Types.ObjectId;
  interviewer: Types.ObjectId;
}
