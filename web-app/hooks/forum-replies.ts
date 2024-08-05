import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { Reply } from "@/model/reply-model";

export const useForumReplies = (forumId: string | undefined) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    if (!forumId) return;

    const forumDocRef = doc(db, "Forums", forumId);
    const unsubscribe = onSnapshot(forumDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const forumData = docSnapshot.data();
        const repliesWithDates = (forumData.replies || []).map(
          (reply: any) => ({
            ...reply,
            createdAt: (reply.createdAt as Timestamp).toDate(),
          })
        );
        setReplies(repliesWithDates);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [forumId]);

  return replies;
};
