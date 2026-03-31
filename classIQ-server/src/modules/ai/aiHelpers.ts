import mammoth from "mammoth";
import PDFParser from "pdf2json";

import { ApiError } from "../../utils/ApiError.js";
import { logError } from "../../utils/logger.js";

// Extract text from PDF buffer
export const extractTextFromPDFBuffer = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => {
      const errorMessage =
        err?.parserError?.message || err?.message || "Unknown PDF parsing error";

      logError("PDF parsing error", { error: errorMessage });
      reject(new ApiError(400, "Failed to extract text from PDF file"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        let text = "";

        if (pdfData?.Pages && Array.isArray(pdfData.Pages)) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts && Array.isArray(page.Texts)) {
              page.Texts.forEach((t: any) => {
                if (t.R && Array.isArray(t.R)) {
                  t.R.forEach((r: any) => {
                    if (r.T) {
                      try {
                        text += decodeURIComponent(r.T) + " ";
                      } catch {
                        text += r.T + " ";
                      }
                    }
                  });
                }
              });
            }
            text += "\n";
          });
        }

        resolve(text.replace(/\s+/g, " ").trim());
      } catch (error) {
        reject(new ApiError(400, "Failed to parse PDF content"));
      }
    });

    pdfParser.parseBuffer(buffer);
  });
};

// Extract text from DOC/DOCX
export const extractTextFromDocBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.replace(/\s+/g, " ").trim();
  } catch (error) {
    logError("DOC parsing error", {
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(400, "Failed to extract text from document");
  }
};

// Extract text from supported file buffer
export const extractTextFromFileBuffer = async (
  buffer: Buffer,
  mimetype: string
): Promise<string> => {
  if (!buffer || buffer.length === 0) {
    throw new ApiError(400, "File is empty");
  }

  if (mimetype === "application/pdf") {
    return await extractTextFromPDFBuffer(buffer);
  }

  if (
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocBuffer(buffer);
  }

  throw new ApiError(400, "Unsupported file type. Only PDF/DOC/DOCX allowed.");
};

