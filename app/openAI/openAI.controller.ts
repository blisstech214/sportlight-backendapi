import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import * as openAIService from "./openAI.service";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const generateQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const noOfQuestions: number = parseInt(req.body.noOfQuestions || "5");
    const file = (req as MulterRequest).file;

    if (!file) {
      throw new Error("File not provided");
    }

    const result = await openAIService.generateQuestions(file, noOfQuestions);

    res.send(createResponse(result, "Questions created successfully"));
  }
);
