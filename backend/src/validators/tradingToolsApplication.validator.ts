import { z } from "zod";
import { LOOKING_FOR_OPTIONS } from "../constants/options.js";

export const tradingToolsApplicationSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),
  telegramOrContact: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(80, "Contact is too long"),
  whatsapp: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(80, "WhatsApp number is too long"),
  lookingFor: z.array(z.enum(LOOKING_FOR_OPTIONS)).min(1, "This field is required"),
  howDidYouFindUs: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(200, "Response is too long"),
});

export type TradingToolsApplicationInput = z.infer<typeof tradingToolsApplicationSchema>;
