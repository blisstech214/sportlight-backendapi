import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IFeedback extends BaseSchema {
  interviewer: Types.ObjectId;
  userID: Types.ObjectId;
  category: Types.ObjectId;
  interviewee: Types.ObjectId;
  overallFeedback?: string;
  rating?: number;
  qaList?: {
    question: string;
    answer: string;
    status: 'answered' | 'unanswered';
  }[];
}