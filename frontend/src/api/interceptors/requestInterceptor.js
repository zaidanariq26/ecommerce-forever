import useAuthStore from "../../zustand/authStore";

export const attachToken = (config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
