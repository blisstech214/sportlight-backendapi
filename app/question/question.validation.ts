import { body } from "express-validator";

export const createQuestion = [
  body("questions.*.question")
    .isString()
    .notEmpty()
    .withMessage("Each question must be a non-empty string"),
  body("questions.*.videoUrl")
    .isString()
    .notEmpty()
    .withMessage("Each videoUrl must be a non-empty string"),
];

export const updateQuestion = [];

export const editQuestion = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("videoUrl").isString().notEmpty().withMessage("Video URL is required"),
];
