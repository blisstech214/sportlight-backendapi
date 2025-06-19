import { body } from "express-validator";

export const loginUser = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string"),
];

export const createPassword = [
  body("token")
    .notEmpty()
    .withMessage("token is required")
    .isString()
    .withMessage("token must be a string"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("password must contain at least one number")
    .matches(/[@$!%*?&#]/)
    .withMessage(
      "password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    ),
];

export const changePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("password must contain at least one number")
    .matches(/[@$!%*?&#]/)
    .withMessage(
      "password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    ),
  body("newPassword")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("password must contain at least one number")
    .matches(/[@$!%*?&#]/)
    .withMessage(
      "password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    ),
];

export const resetPassword = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string"),
];
