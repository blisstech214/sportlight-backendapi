import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  // .get("/", userController.getAllUser)
  // .get("/:id", userController.getUserById)
  // .delete("/:id", userController.deleteUser)
  .post(
    "/",
    roleAuth(["ADMIN", "COMPANY"]),
    userValidator.createUser,
    catchError,
    userController.createUser
  )
  .get(
    "/",
    roleAuth(["ADMIN", "COMPANY", "INTERVIEWER"]),
    userController.getDashboardData
  )
  .post('/sign-up', userValidator.createUser, catchError, userController.signupUser)
  .post('/login', catchError, userController.loginUser)
  .post('/forgot-password', catchError, userController.forgotPassword)
  .post('/reset-password', catchError, userController.resetPassword)
  .post('/payment-status-update', catchError, userController.paymentStatusUpdate)
  .post('/update-profile', catchError, userController.updateProfile);
// .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
// .patch("/:id", userValidator.editUser, catchError, userController.editUser);

export default router;
