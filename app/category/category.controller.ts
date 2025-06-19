import * as categoryService from "./category.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import userSchema from "../user/user.schema";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(
      req.body.name,
      req.params.companyId
    );
    res.send(createResponse(result, "Category created sucssefully"));
  }
);

export const createCategoryByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(
      req.body.name,
      req.user?._id ?? ""
    );
    res.send(createResponse(result, "Category created sucssefully"));
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.send(createResponse(result, "Category updated sucssefully"));
  }
);

export const editCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, id } = req.params;
    const result = await categoryService.editCategory(companyId, id, req.body);
    res.send(createResponse(result, "Category updated sucssefully"));
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    await categoryService.deleteCategory(req.params.id);
    res.send(createResponse("Category deleted sucssefully"));
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, id } = req.params;
    const result = await categoryService.getCategoryById(companyId, id);
    res.send(createResponse(result));
  }
);

export const getAllCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await categoryService.getAllCategory(page, limit, companyId);
    res.send(createResponse(result));
  }
);

export const getAllCategoryByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const admin = await userSchema.findOne({ role: "ADMIN" });
    const result = await categoryService.getAllCategory(
      page,
      limit,
      admin?._id ?? ""
    );
    res.send(createResponse(result));
  }
);
