import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  alias?: string;
  active?: boolean;
  payment_status: boolean;
  role: "ADMIN" | "COMPANY" | "INTERVIEWER" | "USER";
  provider: string;
  password: string;
  resetToken?:string;
  sessionID?:string;
  resetTokenExpiration?:Date
}
