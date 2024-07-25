import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const handleLogin = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const handleRegister = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "Users", user.uid), {
        id: user.uid,
        email: user.email,
        username: username,
        inRoom: false,
        inGameRoom: false,
      });
    }
  } catch (error) {
    console.error("Register failed", error);
  }
};

export const handleLogout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Register failed", error);
  }
};
