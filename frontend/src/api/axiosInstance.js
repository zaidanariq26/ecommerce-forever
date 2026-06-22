import axios from "axios";
import { attachToken } from "./interceptors/requestInterceptor";
import { handleUnauthorized } from "./interceptors/responseInterceptor";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(attachToken);

api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorized(error, api),
);

export default api;
