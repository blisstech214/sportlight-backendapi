import createHttpError from "http-errors";
import categorySchema from "../category/category.schema";
import interviewerSchema from "../interviewer/interviewer.schema";
import questionSchema from "../question/question.schema";
import userSchema from "../user/user.schema";
import { type ICompany } from "./company.dto";
import CompanySchema from "./company.schema";

export const createCompany = async (data: ICompany) => {
  const result = await CompanySchema.create({ ...data, active: true });
  return result;
};

export const updateCompany = async (id: string, data: ICompany) => {
  const result = await CompanySchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editCompany = async (id: string, data: Partial<ICompany>) => {
  const result = await userSchema
    .findOneAndUpdate({ _id: id }, data, {
      new: true,
    })
    .select("-password");
  return result;
};

export const deleteCompany = async (companyId: string) => {
  const company = userSchema.findOneAndDelete({ _id: companyId });

  if (!company) {
    throw createHttpError(404, {
      message: "Company not found",
    });
  }

  const interviewers = await interviewerSchema.find({ company: companyId });
  const interviewerIds = interviewers.map((interviewer) => interviewer._id);
  const interviewerUserIds = interviewers.map(
    (interviewer) => interviewer.user
  );

  const allUserIdsToDelete = [...interviewerUserIds];
  await userSchema.deleteMany({ _id: { $in: allUserIdsToDelete } });

  const categories = await categorySchema.find({ company: companyId });
  const categoryIds = categories.map((c) => c._id);

  await interviewerSchema.deleteMany({ company: companyId });
  await categorySchema.deleteMany({ company: companyId });

  await questionSchema.deleteMany({
    $or: [
      { interviewer: { $in: interviewerIds } },
      { category: { $in: categoryIds } },
    ],
  });
  return company;
};

export const getCompanyById = async (id: string) => {
  const result = await userSchema.findById(id).select("-password").lean();
  return result;
};

export const getAllCompany = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const companies = await userSchema
    .find({ role: "COMPANY" })
    .select("-password")
    .skip(skip)
    .limit(limit)
    .lean();
  const totalDocs = await userSchema.countDocuments({ role: "COMPANY" });
  return {
    companies,
    totalDocs,
    currentPage: page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};
