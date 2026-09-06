import { z } from "zod";

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),
  phone: z.string().trim().min(1, "This field is required").max(40, "Phone is too long"),
  message: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(2000, "Message is too long"),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
