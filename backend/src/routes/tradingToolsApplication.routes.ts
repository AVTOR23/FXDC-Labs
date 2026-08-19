import { Router } from "express";
import { submitTradingToolsApplication } from "../controllers/tradingToolsApplication.controller.js";
import { formLimiter } from "../middlewares/rateLimiters.js";
import { optionalAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { tradingToolsApplicationSchema } from "../validators/tradingToolsApplication.validator.js";

const router = Router();

router.post(
  "/",
  formLimiter,
  optionalAuth,
  validate(tradingToolsApplicationSchema),
  submitTradingToolsApplication
);

export default router;
