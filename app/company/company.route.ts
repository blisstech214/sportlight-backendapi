import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as companyController from "./company.controller";
import * as companyValidator from "./company.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", roleAuth(["ADMIN"]), companyController.getAllCompany)
  .get("/:id", roleAuth(["ADMIN", "COMPANY"]), companyController.getCompanyById)
  .delete("/:id", roleAuth(["ADMIN"]), companyController.deleteCompany)
  // .post(
  //   "/",
  //   companyValidator.createCompany,
  //   catchError,
  //   companyController.createCompany
  // )
  // .put(
  //   "/:id",
  //   companyValidator.updateCompany,
  //   catchError,
  //   companyController.updateCompany
  // )
  .patch(
    "/:id",
    roleAuth(["COMPANY", "ADMIN"]),
    companyValidator.editCompany,
    catchError,
    companyController.editCompany
  );

export default router;
