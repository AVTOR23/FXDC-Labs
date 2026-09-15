import { z } from "zod";
import {
  CLASS_SCHEDULE_OPTIONS,
  LANGUAGE_OPTIONS,
  TRAINING_SETUP_OPTIONS,
} from "../constants/options.js";

export const learningPathApplicationSchema = z
  .object({
    name: z.string().trim().min(1, "This field is required").max(120, "Name is too long"),
    username: z.string().trim().toLowerCase().max(30).optional().default(""),
    telegram: z.string().trim().min(1, "This field is required").max(80, "Telegram is too long"),
    trainingSetup: z.enum(TRAINING_SETUP_OPTIONS, {
      required_error: "This field is required",
    }),
    classSchedule: z.enum(CLASS_SCHEDULE_OPTIONS, {
      required_error: "This field is required",
    }),
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

export type LearningPathApplicationInput = z.infer<typeof learningPathApplicationSchema>;
