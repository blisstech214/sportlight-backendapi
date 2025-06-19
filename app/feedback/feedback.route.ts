import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as feedbackController from "./feedback.controller";
import * as feedbackValidation from "./feedback.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .post(
    "/:categoryId/:interviewerId/:intervieweeId",
    feedbackValidation.createFeedback,
    catchError,
    feedbackController.createFeedback
  )
  .post(
    "/:categoryId/:intervieweeId",
    feedbackValidation.createFeedbackAdmin,
    catchError,
    feedbackController.createFeedback
  )
  .post(
    "/:intervieweeId",
    feedbackValidation.createFeedbackAdmin,
    catchError,
    feedbackController.createFeedback
  )
  .get(
    "/",
    roleAuth(["ADMIN", "INTERVIEWER", "COMPANY"]),
    feedbackController.getAllFeedbacks
  )
  .get(
    "/admin-ai",
    roleAuth(["ADMIN"]),
    feedbackController.getAIAdminFeedbacks
  )
  .get(
    "/:userID",
    feedbackController.getAllFeedbacksByUserID
  )
 

export default router;
