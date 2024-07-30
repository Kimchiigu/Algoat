"use client";

import { db } from "@/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Forum } from "@/components/model/forum-model";
import GoBack from "@/components/go-back";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import UserAvatar from "@/components/user-avatar";
import { useForumsAndUsers } from "@/hooks/forums-hooks";

export default function ForumDetail() {
  const params = useParams();
  const { forumId, forumTitle } = params as {
    forumId: string;
    forumTitle: string;
  };
  const [forum, setForum] = useState<Forum | null>(null);
  const { users } = useForumsAndUsers();

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particlesOptions = {
    preset: "stars",
    background: {
      color: {
        value: "#000",
      },
    },
    particles: {
      move: {
        speed: 1,
      },
    },
  };

  if (!forum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />

      <div className="flex flex-col w-full min-h-screen relative">
        <GoBack href="/forum"></GoBack>
        <div className="ml-16 mt-16 mr-16">
          <div className="bg-secondary-background w-full flex flex-col gap-4 py-4 px-8 border rounded-xl">
            <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
            <UserAvatar
              username={users[forum.senderId] || "Unknown"}
              createdAt={forum.createdAt.toLocaleDateString()}
            />
            <p>{forum.contents}</p>
            {forum.file && (
              <div>
                {forum.fileType?.startsWith("image/") && (
                  <div className="w-max h-full justify-start p-6 border-r-8 border-none">
                    <img
                      src={forum.file}
                      className="max-w-96 max-h-96"
                      alt={forum.fileName}
                    />
                  </div>
                )}

                {forum.fileType?.startsWith("video/") && (
                  <div className="w-max h-full justify-start p-6 border-r-8 border-none">
                    <video
                      src={forum.file}
                      className="max-w-96 max-h-96"
                      controls
                    />
                  </div>
                )}

                {forum.fileType?.startsWith("audio/") && (
                  <div className="w-max h-full justify-start">
                    <audio
                      src={forum.file}
                      className="max-w-96 max-h-96"
                      controls
                    />
                  </div>
                )}

                {!forum.fileType?.startsWith("image/") &&
                  !forum.fileType?.startsWith("video/") &&
                  !forum.fileType?.startsWith("audio/") && (
                    <div className="w-max h-full justify-start">
                      <div className="flex flex-col items-center">
                        <span>{forum.fileName}</span>
                        <span>{forum.fileType}</span>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
