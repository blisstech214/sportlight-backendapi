import * as userService from "./user.service";
import * as interviewerService from "../interviewer/interviewer.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import mongoose, { Types } from "mongoose";
import { createUserTokens } from "../common/services/passport-jwt.service";
import {
  resetPasswordEmailTemplate,
  sendEmail,
  verifyEmailTemplate,
} from "../common/services/email.service";
import createHttpError from "http-errors";
import userSchema from "./user.schema";
import categorySchema from "../category/category.schema";
import questionSchema from "../question/question.schema";
import interviewerSchema from "../interviewer/interviewer.schema";
import feedbackSchema from "../feedback/feedback.schema";
import bcrypt from "bcrypt";
import moment from "moment";
import crypto from 'crypto'

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, active, role } = req.body;
  let token = "";
  let result;
  if (role === "COMPANY" && req.user?.role === "ADMIN") {
    result = await userService.createUser({
      name,
      email,
      active,
      role,
    });
    const company = await userService.getUserById(result._id);
    const newToken = company && createUserTokens(company);
    token = newToken?.accessToken || "";
  } else if (
    role === "INTERVIEWER" &&
    (req.user?.role === "COMPANY")
  ) {
    result = await userService.createUser({
      name,
      email,
      alias: req.body?.alias,
      active,
      role,
    });
    const interviewer = await userService.getUserById(result._id);
    const newToken = interviewer && createUserTokens(interviewer);
    token = newToken?.accessToken || "";
    let companyId;
    if (req.user?.role === "COMPANY") {
      companyId = req.user?._id;
    }
    await interviewerService.createInterviewer({
      company: new Types.ObjectId(companyId),
      user: new Types.ObjectId(result._id),
      categories: req.body.categories,
    });
  } else {
    throw createHttpError(401, {
      message: "You are unauthorized to create this user",
    });
  }
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Welcome to AI-Interview Platform",
    html: resetPasswordEmailTemplate(token, "create-password"),
  };
  await sendEmail(mailOptions);
  res.send(
    createResponse(
      result,
      `${req.body.role ?? "USER"} created sucssefully. Email sent to ${email} to create password`
    )
  );
});

// export const signupUser = asyncHandler(async (req : Request, res: Response) => {
//     const { name, active, role, email, password } = req.body;
//     let token = "";
//     let result;

//     const checkUser = await userService.getUserByEmail(email);

//     if (checkUser) {
//        res.status(200).json({ message: "User already exists", user: checkUser });
//     }

//     const hashPassword = await bcrypt.hash(password, 12);
//     result = await userService.signupUser({
//       name,
//       email,
//       active,
//       role,
//       password : hashPassword || undefined
//     });
//      const company = await userService.getUserById(result._id);
//      const newToken = company && createUserTokens(company);
//      token = newToken?.accessToken || "";
//      res.send({
//       success : true,
//       message : 'User Created Successfully!',
//       token : token,
//       data : { name : name, email : email, payment : company?.payment_status, userID : company?._id }
//      })
// });

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, active, role, email, password, provider } = req.body;
  let token = "";

  const existingUser = await userService.getUserByEmail(email);

  if (!existingUser) {
    let hashedPassword: string | undefined = undefined;

    // Only hash if it's not Google signup
    if (!provider || provider === "local") {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const result = await userService.signupUser({
      name,
      email,
      active,
      role,
      password: hashedPassword,
      provider
    });

    const company = await userService.getUserById(result._id);
    const newToken = company && createUserTokens(company);
    token = newToken?.accessToken || "";

    //Vefiry Email Send Code Here 

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to AI-Interview Platform",
      html: verifyEmailTemplate("verify-email"),
    };

    let emailRes = await sendEmail(mailOptions);

    if (emailRes.accepted && emailRes.accepted.length > 0 && emailRes.response.startsWith("250")) {
      res.send({
      success: true,
      message: "User Created Successfully!",
      token,
      data: {
        name,
        email,
        payment: company?.payment_status,
        userID: company?._id,
      },
    });
    }
    else {
      res.status(400).send({
      success: false,
      message: "Please verify your email to complete the signup process. If you didn't receive the email, please try again.",
    });
    }    

  }
  else {
    res.status(200).json({
      success: false,
      message: "User already exists",
      user: existingUser,
    });
  }

});

