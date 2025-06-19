import { Router } from "express";
import * as openAIController from "./openAI.controller"
import { upload } from "../helper/multer";

const router = Router();

router
  .post(
    "/",
    upload.single('file'),
    openAIController.generateQuestions
  )
 

export default router;
