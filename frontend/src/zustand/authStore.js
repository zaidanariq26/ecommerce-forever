import { create } from "zustand";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from "../api/authApi";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (accessToken) => set({ accessToken }),

  setAuth: ({ user, accessToken }) => {
    set({ user, accessToken, isAuthenticated: true });
  },

  register: async ({ firstName, lastName, email, password }) => {
    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true };
      }

      toast.success(response.data.message);
      return { success: false };
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      const errorType = error.response?.data?.errorType;

      if (errorType === "EMAIL_NOT_VERIFIED") {
        return { success: false, errorType, errorMessage };
      }

      toast.error(errorMessage);
      return { success: false, errorMessage };
    }
  },

  login: async ({ email, password }) => {
    try {
      const response = await loginUser({ email, password });

      if (!response.data.success) {
        toast.error(response.data.message);
        return { success: false };
      }

      const { user, accessToken } = response.data;
      set({ user, accessToken, isAuthenticated: true });

      return { success: true };
    } catch (error) {
      const errorType = error.response?.data?.errorType;
      const message = error.response?.data?.message || error.message;

      if (errorType === "EMAIL_NOT_VERIFIED") {
        return { success: false, errorType, message };
      }

      toast.error(message);
      return { success: false };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await verifyEmail(token);

      if (!response.data.success) {
        toast.error(response.data.message);
        return { success: false };
      }

      const { user, accessToken } = response.data;
      set({ user, accessToken, isAuthenticated: true });

      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  },

  logout: async () => {
    try {
      const response = await logoutUser();

      if (!response.data.success) {
        toast.error(response.data.message);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
