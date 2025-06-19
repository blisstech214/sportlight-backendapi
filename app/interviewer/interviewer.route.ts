import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as interviewerController from "./interviewer.controller";
import * as interviewerValidator from "./interviewer.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get(
    "/:companyId",
    roleAuth(["ADMIN", "COMPANY"]),
    interviewerController.getAllInterviewer
  )
  .get(
    "/get-cat/:categoryId",
    interviewerController.getInterviewerCategory
  )
  .get(
    "/:companyId/:id",
    roleAuth(["ADMIN", "COMPANY", "INTERVIEWER"]),
    interviewerController.getInterviewerById
  )
  .delete(
    "/:id",
    roleAuth(["ADMIN", "COMPANY"]),
    interviewerController.deleteInterviewer
  )
  // .post(
  //   "/",
  //   interviewerValidator.createInterviewer,
  //   catchError,
  //   interviewerController.createInterviewer,
  // )
  // .put(
  //   "/:id",
  //   interviewerValidator.updateInterviewer,
  //   catchError,
  //   interviewerController.updateInterviewer,
  // )
  .patch(
    "/:id",
    roleAuth(["COMPANY", "INTERVIEWER"]),
    interviewerValidator.editInterviewer,
    catchError,
    interviewerController.editInterviewer
  );

export default router;
