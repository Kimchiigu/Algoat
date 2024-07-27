import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export function useForumsAndUsers() {
  const [forums, setForums] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const forumsRef = collection(db, "Forums");
    const unsubForums = onSnapshot(forumsRef, (snapshot) => {
      const updatedForums = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt
          ? new Date(data.createdAt.seconds * 1000).toLocaleString()
          : "";
        return {
          id: doc.id,
          ...data,
          createdAt,
        };
      });

      updatedForums.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setForums(updatedForums);
    });

    const usersRef = collection(db, "Users");
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const userMap: Record<string, string> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        userMap[data.id] = data.username;
      });
      setUsers(userMap);
    });

    return () => {
      unsubForums();
      unsubUsers();
    };
  }, []);

  return { forums, users };
}