// export const loginUser = asyncHandler(async (req : Request, res: Response) => {

//     const { email, password } = req.body;
//     let token = "";
//     const checkUser = await userService.getUserByEmail(email);

//     if (checkUser) {
//       const checkpassword = await bcrypt.compare(password,checkUser.password)      

//       if (checkpassword) {
//           const company = await userService.getUserById(checkUser._id);
//           const newToken = company && createUserTokens(company);
//           token = newToken?.accessToken || "";
//           res.send({
//             success : true,
//             message : "User Login Successfully!",
//             token : token,
//             data : { name : checkUser.name, email : checkUser.email, payment : checkUser.payment_status, userID : checkUser._id }
//           });
//       }
//       else {
//        res.status(400).send({
//         success : false,
//         message : "Your Password is Wrong!"
//       }) 
//       }
//     }
//     else {
//       res.status(400).send({
//         success : false,
//         message : "User Not Registered!"
//       })
//     }

// });

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, provider } = req.body;
  let token = "";

  const user = await userService.getUserByEmail(email);

  // Check if user exists
  if (user) {
    // Google login - skip password check
    if (provider === "google") {
      const company = await userService.getUserById(user._id);
      const newToken = company && createUserTokens(company);
      token = newToken?.accessToken || "";

      res.send({
        success: true,
        message: "Google Login Successful!",
        token,
        data: {
          name: user.name,
          email: user.email,
          payment: user.payment_status,
          userID: user._id,
          sessionId : user.sessionID
        },
      });
    }

    // Local login - validate password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (passwordValid) {
      const company = await userService.getUserById(user._id);
      const newToken = company && createUserTokens(company);
      token = newToken?.accessToken || "";

      res.send({
        success: true,
        message: "User Login Successfully!",
        token,
        data: {
          name: user.name,
          email: user.email,
          payment: user.payment_status,
          userID: user._id,
          sessionId : user.sessionID
        },
      });

    }
    else {
      res.status(400).send({
        success: false,
        message: "Your Password is Wrong!",
      });
    }

  }
  else {
    res.status(400).send({
      success: false,
      message: "User Not Registered!",
    });
  }
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {

  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");

  const checkUser = await userService.getUserByEmail(email);

  if (checkUser) {

    checkUser.resetToken = token;
    checkUser.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiry

    const result = await userService.updateUser(checkUser._id, checkUser);

    console.log("User updated sucssefully");

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to AI-Interview Platform",
      html: resetPasswordEmailTemplate(token, "reset-password"),
    };

    await sendEmail(mailOptions);
    res.send({
      success: true,
      message: `Password reset email sent successfully on this mail :- ${email}`
    })
  }
  else {
    res.status(400).send({
      success: false,
      message: "User Not Registered!"
    })
  }

});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {

  const { token, newPassword } = req.body;

  const checkUser = await userService.getUserByResetToken(token);

  if (checkUser) {
    const hashPassword = await bcrypt.hash(newPassword, 12);
    checkUser.password = hashPassword;
    checkUser.resetToken = "";
    checkUser.resetTokenExpiration = undefined;

    const result = await userService.updateUser(checkUser._id, checkUser);

    console.log("User Password Update sucssefully");

    res.send({
      success: true,
      message: 'Password updated successfully'
    });

  }
  else {
    res.status(400).send({
      success: false,
      message: "Invalid or expired token!"
    })
  }

});

