import mongoose, { Schema } from "mongoose";

export interface MediaDocument extends mongoose.Document {
  publicId: string;
  url: string;
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
  originalName: string;
  folder: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    publicId: { type: String, required: true, unique: true, trim: true },
    url: { type: String, required: true, trim: true },
    format: { type: String, trim: true, maxlength: 20 },
    bytes: { type: Number, required: true, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    originalName: { type: String, required: true, trim: true, maxlength: 200 },
    folder: { type: String, required: true, trim: true, maxlength: 80 },
    uploadedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

export const Media = mongoose.model<MediaDocument>("Media", MediaSchema);
