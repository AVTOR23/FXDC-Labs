import { z } from "zod";
import { APPLICATION_STATUSES } from "../constants/options.js";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
});

export const applicationUpdateSchema = z
  .object({
    status: z.enum(APPLICATION_STATUSES).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .refine((data) => data.status !== undefined || data.notes !== undefined, {
    message: "Provide status or notes to update",
  });

export const idParamsSchema = z.object({
  id: objectIdSchema,
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
export type IdParams = z.infer<typeof idParamsSchema>;
