import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUserInfo: async (id) => {
    if (!id) return set({ currentUser: null, isLoading: true });

    try {
      const docRef = doc(db, "Users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: true });
      }
    } catch (error) {
      console.log(error);
      set({ currentUser: null, isLoading: true });
    }
  },
  updateCurrentUser: (userData) =>
    set((state) => ({ currentUser: { ...state.currentUser, ...userData } })),
}));
