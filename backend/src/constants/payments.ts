export const PAYMENT_STATUSES = [
  "pending",
  "completed",
  "abnormal",
  "overpayment",
  "cancelled",
  "failed",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_REVIEW_STATUSES = [
  "none",
  "pending_review",
  "approved",
  "rejected",
] as const;

export type PaymentReviewStatus = (typeof PAYMENT_REVIEW_STATUSES)[number];

export const PAYMENT_EVENT_TYPES = [
  "created",
  "callback_received",
  "status_sync",
  "admin_update",
  "signature_failed",
] as const;

export type PaymentEventType = (typeof PAYMENT_EVENT_TYPES)[number];

export const CIPHERBC_STATUS_MAP: Record<number, PaymentStatus> = {
  0: "pending",
  1: "completed",
  2: "abnormal",
  5: "overpayment",
  10: "cancelled",
};

export const FINAL_PAYMENT_STATUSES: PaymentStatus[] = [
  "completed",
  "abnormal",
  "overpayment",
  "cancelled",
  "failed",
];
