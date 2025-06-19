import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as intervieweeController  from "./interviewee.controller";
import * as intervieweeValidation from "./interviewee.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .post(
    "/:categoryId/:interviewerId",
    intervieweeValidation.createInterviewee,
    catchError,
    intervieweeController.createInterviewee
  )
  .post(
    "/:categoryId",
    intervieweeValidation.createInterviewee,
    catchError,
    intervieweeController.createInterviewee
  )
  .post(
    "/",
    intervieweeValidation.createInterviewee,
    catchError,
    intervieweeController.createInterviewee
  )
  

export default router;
