import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import createHttpError from "http-errors";

export const createUser = async (data: Partial<IUser>) => {
  const user = await UserSchema.findOne({ email: data.email }).select(
    "-password",
  );
  if (user) {
    throw createHttpError(400, {
      message: "Account already exists with this account!",
    });
  }
  const result = await UserSchema.create({ ...data });
  const { password, ...rest } = result.toJSON();
  return rest;
};

export const signupUser = async (data: Partial<IUser>) => {
  const result = await UserSchema.create({ ...data });
  const { password, ...rest } = result.toJSON();
  return rest;
};

export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne({ _id: id });
  return result;
};

export const getUserById = async (id: string) => {
  const result = await UserSchema.findById(id).lean();
  return result;
};

export const paymentStatusUpdate = async (email: string, payment: boolean, session_id: string) => {
  const result = await UserSchema.findOneAndUpdate(
    { email: email }, // filter by email
    { payment_status: payment, sessionID: session_id },
    { new: true }
  ).lean();
  return result;
};

export const getAllUser = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};
export const getUserByEmail = async (email: string) => {
  const result = await UserSchema.findOne({ email }).lean();
  return result;
};
export const getUserByResetToken = async (token :string) => {
  const result = await UserSchema.findOne({ resetToken : token, resetTokenExpiration : { $gt : Date.now() } }).lean();
  return result;
}