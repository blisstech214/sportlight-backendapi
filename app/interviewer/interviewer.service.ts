import createHttpError from "http-errors";
import { type IInterviewer } from "./interviewer.dto";
import InterviewerSchema from "./interviewer.schema";
import userSchema from "../user/user.schema";
import questionSchema from "../question/question.schema";
import interviewerSchema from "./interviewer.schema";
import categorySchema from "../category/category.schema";

export const createInterviewer = async (data: Partial<IInterviewer>) => {
  const result = await InterviewerSchema.create({ ...data, active: true });
  return result;
};

export const updateInterviewer = async (id: string, data: IInterviewer) => {
  const result = await InterviewerSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editInterviewer = async (
  id: string,
  data: Partial<IInterviewer>
) => {
  const result = await userSchema
    .findOneAndUpdate({ _id: id }, data, {
      new: true,
    })
    .select("-password");
  return result;
};

export const deleteInterviewer = async (interviewerId: string) => {
  const interviewer = await userSchema.findOneAndDelete({
    _id: interviewerId,
  });
  if (!interviewer) {
    throw createHttpError(404, {
      message: "Interviewer not found",
    });
  }
  await interviewerSchema.deleteOne({ user: interviewerId });
  await questionSchema.deleteMany({ interviewer: interviewerId });
};

export const getInterviewerById = async (companyId: string, id: string) => {
  const result = await InterviewerSchema.findOne({ user: id })
    .populate({ path: "company", select: "_id name email" })
    .populate({ path: "user", select: "_id name email role" })
    .lean();
  if (companyId !== result?.company._id.toString()) {
    throw createHttpError(401, {
      message: "Provided company id is not matching with the interviewer",
    });
  }
  return result;
};

export const getAllInterviewer = async (
  page: number,
  limit: number,
  companyId: string
) => {
  const skip = (page - 1) * limit;
  const interviewers = await InterviewerSchema.find({ company: companyId })
    .populate({ path: "company", select: "_id name email" })
    .populate({ path: "user", select: "_id name email role" })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalDocs = await InterviewerSchema.countDocuments({
    company: companyId,
  })
    .populate({ path: "company", select: "_id name email" })
    .populate({ path: "user", select: "_id name email role" });
  return {
    interviewers,
    totalDocs,
    currentPage: page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};

export const getInterviewerCategory = async (categoryId: string) => {
  const result = await InterviewerSchema.find({ 
    categories: categoryId  
  })
    .populate({ path: "company", select: "_id name email" })
    .populate({ path: "user", select: "_id name email role" })
    .populate({ path: "categories", select: "_id name" })

    .lean();
  return result;
};