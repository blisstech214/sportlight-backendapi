import mongoose from "mongoose";
import { type IQuestion } from "./question.dto";
import QuestionSchema from "./question.schema";

export const createQuestion = async (
  categoryId: string,
  interviewerId: string,
  questions: { question: string; videoUrl: string }[]
) => {
  console.log(categoryId, interviewerId, questions);
  if (!questions || !Array.isArray(questions)) {
    throw new Error("Invalid questions array");
  }

  const result = await Promise.all(
    questions.map(async (item: { question: string; videoUrl: string }) => {
      return await QuestionSchema.create({
        title: item.question,
        videoUrl: item.videoUrl,
        category: categoryId,
        interviewer: interviewerId, // here interviewer can be company also
      });
    })
  );
  return result;
};

export const updateQuestion = async (id: string, data: IQuestion) => {
  const result = await QuestionSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editQuestion = async (
  categoryId: string,
  id: string,
  data: Partial<IQuestion>
) => {
  const result = await QuestionSchema.findOneAndUpdate(
    { _id: id, category: categoryId },
    data,
    { new: true }
  );
  console.log(result, "result");
  return result;
};

export const deleteQuestion = async (id: string) => {
  const result = await QuestionSchema.deleteOne({ _id: id });
  return result;
};

export const getQuestionById = async (categoryId: string, id: string) => {
  const result = await QuestionSchema.findOne({
    category: categoryId,
    _id: id,
  }).lean();
  return result;
};

export const getAllQuestion = async (
  page: number,
  limit: number,
  categoryId: string,
  interviewerId: string
) => {
  const skip = (page - 1) * limit;
  const questions = await QuestionSchema.find({
    category: categoryId,
    interviewer: interviewerId,
  })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalDocs = await QuestionSchema.countDocuments({
    category: categoryId,
    interviewer: interviewerId,
  });
  return {
    questions,
    totalDocs,
    currentPage: page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};
