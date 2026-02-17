import User from "../users/userModel.js";
import { RegisterInput } from "./types.js";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (data: RegisterInput) => {
  return User.create(data);
};

export const findUserByResetToken = async (token: string) => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });
};
