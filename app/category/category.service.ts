import createHttpError from "http-errors";
import { type ICategory } from "./category.dto";
import CategorySchema from "./category.schema";
import questionSchema from "../question/question.schema";

export const createCategory = async (name: string, companyId: string) => {
  const result = await CategorySchema.create({ name, company: companyId });
  return result;
};

export const updateCategory = async (id: string, data: ICategory) => {
  const result = await CategorySchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editCategory = async (
  companyId: string,
  id: string,
  data: Partial<ICategory>
) => {
  const result = await CategorySchema.findOneAndUpdate(
    { _id: id, company: companyId },
    data,
    {
      new: true,
    }
  );
  return result;
};

export const deleteCategory = async (id: string) => {
  const category = await CategorySchema.findOneAndDelete({ _id: id });
  if (!category) {
    throw createHttpError(404, {
      message: "Category not found",
    });
  }
  await questionSchema.deleteMany({ category: id });
};

export const getCategoryById = async (companyId: string, id: string) => {
  const result = await CategorySchema.findById(id).lean();
  if (companyId !== result?.company.toString()) {
    throw createHttpError(401, {
      message: "Provided company id is not matching with the category",
    });
  }
  return result;
};

export const getAllCategory = async (
  page: number,
  limit: number,
  companyId: string
) => {
  const skip = (page - 1) * limit;
  const categories = await CategorySchema.find({ company: companyId })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalDocs = await CategorySchema.countDocuments({ company: companyId });
  return {
    categories,
    totalDocs,
    currentPage: page,
    totalPages: Math.ceil(totalDocs / limit),
  };
};
