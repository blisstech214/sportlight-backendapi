import { body } from "express-validator";

export const createInterviewer = [];

export const updateInterviewer = [];

export const editInterviewer = [
  body("name").optional().isString().withMessage("name must be a string"),
  body("email").optional().isString().withMessage("email must be a string"),
];
