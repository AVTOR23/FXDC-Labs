import { Router } from "express";
import { submitLearningPath } from "../controllers/learningPathApplication.controller.js";
import { formLimiter } from "../middlewares/rateLimiters.js";
import { optionalAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { learningPathApplicationSchema } from "../validators/learningPathApplication.validator.js";

const router = Router();

router.post(
  "/",
  formLimiter,
  optionalAuth,
  validate(learningPathApplicationSchema),
  submitLearningPath
);

export default router;
