import { Request, Response } from "express";
import * as authService from "./service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendEmail } from "../../utils/mail.js";
import { env } from "../../config/env.js";
import { logSecurityEvent, logError } from "../../utils/logger.js";
import { asyncHandler } from "../../middleware/error.js";

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  logSecurityEvent("USER_REGISTERED", result.user.id, "Registration successful");

  res.status(201).json(new ApiResponse(201, "Registration successful", result));
});

// LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  logSecurityEvent("USER_LOGIN", result.user.id, `Login from ${req.ip}`);

  res.status(200).json(new ApiResponse(200, "Login successful", result));
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const resetToken = await authService.forgotPassword(email);

  if (resetToken) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "ClassIQ Password Reset",
        html: message,
      });

      logSecurityEvent(
        "PASSWORD_RESET_REQUESTED",
        email,
        "Password reset email sent"
      );
    } catch (emailError) {
      logError("Failed to send password reset email", {
        email,
        error: emailError instanceof Error ? emailError.message : String(emailError),
      });
    }
  } else {
    logSecurityEvent(
      "PASSWORD_RESET_ATTEMPT",
      email,
      "Password reset attempted for non-existent user"
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      "If an account exists with this email, a reset link has been sent.",
      null
    )
  );
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);

  logSecurityEvent(
    "PASSWORD_RESET_SUCCESS",
    req.body.email || "unknown",
    "Password reset successful"
  );

  res.status(200).json(new ApiResponse(200, "Password reset successful", null));
});

// LOGOUT
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  await authService.logout();
  res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
});