"use client";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Forum } from "@/components/model/forum-model";

export default function ForumDetail() {
  const params = useParams();
  const { forumId, forumTitle } = params as {
    forumId: string;
    forumTitle: string;
  }; // Add type assertion
  const [forum, setForum] = useState<Forum | null>(null);

  useEffect(() => {
    if (forumId) {
      const fetchForum = async () => {
        const forumDocRef = doc(db, "Forums", forumId);
        const forumDocSnap = await getDoc(forumDocRef);

        if (forumDocSnap.exists()) {
          const forumData = forumDocSnap.data() as Forum;
          setForum(forumData); // No need for toDate since it's already a Date
        } else {
          // Handle forum not found
          console.error("Forum not found");
        }
      };

      fetchForum();
    }
  }, [forumId]);

  if (!forum) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{forumTitle.replace(/-/g, " ")}</h1>
      <p>{forum.contents}</p>
      {forum.file && (
        <div>
          <h2>Attached File:</h2>
          {forum.fileType?.startsWith("video/") ? (
            <video controls>
              <source src={forum.file} type={forum.fileType} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <a href={forum.file} download={forum.fileName}>
              {forum.fileName}
            </a>
          )}
        </div>
      )}
      {/* Render other forum details */}
    </div>
  );
}
