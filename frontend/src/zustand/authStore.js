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

      if (!response.data.success) {
        toast.error(response.data.message);
        return { success: false };
      }

      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
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

      set({
        user,
        accessToken,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
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
      console.log(error);
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
