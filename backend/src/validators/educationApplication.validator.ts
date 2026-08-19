import { z } from "zod";
import {
  CONVENIENT_TIME_OPTIONS,
  LEARN_OPTIONS,
  PARTICIPATION_OPTIONS,
  TRADING_EXPERIENCE_OPTIONS,
} from "../constants/options.js";

export const educationApplicationSchema = z
  .object({
    completeName: z
      .string()
      .trim()
      .min(1, "This field is required")
      .max(120, "Name is too long"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address")
      .max(254),
    telegramOrWhatsapp: z
      .string()
      .trim()
      .min(1, "This field is required")
      .max(80, "Contact is too long"),
    tradingExperience: z
      .array(z.enum(TRADING_EXPERIENCE_OPTIONS))
      .min(1, "This field is required"),
    programWillingness: z
      .string()
      .trim()
      .min(1, "This field is required")
      .max(500, "Response is too long"),
    tradingPlatform: z
      .string()
      .trim()
      .min(1, "This field is required")
      .max(120, "Platform name is too long"),
    toLearn: z.array(z.enum(LEARN_OPTIONS)).min(1, "This field is required"),
    toLearnOther: z.string().trim().max(200).optional().default(""),
    participation: z
      .array(z.enum(PARTICIPATION_OPTIONS))
      .optional()
      .default([]),
    convenientTime: z
      .array(z.enum(CONVENIENT_TIME_OPTIONS))
      .optional()
      .default([]),
    referredBy: z
      .string()
      .trim()
      .min(1, "This field is required")
      .max(120, "Referral is too long"),
  })
  .superRefine((data, ctx) => {
    if (data.toLearn.includes("Other") && !data.toLearnOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify",
        path: ["toLearnOther"],
      });
    }
  });

export type EducationApplicationInput = z.infer<typeof educationApplicationSchema>;
