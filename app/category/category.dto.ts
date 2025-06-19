import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface ICategory extends BaseSchema {
  company: Types.ObjectId;
  name: String;
}
