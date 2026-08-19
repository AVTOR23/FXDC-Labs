import mongoose, { Schema } from "mongoose";
import {
  APPLICATION_STATUSES,
  LOOKING_FOR_OPTIONS,
  type ApplicationStatus,
} from "../constants/options.js";

export interface TradingToolsApplicationDocument extends mongoose.Document {
  name: string;
  email: string;
  telegramOrContact: string;
  whatsapp: string;
  lookingFor: string[];
  howDidYouFindUs: string;
  status: ApplicationStatus;
  notes: string;
  isDeleted: boolean;
    submittedIp?: string;
    userAgent?: string;
    submittedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

const TradingToolsApplicationSchema = new Schema<TradingToolsApplicationDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    telegramOrContact: { type: String, required: true, trim: true, maxlength: 80 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 80 },
    lookingFor: { type: [String], required: true, enum: LOOKING_FOR_OPTIONS },
    howDidYouFindUs: { type: String, required: true, trim: true, maxlength: 200 },
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

TradingToolsApplicationSchema.index({ email: 1, createdAt: -1 });
TradingToolsApplicationSchema.index({ createdAt: -1 });

export const TradingToolsApplication = mongoose.model<TradingToolsApplicationDocument>(
  "TradingToolsApplication",
  TradingToolsApplicationSchema
);
