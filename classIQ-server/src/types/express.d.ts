import { Request } from "express";
import { IUser } from "../modules/users/userModel.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
