import { z } from "zod";
import {
  CLASS_SCHEDULE_OPTIONS,
  LANGUAGE_OPTIONS,
  ONSITE_CLASS_SCHEDULE_OPTIONS,
  TRAINING_SETUP_OPTIONS,
} from "../constants/options.js";

export const learningPathApplicationSchema = z
  .object({
    name: z.string().trim().min(1, "This field is required").max(120, "Name is too long"),
    username: z.string().trim().toLowerCase().max(30).optional().default(""),
    email: z.string().trim().email("Enter a valid email address").max(254),
    telegram: z.string().trim().min(1, "This field is required").max(80, "Telegram is too long"),
    whatsapp: z.string().trim().min(1, "This field is required").max(40, "WhatsApp is too long"),
    trainingSetup: z.enum(TRAINING_SETUP_OPTIONS, {
      required_error: "This field is required",
    }),
    classSchedule: z.enum(CLASS_SCHEDULE_OPTIONS, {
      required_error: "This field is required",
    }),
    onsiteClassSchedule: z
      .union([z.literal(""), z.enum(ONSITE_CLASS_SCHEDULE_OPTIONS)])
      .optional()
      .default(""),
    language: z.enum(LANGUAGE_OPTIONS, { required_error: "This field is required" }),
    languageOther: z.string().trim().max(120).optional().default(""),
    remarks: z.string().trim().max(2000).optional().default(""),
    merchantOrderId: z.string().trim().max(64).optional().default(""),
    paymentAmount: z.string().trim().max(40).optional().default(""),
    courseTitle: z.string().trim().max(200).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.language === "Other" && !data.languageOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify",
        path: ["languageOther"],
      });
    }
  });

export const attachLearningPathPaymentSchema = z.object({
  merchantOrderId: z.string().trim().min(8).max(64),
  paymentAmount: z.string().trim().max(40).optional().default(""),
  courseTitle: z.string().trim().max(200).optional().default(""),
  applicationId: z.string().trim().max(64).optional().default(""),
});

export type LearningPathApplicationInput = z.infer<typeof learningPathApplicationSchema>;
export type AttachLearningPathPaymentInput = z.infer<typeof attachLearningPathPaymentSchema>;
