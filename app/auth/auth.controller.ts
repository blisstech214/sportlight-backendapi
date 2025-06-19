import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "../user/user.service";
import { createResponse } from "../common/helper/response.hepler";
import {
  createUserTokens,
  decodeToken,
} from "../common/services/passport-jwt.service";
import interviewerSchema from "../interviewer/interviewer.schema";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {
  resetPasswordEmailTemplate,
  sendEmail,
} from "../common/services/email.service";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  let company = null;
  let categories = null;
  if (req.user?.role === "INTERVIEWER") {
    const companyData = await interviewerSchema
      .findOne({ user: req.user._id })
      .populate({ path: "company", select: "_id name email" });
    company = companyData?.company;
    categories = companyData?.categories;
  }
  res.send(
    createResponse(
      { ...createUserTokens(req.user!), user: req.user, company, categories },
      "Logged in sucssefully"
    )
  );
});

export const createPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const user = decodeToken(req.body.token);
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await userService.editUser(user._id, {
      password: hashedPassword,
    });
    res.send(createResponse("Password updated sucssefully! Please login"));
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userService.getUserById(req.user?._id || "");
    if (!user) {
      throw createHttpError(401, {
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, {
        message: "Old password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userService.editUser(user._id, {
      password: hashedPassword,
    });
    res.send(createResponse("Password updated sucssefully! Please login"));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw createHttpError(401, {
        message: "User not found",
      });
    }
    const newToken = createUserTokens(user);
    const token = newToken?.accessToken || "";
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to AI-Interview Platform",
      html: resetPasswordEmailTemplate(token, "reset-password"),
    };
    await sendEmail(mailOptions);
    res.send(createResponse(`Email sent to ${email} to reset password`));
  }
);
