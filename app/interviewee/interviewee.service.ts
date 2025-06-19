import feedbackSchema from "../feedback/feedback.schema";
import userSchema from "../user/user.schema";
import { IInterviewee } from "./interviewee.dto";
import intervieweeSchema from "./interviewee.schema";

export const createInterviewee = async (
  intervieweeData: IInterviewee,
  categoryId: string,
  interviewerId: string
) => {
  let admin;
  if (!interviewerId) {
    admin = await userSchema.findOne({ role: "ADMIN" });
  }

  const existingInterviewee = await intervieweeSchema.findOne({ email: intervieweeData.email }).lean();

  if (existingInterviewee) {
    const existingFeedback = await feedbackSchema.findOne({
      category: categoryId,
      interviewer: interviewerId ?? admin?._id,
      interviewee: existingInterviewee._id
    }).populate('interviewee').lean();

    if (existingFeedback) {
      throw new Error("You have already given an interview for this category");
    }
  }

  const newInterviewee = new intervieweeSchema(intervieweeData);
  return await newInterviewee.save();
};
