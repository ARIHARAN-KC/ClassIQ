import { Request, Response, NextFunction } from "express";
import * as authService from "./service.js";

// ================= REGISTER =================

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// ================= LOGIN =================

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // centralized error handling
  }
};

// ================= FORGOT PASSWORD =================

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const token = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken: token,
    });
  } catch (error) {
    next(error);
  }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.resetPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.logout();

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
