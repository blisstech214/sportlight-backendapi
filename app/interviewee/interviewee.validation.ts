import { body } from "express-validator";

export const createInterviewee = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be text")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),


  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),
];
