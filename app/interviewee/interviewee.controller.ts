import * as intervieweeService from "./interviewee.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createInterviewee = asyncHandler(
  async (req: Request, res: Response) => {
    const {categoryId, interviewerId} = req.params;
    const result = await intervieweeService.createInterviewee(req.body,categoryId,interviewerId);
    res.send(createResponse(result, "Interviewee created successfully"));
  
  }
);