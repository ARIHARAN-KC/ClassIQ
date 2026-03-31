export {};

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: "teacher" | "student" | "admin";
    }

    interface Request {
      user?: UserPayload;
      requestId?: string;
    }
  }
}