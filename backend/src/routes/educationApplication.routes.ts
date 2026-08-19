import { Router } from "express";
import { submitEducationApplication } from "../controllers/educationApplication.controller.js";
import { formLimiter } from "../middlewares/rateLimiters.js";
import { optionalAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { educationApplicationSchema } from "../validators/educationApplication.validator.js";

const router = Router();

router.post(
  "/",
  formLimiter,
  optionalAuth,
  validate(educationApplicationSchema),
  submitEducationApplication
);

export default router;
