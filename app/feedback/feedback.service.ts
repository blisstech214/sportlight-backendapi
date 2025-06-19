import mongoose, { PipelineStage } from "mongoose";
import { IFeedback } from "./feedback.dto";
import feedbackSchema from "./feedback.schema";
import categorySchema from "../category/category.schema";
import userSchema from "../user/user.schema";

interface SearchQuery {
  page?: string;
  limit?: string;
  categoryName?: string;
  interviewerName?: string;
  rating?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const createFeedback = async (
  categoryId: string,
  interviewerId: string,
  intervieweeId: string,
  feedbackData: IFeedback
) => {
  let admin;
  if(!interviewerId){
   admin=await userSchema.findOne({role : "ADMIN"})
  }
  const newFeedback = new feedbackSchema({
    category: categoryId,
    interviewer: interviewerId ?? admin?._id,
    interviewee: intervieweeId,
    userID: feedbackData.userID,
    overallFeedback: feedbackData.overallFeedback,
    rating: feedbackData.rating,
    qaList:feedbackData.qaList
  });
  const result = await newFeedback.save();
  return await feedbackSchema.findById(result._id)
    .populate('category')
    .populate('interviewer')
    .populate('interviewee')
    .lean();
};

export const getAllFeedbacks = async (
  userId: string,
  userRole: string,
  page: number = 1,
  limit: number = 10
) => {
  const pipeline: mongoose.PipelineStage[] = [];
  const countPipeline: mongoose.PipelineStage[] = [];

  const skip = (page - 1) * limit;

  switch (userRole.toLowerCase()) {
    case "admin":
      const adminMatchStage = {
        $match: {
          category: { $exists: true },
        },
      };
      pipeline.push(adminMatchStage);
      countPipeline.push(adminMatchStage);
      break;

    case "interviewer":
      const matchStage = {
        $match: {
          interviewer: new mongoose.Types.ObjectId(userId),
        },
      };
      pipeline.push(matchStage);
      countPipeline.push(matchStage);
      break;

    case "company":
      const companyCategories = await categorySchema
        .find({
          company: new mongoose.Types.ObjectId(userId),
        })
        .select("_id");

      const categoryIds = companyCategories.map((cat) => cat._id);

      const categoryMatchStage = {
        $match: {
          category: { $in: categoryIds },
        },
      };
      pipeline.push(categoryMatchStage);
      countPipeline.push(categoryMatchStage);
      break;

    default:
      throw new Error("Invalid role provided");
  }

  // Add lookups and projection to main pipeline
  pipeline.push(
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "interviewer",
        foreignField: "_id",
        as: "interviewerData",
      },
    },
    {
      $lookup: {
        from: "interviewees",
        localField: "interviewee",
        foreignField: "_id",
        as: "intervieweeData",
      },
    },
    {
      $unwind: {
        path: "$categoryData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "users",  
        localField: "categoryData.company",
        foreignField: "_id",
        as: "categoryData.companyData",
      },
    },
    {
      $project: {
        category: {
          _id: "$categoryData._id",
          name: "$categoryData.name",
          company: { $arrayElemAt: ["$categoryData.companyData", 0] },
          createdAt: "$categoryData.createdAt",
          updatedAt: "$categoryData.updatedAt"
        },
        interviewer: { $arrayElemAt: ["$interviewerData", 0] },
        interviewee: { $arrayElemAt: ["$intervieweeData", 0] },
        qaList:1,
        overallFeedback: 1,
        rating: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    }
  );
  
  pipeline.push(
  { $sort: { createdAt: -1 } },
  { $skip: skip },
  { $limit: limit }
);
  const [feedbacks, [{ total = 0 } = {}]] = await Promise.all([
    feedbackSchema.aggregate(pipeline),
    feedbackSchema.aggregate([...countPipeline, { $count: "total" }]),
  ]);



  return {
    feedbacks,
    pagination: {
      total,
      page,
      limit,
      totalDocs: Math.ceil(total / limit),
    },
  };
};

export const getAllFeedbacksByUserID = async (
  userID: string,
) => {
  
  const feedbacks = await feedbackSchema.find({ userID }).lean();

  return feedbacks

};

export const getAIAdminFeedbacks = async (
  page: number = 1,
  limit: number = 10
) => {
  const feedbacks = await feedbackSchema.find({
    $or: [
      { category: { $exists: false } },
      { category: null },
      { interviewer: { $exists: false } },
      { interviewer: null }
    ]
  })
  .populate("interviewer interviewee")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)

  const total = await feedbackSchema.countDocuments({
    $or: [
      { category: { $exists: false } },
      { category: null },
      { interviewer: { $exists: false } },
      { interviewer: null }
    ]
  });

  return {
    feedbacks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
