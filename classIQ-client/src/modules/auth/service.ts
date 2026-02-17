import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as repo from "./repository.js";
import { RegisterInput, LoginInput, ResetPasswordInput } from "./types.js";
import { signToken } from "../../config/jwt.js";
import { ApiError } from "../../utils/ApiError.js";

// ================= REGISTER =================

export const register = async (data: RegisterInput) => {
  const existingUser = await repo.findUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await repo.createUser({
    ...data,
    password: hashedPassword,
  });

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};

// ================= LOGIN =================

export const login = async (data: LoginInput) => {
  const user = await repo.findUserByEmail(data.email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};

// ================= FORGOT PASSWORD =================

export const forgotPassword = async (email: string) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  return resetToken;
};

// ================= RESET PASSWORD =================

export const resetPassword = async (data: ResetPasswordInput) => {
  const user = await repo.findUserByResetToken(data.token);

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = await bcrypt.hash(data.newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return true;
};

// ================= LOGOUT =================

export const logout = async () => {
  // JWT in headers, logout is handled client-side.
  return true;
};
