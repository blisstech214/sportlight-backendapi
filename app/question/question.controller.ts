import * as questionService from "./question.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import userSchema from "../user/user.schema";

export const createQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await questionService.createQuestion(
      categoryId,
      req.user?._id ?? "",
      req.body
    );
    res.send(createResponse(result, "Question created sucssefully"));
  }
);

export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await questionService.updateQuestion(
      req.params.id,
      req.body
    );
    res.send(createResponse(result, "Question updated sucssefully"));
  }
);

export const editQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId, id } = req.params;
    const result = await questionService.editQuestion(categoryId, id, req.body);
    res.send(createResponse(result, "Question updated sucssefully"));
  }
);

export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await questionService.deleteQuestion(req.params.id);
    res.send(createResponse(result, "Question deleted sucssefully"));
  }
);

export const getQuestionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId, id } = req.params;
    const result = await questionService.getQuestionById(categoryId, id);
    res.send(createResponse(result));
  }
);

export const getAllQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId, interviewerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await questionService.getAllQuestion(
      page,
      limit,
      categoryId,
      interviewerId
    );
    res.send(createResponse(result));
  }
);

export const getAllQuestionByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const admin = await userSchema.findOne({ role: "ADMIN" });
    const result = await questionService.getAllQuestion(
      page,
      limit,
      categoryId,
      admin?._id ?? ""
    );
    res.send(createResponse(result));
  }
);
