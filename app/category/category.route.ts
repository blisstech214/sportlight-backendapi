import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as categoryController from "./category.controller";
import * as categoryValidator from "./category.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get(
    "/:companyId",
    categoryController.getAllCategory
  )
  .get(
    "/",
    categoryController.getAllCategoryByAdmin
  )
  .get(
    "/:companyId/:id",
    roleAuth(["ADMIN", "COMPANY"]),
    categoryController.getCategoryById
  )
  .delete(
    "/:id",
    roleAuth(["ADMIN", "COMPANY"]),
    categoryController.deleteCategory
  )
  .post(
    "/:companyId",
    roleAuth(["COMPANY"]),
    categoryValidator.createCategory,
    catchError,
    categoryController.createCategory
  )
  .post(
    "/",
    roleAuth(["ADMIN"]),
    categoryValidator.createCategory,
    catchError,
    categoryController.createCategoryByAdmin
  )
  // .put(
  //   "/:id",
  //   categoryValidator.updateCategory,
  //   catchError,
  //   categoryController.updateCategory,
  // )
  
  .patch(
    "/:companyId/:id",
    roleAuth(["COMPANY"]),
    categoryValidator.editCategory,
    catchError,
    categoryController.editCategory
  );

export default router;
