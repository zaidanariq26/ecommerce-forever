import { create } from "zustand";

const getInitialDark = () => {
  try {
    const saved = localStorage.getItem("adminDarkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

export const applyDarkClass = (dark) => {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const useThemeStore = create((set) => ({
  dark: getInitialDark(),
  toggle: () =>
    set((state) => {
      const next = !state.dark;
      try {
        localStorage.setItem("adminDarkMode", String(next));
      } catch {
        /* storage full or blocked — still toggle visually */
      }
      return { dark: next };
    }),
}));

applyDarkClass(useThemeStore.getState().dark);

export default useThemeStore;
