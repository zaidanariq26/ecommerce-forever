import { create } from "zustand";
import api from "../api/axiosInstance";

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loaded: false,

  fetchWishlist: async () => {
    try {
      const response = await api.get("/api/wishlist/get");
      if (response.data.success) {
        set({ wishlist: response.data.wishlist, loaded: true });
      }
    } catch (error) {
      console.log(error);
      set({ loaded: true });
    }
  },

  toggleWishlist: async (productId) => {
    const { wishlist } = get();
    const isCurrentlyIn = wishlist.includes(productId);

    // Optimistic update
    set({
      wishlist: isCurrentlyIn
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId],
    });

    try {
      const response = await api.post("/api/wishlist/toggle", { productId });
      if (response.data.success) {
        set({ wishlist: response.data.wishlist });
      }
    } catch (error) {
      console.log(error);
      // Revert on failure
      set({
        wishlist: isCurrentlyIn
          ? [...get().wishlist, productId]
          : get().wishlist.filter((id) => id !== productId),
      });
    }
  },

  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },

  resetWishlist: () => {
    set({ wishlist: [], loaded: false });
  },
}));

export default useWishlistStore;
