import mongoose, { Schema } from "mongoose";
import {
  APPLICATION_STATUSES,
  CONVENIENT_TIME_OPTIONS,
  LEARN_OPTIONS,
  PARTICIPATION_OPTIONS,
  TRADING_EXPERIENCE_OPTIONS,
  type ApplicationStatus,
} from "../constants/options.js";

export interface EducationApplicationDocument extends mongoose.Document {
  completeName: string;
  email: string;
  telegramOrWhatsapp: string;
  tradingExperience: string[];
  programWillingness: string;
  tradingPlatform: string;
  toLearn: string[];
  toLearnOther: string;
  participation: string[];
  convenientTime: string[];
  referredBy: string;
  status: ApplicationStatus;
  notes: string;
  isDeleted: boolean;
    submittedIp?: string;
    userAgent?: string;
    submittedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

const EducationApplicationSchema = new Schema<EducationApplicationDocument>(
  {
    completeName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    telegramOrWhatsapp: { type: String, required: true, trim: true, maxlength: 80 },
    tradingExperience: {
      type: [String],
      required: true,
      enum: TRADING_EXPERIENCE_OPTIONS,
    },
    programWillingness: { type: String, required: true, trim: true, maxlength: 500 },
    tradingPlatform: { type: String, required: true, trim: true, maxlength: 120 },
    toLearn: { type: [String], required: true, enum: LEARN_OPTIONS },
    toLearnOther: { type: String, default: "", trim: true, maxlength: 200 },
    participation: { type: [String], default: [], enum: PARTICIPATION_OPTIONS },
    convenientTime: { type: [String], default: [], enum: CONVENIENT_TIME_OPTIONS },
    referredBy: { type: String, required: true, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
      index: true,
    },
    notes: { type: String, default: "", trim: true, maxlength: 2000 },
    isDeleted: { type: Boolean, default: false, index: true },
    submittedIp: { type: String, trim: true, maxlength: 64 },
    userAgent: { type: String, trim: true, maxlength: 400 },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

EducationApplicationSchema.index({ email: 1, createdAt: -1 });
EducationApplicationSchema.index({ createdAt: -1 });

export const EducationApplication = mongoose.model<EducationApplicationDocument>(
  "EducationApplication",
  EducationApplicationSchema
);
