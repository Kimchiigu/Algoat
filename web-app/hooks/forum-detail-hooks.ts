import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Forum } from "@/model/forum-model";

export const useFetchForumDetail = (forumId: string | undefined) => {
  const [forum, setForum] = useState<Forum | null>(null);

  useEffect(() => {
    if (forumId) {
      const fetchForum = async () => {
        const forumDocRef = doc(db, "Forums", forumId);
        const forumDocSnap = await getDoc(forumDocRef);

        if (forumDocSnap.exists()) {
          const forumData = forumDocSnap.data() as Forum;
          forumData.createdAt = (
            forumData.createdAt as unknown as Timestamp
          ).toDate();
          setForum(forumData);
        } else {
          console.error("Forum not found");
        }
      };

      fetchForum();
    }
  }, [forumId]);

  return forum;
};
