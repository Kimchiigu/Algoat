"use client";

import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import GoBack from "@/components/go-back";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import UserAvatar from "@/components/user-avatar";
import { useForumsAndUsers } from "@/hooks/forums-hooks";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleFile, sendReply } from "@/controller/forum-controller";
import { toast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/user-store";
import { FileState } from "@/model/file-state-model";
import { LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import FilePreview from "@/components/file-preview";
import { useFetchForumDetail } from "@/hooks/forum-detail-hooks";
import { useForumReplies } from "@/hooks/forum-replies";

export default function ForumDetail() {
  const params = useParams();
  const { forumId, forumTitle } = params as {
    forumId: string;
    forumTitle: string;
  };
  const [file, setFile] = useState<FileState | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const { users } = useForumsAndUsers();
  const { currentUser } = useUserStore();
  const [isDragActive, setIsDragActive] = useState(false);

  const forum = useFetchForumDetail(forumId);
  const replies = useForumReplies(forumId);

  const handleSendReply = async () => {
    if (text === "") {
      toast({
        title: "Reply failed",
        description: "Can't send an empty reply",
        duration: 5000,
      });
      return;
    }
    const message = await sendReply(forum, text, currentUser, file);
    if (message) {
      toast({
        title: "Reply failed",
        description: message,
        duration: 5000,
      });
    } else {
      setText("");
      setFile(null);
      toast({
        title: "Reply success",
        description: "Reply posted successfully",
        duration: 5000,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile({
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        });
      }
      setIsDragActive(false);
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDragOver: () => setIsDragActive(true),
  });

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
        <div className="mx-64 mt-16">
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
          <div className="flex flex-row gap-4 mt-8 items-center">
            <Textarea
              className="border rounded-xl border-primary"
              placeholder="Enter reply"
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></Textarea>
            <div
              className="flex flex-row gap-6 px-16 py-8 border-2 border-dashed border-gray-300"
              {...getRootProps()}
            >
              <LinkIcon className="ml-0" />
              <Input
                type="file"
                id="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFile(e, setFile)}
                {...getInputProps()}
              />
            </div>
            <Button onClick={handleSendReply}>Send</Button>
          </div>
          {file && file.url && <FilePreview file={file} setFile={setFile} />}

          {replies.map((reply, index) => (
            <div
              key={index}
              className="mt-8 bg-secondary-background w-full flex flex-col gap-4 py-4 px-8 border rounded-xl"
            >
              <div className="flex flex-col gap-2">
                <UserAvatar
                  username={
                    reply.senderId
                      ? users[reply.senderId] || "Unknown"
                      : "Unknown"
                  }
                  createdAt={reply.createdAt.toLocaleDateString()}
                />
                <p>{reply.contents}</p>
                {reply.file && (
                  <div>
                    {reply.fileType?.startsWith("image/") && (
                      <img
                        src={reply.file}
                        className="max-w-96 max-h-96"
                        alt={reply.fileName}
                      />
                    )}
                    {reply.fileType?.startsWith("video/") && (
                      <video
                        src={reply.file}
                        className="max-w-96 max-h-96"
                        controls
                      />
                    )}
                    {reply.fileType?.startsWith("audio/") && (
                      <audio
                        src={reply.file}
                        className="max-w-96 max-h-96"
                        controls
                      />
                    )}
                    {!reply.fileType?.startsWith("image/") &&
                      !reply.fileType?.startsWith("video/") &&
                      !reply.fileType?.startsWith("audio/") && (
                        <div className="flex flex-col items-center">
                          <span>{reply.fileName}</span>
                          <span>{reply.fileType}</span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="mb-16"></div>
        </div>
      </div>
    </div>
  );
}
