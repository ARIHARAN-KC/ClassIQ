import { Readable } from "stream";
import { drive } from "../config/drive.js";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";
import { logError } from "./logger.js";

export interface UploadResult {
  fileId: string;
  fileName: string;
  mimeType: string;
  url: string;
  viewUrl: string;
  isPublic: boolean;
}

export const uploadToDrive = async ( fileBuffer: Buffer, fileName: string, mimeType: string ): Promise<UploadResult> => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ApiError(400, "File buffer is empty");
    }

    if (!fileName?.trim()) {
      throw new ApiError(400, "File name is required");
    }

    if (!mimeType?.trim()) {
      throw new ApiError(400, "MIME type is required");
    }

    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new ApiError(500, "Google Drive folder ID is missing");
    }

    const sanitizedFileName = fileName
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 200);

    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}_${sanitizedFileName}`,
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType,
        body: Readable.from(fileBuffer),
      },
      fields: "id, name, mimeType",
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new ApiError(500, "Google Drive upload failed (no file id)");
    }

    let isPublic = false;

    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      isPublic = true;
    } catch (permError) {
      logError("Drive permission create failed", {
        fileId,
        error: permError instanceof Error ? permError.message : String(permError),
      });
    }

    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const url = `https://drive.google.com/uc?id=${fileId}&export=download`;

    return {
      fileId,
      fileName: response.data.name || sanitizedFileName,
      mimeType: response.data.mimeType || mimeType,
      url,
      viewUrl,
      isPublic,
    };
  } catch (error) {
    logError("Google Drive Upload Error", {
      fileName,
      mimeType,
      error: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof ApiError) throw error;

    throw new ApiError(500, "Failed to upload file to Google Drive");
  }
};

export const deleteFromDrive = async (fileId: string): Promise<boolean> => {
  try {
    if (!fileId?.trim()) throw new ApiError(400, "File ID is required");

    await drive.files.delete({ fileId });

    return true;
  } catch (error) {
    logError("Google Drive Delete Error", {
      fileId,
      error: error instanceof Error ? error.message : String(error),
    });

    return false;
  }
};