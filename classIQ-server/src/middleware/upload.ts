import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const MAX_FILE_SIZE = env.MAX_FILE_SIZE_MB * 1024 * 1024;
const allowedMimeTypes = env.ALLOWED_FILE_TYPES;

const checkSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (!buffer || buffer.length < 12) return false;

  const start = buffer.subarray(0, 12);
  const end = buffer.subarray(buffer.length - 2);

  switch (mimeType) {
    case "application/pdf":
      return start.subarray(0, 4).toString() === "%PDF";

    case "image/png":
      return (
        start[0] === 0x89 &&
        start[1] === 0x50 &&
        start[2] === 0x4e &&
        start[3] === 0x47
      );

    case "image/jpeg":
      return (
        start[0] === 0xff &&
        start[1] === 0xd8 &&
        start[2] === 0xff &&
        end[0] === 0xff &&
        end[1] === 0xd9
      );

    case "image/webp":
      return (
        start.subarray(0, 4).toString() === "RIFF" &&
        start.subarray(8, 12).toString() === "WEBP"
      );

    case "application/zip":
    case "application/x-zip-compressed":
      return start[0] === 0x50 && start[1] === 0x4b;

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      // DOCX is a ZIP file with specific structure
      if (start[0] === 0x50 && start[1] === 0x4b) {
        // Check for '[Content_Types].xml' within first 4KB
        const header = buffer.subarray(0, 4096).toString();
        return header.includes("[Content_Types].xml");
      }
      return false;

    case "application/msword":
      return start[0] === 0xd0 && start[1] === 0xcf;

    default:
      return false;
  }
};

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, `Unsupported file format: ${file.mimetype}`));
  }
  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
});

export const validateFileSignature = (req: any, _res: any, next: any) => {
  const files: Express.Multer.File[] = [];

  if (req.file) files.push(req.file);
  if (req.files && Array.isArray(req.files)) files.push(...req.files);

  if (files.length === 0) return next();

  for (const file of files) {
    if (!checkSignature(file.buffer, file.mimetype)) {
      return next(new ApiError(400, `Invalid or corrupted file: ${file.originalname}`));
    }
  }

  next();
};