import { body } from "express-validator";

export const createCategory = [
    body("name").isString().withMessage("name must be a string"),
];

export const updateCategory = [];

export const editCategory = [
    body("name").isString().withMessage("name must be a string"),
];
