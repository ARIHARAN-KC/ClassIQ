import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "./env.js";

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const signToken = (payload: { id: string; role: string }) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as {
    id: string;
    role: string;
  };
};
