import type { NextFunction, Request, Response } from "express";
import { sanitizeValue } from "../utils/sanitize.js";

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === "object") {
    const sanitized = sanitizeValue(req.query) as Request["query"];
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, sanitized);
  }

  if (req.params && typeof req.params === "object") {
    const sanitized = sanitizeValue(req.params) as Request["params"];
    for (const key of Object.keys(req.params)) {
      delete req.params[key];
    }
    Object.assign(req.params, sanitized);
  }

  next();
}
