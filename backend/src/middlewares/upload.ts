import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  upload.single("file")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        next(ApiError.badRequest("Image must be 5MB or smaller"));
        return;
      }
      next(ApiError.badRequest("Upload failed"));
      return;
    }

    if (err instanceof Error) {
      next(ApiError.badRequest(err.message));
      return;
    }

    if (!req.file) {
      next(ApiError.badRequest("An image file is required"));
      return;
    }

    next();
  });
}
