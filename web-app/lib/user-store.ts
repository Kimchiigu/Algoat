import { UserStoreState } from "@/components/model/user-store-state-model";
import { User } from "@/components/model/user-model";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

const useUserStore = create<UserStoreState>((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUserInfo: async (id: string) => {
    if (!id) return set({ currentUser: null, isLoading: true });

    try {
      const docRef = doc(db, "Users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data() as User, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: true });
      }
    } catch (error) {
      console.log(error);
      set({ currentUser: null, isLoading: true });
    }
  },
  updateCurrentUser: (userData: Partial<User>) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...userData } as User,
    })),
}));

export default useUserStore;
