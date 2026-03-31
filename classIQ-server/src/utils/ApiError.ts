export class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number = 500, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}