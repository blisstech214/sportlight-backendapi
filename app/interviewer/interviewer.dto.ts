import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IInterviewer extends BaseSchema {
  company: Types.ObjectId;
  user: Types.ObjectId;
  categories: Types.ObjectId[];
}
