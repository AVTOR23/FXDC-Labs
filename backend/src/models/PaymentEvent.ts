import mongoose, { Schema } from "mongoose";
import { PAYMENT_EVENT_TYPES, type PaymentEventType } from "../constants/payments.js";

export interface PaymentEventDocument extends mongoose.Document {
  paymentId?: mongoose.Types.ObjectId;
  merchantOrderId?: string;
  cipherbcOrderNo?: string;
  eventType: PaymentEventType;
  signatureValid?: boolean;
  sourceIp?: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentEventSchema = new Schema<PaymentEventDocument>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", index: true },
    merchantOrderId: { type: String, trim: true, index: true },
    cipherbcOrderNo: { type: String, trim: true, index: true },
    eventType: { type: String, enum: PAYMENT_EVENT_TYPES, required: true, index: true },
    signatureValid: { type: Boolean },
    sourceIp: { type: String, trim: true, maxlength: 64 },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

PaymentEventSchema.index({ createdAt: -1 });

export const PaymentEvent = mongoose.model<PaymentEventDocument>(
  "PaymentEvent",
  PaymentEventSchema
);
