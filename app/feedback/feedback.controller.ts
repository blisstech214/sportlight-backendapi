import * as feedbackService from "./feedback.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import mongoose from "mongoose";

export const createFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId, interviewerId, intervieweeId } = req.params;
    const result = await feedbackService.createFeedback(
      categoryId, interviewerId, intervieweeId, req.body,
    );
    res.send(createResponse(result, "Feedback created successfully"));
  }
);
export const getAllFeedbacks = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await feedbackService.getAllFeedbacks(req.user!._id, req.user!.role, page, limit);
    res.send(createResponse(result, "Feedbacks retrieved successfully"));
  }
);

export const getAllFeedbacksByUserID = asyncHandler(
  async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {

      console.log("userIDuserIDuserID", userID);
      

      if (mongoose.Types.ObjectId.isValid(userID)) {
        const result = await feedbackService.getAllFeedbacksByUserID(userID)

        res.send({
          success: true,
          feedbacks: result
        });

      }
      else {
        res.status(400).json({ success: false, message: "Invalid user ID" });
      }

    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }

  }
);

export const getAIAdminFeedbacks = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await feedbackService.getAIAdminFeedbacks(page, limit);
    res.send(createResponse(result, "Feedbacks retrieved successfully"));
  }
);


