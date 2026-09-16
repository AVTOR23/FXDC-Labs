import { Router } from "express";
import {
  attachMyLearningPath,
  getMyLearningPath,
  submitLearningPath,
} from "../controllers/learningPathApplication.controller.js";
import { formLimiter } from "../middlewares/rateLimiters.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  attachLearningPathPaymentSchema,
  learningPathApplicationSchema,
} from "../validators/learningPathApplication.validator.js";

const router = Router();

router.post(
  "/",
  formLimiter,
  optionalAuth,
  validate(learningPathApplicationSchema),
  submitLearningPath
);

router.get("/me", requireAuth, getMyLearningPath);
router.patch("/me", requireAuth, validate(attachLearningPathPaymentSchema), attachMyLearningPath);

export default router;
