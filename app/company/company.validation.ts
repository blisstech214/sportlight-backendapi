import { body } from "express-validator";

export const createCompany = [];

export const updateCompany = [];

export const editCompany = [
  body("name").optional().isString().withMessage("name must be a string"),
  body("email").optional().isString().withMessage("email must be a string"),
];
