import * as interviewerService from "./interviewer.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";

export const createInterviewer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await interviewerService.createInterviewer(req.body);
    res.send(createResponse(result, "Interviewer created sucssefully"));
  }
);

export const updateInterviewer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await interviewerService.updateInterviewer(
      req.params.id,
      req.body
    );
    res.send(createResponse(result, "Interviewer updated sucssefully"));
  }
);

export const editInterviewer = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user?._id !== req.params.id) {
      throw createHttpError(401, {
        message: "You are not authorized to access this resource",
      });
    }
    const result = await interviewerService.editInterviewer(
      req.params.id,
      req.body
    );
    res.send(createResponse(result, "Interviewer updated sucssefully"));
  }
);

export const deleteInterviewer = asyncHandler(
  async (req: Request, res: Response) => {
    await interviewerService.deleteInterviewer(req.params.id);
    res.send(createResponse("Interviewer deleted sucssefully"));
  }
);

export const getInterviewerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, id } = req.params;
    const result = await interviewerService.getInterviewerById(companyId, id);
    res.send(createResponse(result));
  }
);

export const getAllInterviewer = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await interviewerService.getAllInterviewer(page, limit, companyId);
    res.send(createResponse(result));
  }
);
export const getInterviewerCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await interviewerService.getInterviewerCategory(categoryId);
    res.send(createResponse(result));
  }
);
