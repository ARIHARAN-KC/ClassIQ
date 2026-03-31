import User from "../users/userModel.js";
import { RegisterInput } from "./types.js";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const findUserByEmailWithPassword = async (email: string) => {
  return User.findOne({ email }).select("+password");
};

export const createUser = async (data: RegisterInput) => {
  return User.create(data);
};

export const findUserByResetToken = async (hashedToken: string) => {
  return User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password");
};