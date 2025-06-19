import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import * as companyService from "./company.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";

export const createCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.createCompany(req.body);
    res.send(createResponse(result, "Company created sucssefully"));
  }
);

export const updateCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await companyService.updateCompany(req.params.id, req.body);
    res.send(createResponse(result, "Company updated sucssefully"));
  }
);

export const editCompany = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?._id !== req.params.id && req.user?.role !== "ADMIN") {
    console.log(req.user?._id, req.params.id);
    throw createHttpError(401, {
      message: "You are not authorized to access this resource",
    });
  }
  const result = await companyService.editCompany(req.params.id, req.body);
  res.send(createResponse(result, "Company updated sucssefully"));
});

export const deleteCompany = asyncHandler(
  async (req: Request, res: Response) => {
    await companyService.deleteCompany(req.params.id);
    res.send(createResponse("Company deleted sucssefully"));
  }
);

export const getCompanyById = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user?._id !== req.params.id && req.user?.role !== "ADMIN") {
      throw createHttpError(401, {
        message: "You are not authorized to access this resource",
      });
    }
    const result = await companyService.getCompanyById(req.params.id);
    res.send(createResponse(result));
  }
);

export const getAllCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await companyService.getAllCompany(page, limit);
    res.send(createResponse(result));
  }
);
