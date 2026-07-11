import { create } from "zustand";

const useAlertStore = create((set) => ({
  alertConfig: null,

  showAlert: (config) => set({ alertConfig: config }),
  closeAlert: () => set({ alertConfig: null }),
}));

export default useAlertStore;
