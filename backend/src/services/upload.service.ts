import { Readable } from "node:stream";
import { env } from "../config/env.js";
import { cloudinary } from "../config/cloudinary.js";
import { Media } from "../models/Media.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationMeta, toClient } from "../utils/serialize.js";
import type { PaginationQuery } from "../validators/common.validator.js";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
};

export async function uploadImageToCloudinary(
  file: Express.Multer.File,
  uploadedBy?: string
) {
  const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: "image",
        overwrite: false,
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(uploaded as CloudinaryUploadResult);
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });

  const media = await Media.create({
    publicId: result.public_id,
    url: result.secure_url,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    originalName: file.originalname,
    folder: env.CLOUDINARY_FOLDER,
    uploadedBy,
  });

  return toClient(media.toObject() as unknown as Record<string, unknown>);
}

export async function listMedia(query: PaginationQuery) {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ originalName: pattern }, { publicId: pattern }];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    Media.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toClient(item as Record<string, unknown>)),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function deleteMedia(id: string) {
  const media = await Media.findById(id);
  if (!media) {
    throw ApiError.notFound("Media not found");
  }

  await cloudinary.uploader.destroy(media.publicId, { resource_type: "image" });
  await media.deleteOne();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
