import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDstmbx-QdIO3mErbctNK6HHZ2qmLC0vMc",
  authDomain: "algoat-2a0db.firebaseapp.com",
  projectId: "algoat-2a0db",
  storageBucket: "algoat-2a0db.appspot.com",
  messagingSenderId: "1007575128005",
  appId: "1:1007575128005:web:f62bf44f12b6ac8bf21dac",
  measurementId: "G-GML2PHGC9G",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
