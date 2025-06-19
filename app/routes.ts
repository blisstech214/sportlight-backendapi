import express from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import companyRoutes from "./company/company.route";
import interviewerRoutes from "./interviewer/interviewer.route";
import categoryRoutes from "./category/category.route";
import questionRoutes from "./question/question.route";
import intervieweeRoutes from "./interviewee/interviewee.route";
import feedbackRoutes from "./feedback/feedback.route";
import openAiRoutes from "./openAI/openAI.route";




// routes
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/company", companyRoutes);
router.use("/interviewer", interviewerRoutes);
router.use("/category", categoryRoutes);
router.use("/question", questionRoutes);
router.use("/interviewee",intervieweeRoutes );
router.use("/feedbacks",feedbackRoutes );
router.use("/generate-questions",openAiRoutes );

export default router;
