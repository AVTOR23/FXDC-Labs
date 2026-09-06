import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { formLimiter } from "../middlewares/rateLimiters.js";
import { optionalAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { contactSubmissionSchema } from "../validators/contact.validator.js";

const router = Router();

router.post("/", formLimiter, optionalAuth, validate(contactSubmissionSchema), submitContact);

export default router;
