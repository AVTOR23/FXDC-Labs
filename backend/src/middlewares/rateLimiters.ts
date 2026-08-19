import rateLimit from "express-rate-limit";

const skipSuccessfulHealth = (req: { path?: string }) => req.path === "/api/health";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipSuccessfulHealth,
  message: {
    ok: false,
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    success: false,
    message: "Too many form submissions from this IP. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    success: false,
    message: "Too many uploads. Please try again later.",
  },
});
