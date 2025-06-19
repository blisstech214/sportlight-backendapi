import mongoose from "mongoose";
import { type ICompany } from "./company.dto";

const Schema = mongoose.Schema;

const CompanySchema = new Schema<ICompany>({}, { timestamps: true });

export default mongoose.model<ICompany>("company", CompanySchema);
