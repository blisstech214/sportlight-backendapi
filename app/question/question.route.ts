import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as questionController from "./question.controller";
import * as questionValidator from "./question.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get(
    "/:categoryId/:interviewerId",
    questionController.getAllQuestion
  )
  .get(
    "/:categoryId",
    questionController.getAllQuestionByAdmin
  )
  .get("/:categoryId/:id", questionController.getQuestionById)
  .delete("/:id", questionController.deleteQuestion)
  .post(
    "/:categoryId",
    roleAuth(["ADMIN", "INTERVIEWER", "COMPANY"]),
    questionValidator.createQuestion,
    catchError,
    questionController.createQuestion
  )
  // .put(
  //   "/:id",
  //   questionValidator.updateQuestion,
  //   catchError,
  //   questionController.updateQuestion,
  // )
  .patch(
    "/:categoryId/:id",
    roleAuth(["ADMIN","COMPANY", "INTERVIEWER"]),
    questionValidator.editQuestion,
    catchError,
    questionController.editQuestion
  );

export default router;
