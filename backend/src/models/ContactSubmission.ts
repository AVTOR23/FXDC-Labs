import mongoose, { Schema } from "mongoose";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../constants/options.js";

export interface ContactSubmissionDocument extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ApplicationStatus;
  notes: string;
  isDeleted: boolean;
  submittedIp?: string;
  userAgent?: string;
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<ContactSubmissionDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
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

ContactSubmissionSchema.index({ email: 1, createdAt: -1 });
ContactSubmissionSchema.index({ createdAt: -1 });

export const ContactSubmission = mongoose.model<ContactSubmissionDocument>(
  "ContactSubmission",
  ContactSubmissionSchema
);
