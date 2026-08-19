import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  me,
  register,
  updateMe,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, validate(updateProfileSchema), updateMe);
router.patch("/password", requireAuth, validate(changePasswordSchema), changePassword);

export default router;
