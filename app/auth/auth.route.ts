import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as authValidator from "./auth.validation";
import * as authController from "./auth.controller";
import passport from "passport";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .post(
    "/",
    passport.authenticate("login", { session: false }),
    authValidator.loginUser,
    catchError,
    authController.loginUser
  )
  .post(
    "/create-password",
    authValidator.createPassword,
    catchError,
    authController.createPassword
  )
  .post(
    "/change-password",
    roleAuth(["ADMIN", "COMPANY", "INTERVIEWER"]),
    authValidator.changePassword,
    catchError,
    authController.changePassword
  )
  .post(
    "/reset-password",
    authValidator.resetPassword,
    catchError,
    authController.resetPassword
  );

export default router;
