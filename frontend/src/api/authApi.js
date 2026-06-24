import api from "./axiosInstance";

export const logoutUser = () => api.post("/api/user/logout");

export const loginUser = ({ email, password }) =>
  api.post("/api/user/login", { email, password });

export const registerUser = ({ firstName, lastName, email, password }) =>
  api.post("/api/user/register", { firstName, lastName, email, password });

export const verifyEmail = (token) =>
  api.get("/api/user/verify-email", { params: { token } });

export const resendVerifyEmail = (token) =>
  api.post("/api/user/resend-verification-email", { token });

export const forgotPassword = (email) =>
  api.post("/api/user/forgot-password", { email });
