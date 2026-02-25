import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// --- Types ---
export type Role = "student" | "teacher";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

// --- Auth APIs ---
export const register = (data: { name: string; email: string; password: string; role: Role }) =>
  API.post<AuthResponse>("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  API.post<AuthResponse>("/auth/login", data);

export const logout = () => API.post<MessageResponse>("/auth/logout");

export const forgotPassword = (data: { email: string }) =>
  API.post<MessageResponse>("/auth/forgot-password", data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  API.post<MessageResponse>("/auth/reset-password", data);

export const getMe = (token: string) =>
  API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });

export const teacherDashboard = (token: string) =>
  API.get<MessageResponse>("/users/teacher-dashboard", { headers: { Authorization: `Bearer ${token}` } });

export const studentDashboard = (token: string) =>
  API.get<MessageResponse>("/users/student-dashboard", { headers: { Authorization: `Bearer ${token}` } });