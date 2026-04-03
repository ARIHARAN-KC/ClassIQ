import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";
import { logError, logInfo } from "./logger.js";

let transporter: nodemailer.Transporter | null = null;

const createTransporter = () => {
  if (!env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 50,
  });
};

export const verifyEmailConfig = async () => {
  try {
    transporter = createTransporter();

    if (!transporter) {
      console.warn("Email service not configured. Skipping verification.");
      return;
    }

    await transporter.verify();
    logInfo("Email service verified successfully");
  } catch (error) {
    logError("Email verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (!transporter) {
      transporter = createTransporter();
    }

    if (!transporter) {
      throw new ApiError(500, "Email service not configured. Please check EMAIL_USER and EMAIL_PASSWORD.");
    }

    await transporter.sendMail({
      from: `"ClassIQ Support" <${env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
      replyTo: options.replyTo || env.EMAIL_USER,
    });
  } catch (error) {
    logError("Email Send Error", {
      to: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiError(500, "Failed to send email");
  }
};