import api from "./axiosInstance";

export const logoutUser = () => api.post("/api/user/logout");
export const loginUser = ({ email, password }) =>
  api.post("/api/user/login", { email, password });
