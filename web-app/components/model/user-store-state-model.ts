import { User } from "./user-model";

export interface UserStoreState {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (id: string) => Promise<void>;
  updateCurrentUser: (userData: Partial<User>) => void;
}
