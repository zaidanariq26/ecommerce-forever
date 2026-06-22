import useAuthStore from "../../zustand/authStore";
import api from "../axiosInstance";

// Flag so that only one refresh process runs at a time
let isRefreshing = false;

// Queue of requests that failed with 401 WHILE a refresh is in progress
let refreshSubscribers = [];

const log = (label, ...args) => {
  console.log(`[Auth Interceptor] ${label}`, ...args);
};

// Notify all queued requests that a new token is ready
const notifySubscribers = (newToken) => {
  log(
    `Refresh complete, resuming ${refreshSubscribers.length} queued request(s)`,
  );
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Hit the refresh-token endpoint, the refreshToken cookie is sent automatically
const requestNewAccessToken = async () => {
  log("Requesting a new access token from /api/user/refresh-token...");

  const response = await api.post("/api/user/refresh-token", {});

  log("New access token received", response.data.accessToken);
  return response.data.accessToken;
};

// Put the failed request in a queue, wait until the refresh finishes
const queueRequest = (originalRequest, api) => {
  log(
    "Another refresh is in progress, queuing this request:",
    originalRequest.url,
  );

  return new Promise((resolve) => {
    refreshSubscribers.push((newToken) => {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      resolve(api(originalRequest));
    });
  });
};

// Refresh token also failed/expired → user must log in again
const forceLogout = (refreshError) => {
  log(
    "Refresh token is invalid/expired, forcing logout",
    refreshError.response?.data,
  );

  isRefreshing = false;
  refreshSubscribers = [];

  useAuthStore.getState().clearAuth();

  // Use a full reload (not navigate) so all state is completely reset
  if (window.location.pathname !== "/login") {
    log("Forcing redirect to /login (full reload)");
    window.location.href = "/login";
  }

  return Promise.reject(refreshError);
};

export const handleUnauthorized = async (error, api) => {
  const originalRequest = error.config;
  const isUnauthorized = error.response?.status === 401;
  const alreadyRetried = originalRequest?._retry;

  // Not a token issue (404, 500, etc.) or this request has already been retried
  // → let the error pass through as-is, don't intervene
  if (!isUnauthorized || alreadyRetried) {
    return Promise.reject(error);
  }

  log("Caught 401 from:", originalRequest.url);
  originalRequest._retry = true; // mark so this same request doesn't retry repeatedly

  // If ANOTHER refresh is already in progress, this request just waits for it
  if (isRefreshing) {
    return queueRequest(originalRequest, api);
  }

  isRefreshing = true;

  try {
    const newToken = await requestNewAccessToken();

    useAuthStore.getState().setAccessToken(newToken);
    notifySubscribers(newToken);

    isRefreshing = false;

    log("Retrying original request with new token:", originalRequest.url);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  } catch (refreshError) {
    return forceLogout(refreshError);
  }
};
