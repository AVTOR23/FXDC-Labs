import mongoose, { Schema } from "mongoose";
import {
  PAYMENT_REVIEW_STATUSES,
  PAYMENT_STATUSES,
  type PaymentReviewStatus,
  type PaymentStatus,
} from "../constants/payments.js";
import type { CourseId } from "../constants/courses.js";

export type PaymentAddress = {
  coin: string;
  address: string;
  amount: string;
};

export type PaymentRecord = {
  coin: string;
  address: string;
  txid: string;
  amount: string;
  confirmTime?: number;
  status?: number;
  checkStatus?: number;
  checkCode?: number;
};

export interface PaymentDocument extends mongoose.Document {
  merchantOrderId: string;
  cipherbcOrderNo?: string;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  courseId: CourseId;
  courseTitle: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  cipherbcStatus: number;
  reviewStatus: PaymentReviewStatus;
  checkoutUrl?: string;
  returnUrl?: string;
  successUrl?: string;
  failUrl?: string;
  addresses: PaymentAddress[];
  payments: PaymentRecord[];
  paidAmount?: string;
  notes: string;
  processedCallbackHashes: string[];
  clientIp?: string;
  userAgent?: string;
  expiresAt?: Date;
  completedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentAddressSchema = new Schema<PaymentAddress>(
  {
    coin: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PaymentRecordSchema = new Schema<PaymentRecord>(
  {
    coin: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    txid: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    confirmTime: { type: Number },
    status: { type: Number },
    checkStatus: { type: Number },
    checkCode: { type: Number },
  },
  { _id: false }
);

const PaymentSchema = new Schema<PaymentDocument>(
  {
    merchantOrderId: { type: String, required: true, unique: true, trim: true, index: true },
    cipherbcOrderNo: { type: String, trim: true, index: true, sparse: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    userName: { type: String, required: true, trim: true, maxlength: 120 },
    courseId: { type: String, required: true, trim: true, index: true },
    courseTitle: { type: String, required: true, trim: true, maxlength: 160 },
    amount: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true, default: "usd" },
    status: { type: String, enum: PAYMENT_STATUSES, default: "pending", index: true },
    cipherbcStatus: { type: Number, default: 0 },
    reviewStatus: {
      type: String,
      enum: PAYMENT_REVIEW_STATUSES,
      default: "none",
      index: true,
    },
    checkoutUrl: { type: String, trim: true, maxlength: 1000 },
    returnUrl: { type: String, trim: true, maxlength: 1000 },
    successUrl: { type: String, trim: true, maxlength: 1000 },
    failUrl: { type: String, trim: true, maxlength: 1000 },
    addresses: { type: [PaymentAddressSchema], default: [] },
    payments: { type: [PaymentRecordSchema], default: [] },
    paidAmount: { type: String, trim: true },
    notes: { type: String, default: "", trim: true, maxlength: 2000 },
    processedCallbackHashes: { type: [String], default: [] },
    clientIp: { type: String, trim: true, maxlength: 64 },
    userAgent: { type: String, trim: true, maxlength: 400 },
    expiresAt: { type: Date },
    completedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ userEmail: 1, createdAt: -1 });

export const Payment = mongoose.model<PaymentDocument>("Payment", PaymentSchema);
