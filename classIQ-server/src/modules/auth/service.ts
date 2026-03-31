import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as repo from "./repository.js";
import {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from "./types.js";
import { signToken } from "../../config/jwt.js";
import { ApiError } from "../../utils/ApiError.js";
import { ROLES } from "../../constants/roles.js";
import { env } from "../../config/env.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (data: RegisterInput) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    throw new ApiError(400, "Name must be between 2 and 50 characters");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!Object.values(ROLES).includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  if (role === ROLES.ADMIN) {
    throw new ApiError(403, "Admin registration is not allowed");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const emailClean = email.toLowerCase().trim();
  const existingUser = await repo.findUserByEmail(emailClean);

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const rounds = Number(env.BCRYPT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, rounds);

  const user = await repo.createUser({
    name: name.trim(),
    email: emailClean,
    password: hashedPassword,
    role,
  });

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const login = async (data: LoginInput) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const emailClean = email.toLowerCase().trim();
  const user = await repo.findUserByEmailWithPassword(emailClean);

  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const forgotPassword = async (email: string) => {
  if (!email) throw new ApiError(400, "Email is required");

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const emailClean = email.toLowerCase().trim();
  const user = await repo.findUserByEmail(emailClean);

  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return resetToken;
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const { token, newPassword } = data;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await repo.findUserByResetToken(hashedToken);

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  const rounds = Number(env.BCRYPT_ROUNDS || 10);
  user.password = await bcrypt.hash(newPassword, rounds);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return true;
};

export const logout = async () => {
  return true;
};