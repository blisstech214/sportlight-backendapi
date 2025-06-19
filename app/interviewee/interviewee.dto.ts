import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IInterviewee extends BaseSchema {
  name: string,
  email: string;

}
