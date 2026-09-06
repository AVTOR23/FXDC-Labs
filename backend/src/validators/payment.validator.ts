import { z } from "zod";
import { COURSE_IDS } from "../constants/courses.js";
import { PAYMENT_REVIEW_STATUSES, PAYMENT_STATUSES } from "../constants/payments.js";

export const createPaymentSchema = z.object({
  courseId: z.enum(COURSE_IDS),
});

export const paymentStatusParamsSchema = z.object({
  merchantOrderId: z.string().trim().min(8).max(64),
});

export const paymentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  status: z.enum(PAYMENT_STATUSES).optional(),
  courseId: z.enum(COURSE_IDS).optional(),
});

export const adminPaymentUpdateSchema = z
  .object({
    notes: z.string().trim().max(2000).optional(),
    reviewStatus: z.enum(PAYMENT_REVIEW_STATUSES).optional(),
  })
  .refine((data) => data.notes !== undefined || data.reviewStatus !== undefined, {
    message: "Provide notes or reviewStatus to update",
  });

export type PaymentStatusParams = z.infer<typeof paymentStatusParamsSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type PaymentListQuery = z.infer<typeof paymentListQuerySchema>;
export type AdminPaymentUpdate = z.infer<typeof adminPaymentUpdateSchema>;
