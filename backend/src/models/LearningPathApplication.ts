import mongoose, { Schema } from "mongoose";
import {
  APPLICATION_STATUSES,
  CLASS_SCHEDULE_ENUM,
  LANGUAGE_OPTIONS,
  ONSITE_CLASS_SCHEDULE_OPTIONS,
  TRAINING_SETUP_OPTIONS,
  type ApplicationStatus,
} from "../constants/options.js";

export interface LearningPathApplicationDocument extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  telegram: string;
  whatsapp: string;
  trainingSetup: string;
  classSchedule: string;
  onsiteClassSchedule: string;
  language: string;
  languageOther: string;
  remarks: string;
  merchantOrderId: string;
  paymentAmount: string;
  courseTitle: string;
  status: ApplicationStatus;
  notes: string;
  isDeleted: boolean;
  submittedIp?: string;
  userAgent?: string;
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathApplicationSchema = new Schema<LearningPathApplicationDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    username: { type: String, default: "", trim: true, lowercase: true, maxlength: 30 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    telegram: { type: String, required: true, trim: true, maxlength: 80 },
    whatsapp: { type: String, default: "", trim: true, maxlength: 40 },
    trainingSetup: { type: String, required: true, enum: TRAINING_SETUP_OPTIONS },
    classSchedule: { type: String, required: true, enum: CLASS_SCHEDULE_ENUM },
    onsiteClassSchedule: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
      enum: ["", ...ONSITE_CLASS_SCHEDULE_OPTIONS],
    },
    language: { type: String, required: true, enum: LANGUAGE_OPTIONS },
    languageOther: { type: String, default: "", trim: true, maxlength: 120 },
    remarks: { type: String, default: "", trim: true, maxlength: 2000 },
    merchantOrderId: { type: String, default: "", trim: true, maxlength: 64, index: true },
    paymentAmount: { type: String, default: "", trim: true, maxlength: 40 },
    courseTitle: { type: String, default: "", trim: true, maxlength: 200 },
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

LearningPathApplicationSchema.index({ createdAt: -1 });
LearningPathApplicationSchema.index({ telegram: 1, createdAt: -1 });
LearningPathApplicationSchema.index({ email: 1, createdAt: -1 });

export const LearningPathApplication = mongoose.model<LearningPathApplicationDocument>(
  "LearningPathApplication",
  LearningPathApplicationSchema
);
