import z from "zod";

export const EducationApplicationSchema = z
  .object({
    completeName: z.string().trim().min(1, "This field is required"),
    email: z.string().trim().email("Enter a valid email address"),
    telegramOrWhatsapp: z.string().trim().min(1, "This field is required"),
    tradingExperience: z.array(z.string()).min(1, "This field is required"),
    programWillingness: z.string().trim().min(1, "This field is required"),
    tradingPlatform: z.string().trim().min(1, "This field is required"),
    toLearn: z.array(z.string()).min(1, "This field is required"),
    toLearnOther: z.string().trim().optional().default(""),
    participation: z.array(z.string()).optional().default([]),
    convenientTime: z.array(z.string()).optional().default([]),
    referredBy: z.string().trim().min(1, "This field is required"),
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

export type EducationApplication = z.infer<typeof EducationApplicationSchema>;

export const TradingToolsApplicationSchema = z.object({
  name: z.string().trim().min(1, "This field is required"),
  email: z.string().trim().email("Enter a valid email address"),
  telegramOrContact: z.string().trim().min(1, "This field is required"),
  whatsapp: z.string().trim().min(1, "This field is required"),
  lookingFor: z.array(z.string()).min(1, "This field is required"),
  howDidYouFindUs: z.string().trim().min(1, "This field is required"),
});

export type TradingToolsApplication = z.infer<typeof TradingToolsApplicationSchema>;

export const ContactSubmissionSchema = z.object({
  name: z.string().trim().min(1, "This field is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "This field is required"),
  message: z.string().trim().min(1, "This field is required"),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export const TRAINING_SETUP_OPTIONS = [
  "Online Class",
  "Face to Face",
  "Both are Good",
] as const;

export const CLASS_SCHEDULE_OPTIONS = [
  "Saturday 1PM GMT+4",
  "Saturday 4PM GMT+4",
  "Sunday 1PM GMT+4",
] as const;

export const LANGUAGE_OPTIONS = ["English", "Other"] as const;

export const LearningPathApplicationSchema = z
  .object({
    name: z.string().trim().min(1, "This field is required"),
    username: z.string().trim().optional().default(""),
    telegram: z.string().trim().min(1, "This field is required"),
    trainingSetup: z.string().min(1, "This field is required"),
    classSchedule: z.string().min(1, "This field is required"),
    language: z.string().min(1, "This field is required"),
    languageOther: z.string().trim().optional().default(""),
    remarks: z.string().trim().optional().default(""),
    merchantOrderId: z.string().trim().optional().default(""),
    paymentAmount: z.string().trim().optional().default(""),
    courseTitle: z.string().trim().optional().default(""),
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

export type LearningPathApplication = z.infer<typeof LearningPathApplicationSchema>;
