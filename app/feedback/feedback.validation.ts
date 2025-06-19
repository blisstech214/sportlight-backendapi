import { body } from "express-validator";


export const createFeedback = [

  body("overallFeedback")
    .optional()
    .isString()
    .withMessage("Overall feedback must be a string"),
  
    body("rating")
    .optional()
    .isNumeric() 
    .withMessage("Rating must be a number")
];

export const createFeedbackAdmin= [

  body("overallFeedback")
    .optional()
    .isString()
    .withMessage("Overall feedback must be a string"),
  
  body("rating")
    .optional()
    .isInt()
    .withMessage("Rating must be an integer"),
  
 
];
