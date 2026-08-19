import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError.js";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return next(ApiError.badRequest("Validation failed", fieldErrors));
    }

    req[part] = result.data as typeof req[typeof part];
    next();
  };
}