export const paymentStatusUpdate = asyncHandler(async (req: Request, res: Response) => {

  const { email, payment, session_id } = req.body;

  if (!email || typeof payment !== 'boolean' || !session_id) {
    res.status(400).json({ message: 'Invalid request' });
  }

  const result = await userService.paymentStatusUpdate(email, payment, session_id);

  console.log("Payment Status Updated Successfully!");

  res.send({
    success: true,
    message: "Payment Status Updated Successfully!",
    data: result
  });


});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {

  const { email, name, password } = req.body;

  if (email && name && password) {
    const user = await userService.getUserByEmail(email);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 12)
      user.name = name;
      user.password = hashedPassword

      const result = await userService.updateUser(user._id, user);

      res.send({
        success : true,
        message : "User updated sucssefully",
        data : result
      })

    }
    else {
      res.status(400).send({
        success: false,
        message: "User Not Registered!",
      });
    }
  }
  else {
    res.status(400).json({ success: false, message: "Email Or Name Or Password is required" });
  }




});

export const getDashboardData = asyncHandler(
  async (req: Request, res: Response) => {
    let companyCount = 0,
      interviewerCount = 0,
      categoriesCount = 0,
      questionsCount = 0,
      feedbacksCount = 0,
      chart2Data = [];
    let matchCondition: any = {
      createdAt: {
        $gte: moment().startOf("year").toDate(),
        $lte: moment().endOf("year").toDate(),
      },
    };
    const currentYear = new Date().getFullYear();
    if (req.user?.role === "ADMIN") {
      companyCount = await userSchema.countDocuments({ role: "COMPANY" });
      interviewerCount = await userSchema.countDocuments({
        role: "INTERVIEWER",
      });
      categoriesCount = await categorySchema.countDocuments();
      questionsCount = await questionSchema.countDocuments();
      feedbacksCount = await feedbackSchema.countDocuments();
      const result = await userSchema.aggregate([
        {
          $match: {
            role: "COMPANY",
            createdAt: {
              $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
              $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      chart2Data = Array(12).fill(0);
      result.forEach((item) => {
        chart2Data[item._id - 1] = item.count;
      });
    } else if (req.user?.role === "COMPANY") {
      let companyId;
      if (req.user?.role === "COMPANY") {
        companyId = req.user?._id;
      } else {
        const interviewer = await interviewerSchema.findOne({
          user: req.user?._id,
        });
        companyId = interviewer?.company;
      }
      interviewerCount = await interviewerSchema.countDocuments({
        company: companyId,
      });
      categoriesCount = await categorySchema.countDocuments({
        company: companyId,
      });

      const interviewers = await interviewerSchema.find({
        company: companyId,
      });
      const interviewerUserIds = interviewers.map(
        (interviewer) => interviewer.user
      );

      questionsCount = await questionSchema.countDocuments({
        interviewer: { $in: interviewerUserIds },
      });

      matchCondition.interviewer = {
        $in: interviewerUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      };

      const result = await interviewerSchema.aggregate([
        {
          $match: {
            company: new mongoose.Types.ObjectId(companyId),
            createdAt: {
              $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
              $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      chart2Data = Array(12).fill(0);
      result.forEach((item) => {
        chart2Data[item._id - 1] = item.count;
      });
    } else if (req.user?.role === "INTERVIEWER") {
      const interviewers = await interviewerSchema.findOne({
        user: req.user._id,
      });
      categoriesCount = interviewers?.categories.length ?? 0;
      questionsCount = await questionSchema.countDocuments({
        interviewer: req.user._id,
      });
      feedbacksCount = await feedbackSchema.countDocuments({
        interviewer: req.user._id,
      });

      matchCondition.interviewer = new mongoose.Types.ObjectId(req.user._id);
    }

    const monthlyInterviews = await feedbackSchema.aggregate([
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          attended: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: [
                  "",
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
              in: { $arrayElemAt: ["$$monthsInString", "$_id"] },
            },
          },
          attended: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const completeMonthlyData = allMonths.map((month) => {
      const foundMonth = monthlyInterviews.find((item) => item.month === month);
      return foundMonth || { month, attended: 0 };
    });

    res.send(
      createResponse({
        companyCount,
        employeeCount: interviewerCount,
        categoriesCount,
        questionsCount,
        feedbacksCount,
        monthlyInterviews: completeMonthlyData,
        chart2Data,
      })
    );
  }
);
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.send(createResponse(result));
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  res.send(createResponse(result));
});
