import { FileState } from "@/components/model/file-state-model";
import { Forum } from "@/components/model/forum-model";
import { User } from "@/components/model/user-model";
import { db } from "@/firebase";
import upload from "@/lib/upload";
import {
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const handleFile = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFile: React.Dispatch<React.SetStateAction<FileState | null>>
) => {
  const fileInput = e.target.files;

  if (fileInput && fileInput.length > 0) {
    const file = fileInput[0];
    setFile({
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    });
  }
};

export const handlePost = async (
  title: string,
  text: string,
  file: FileState | null,
  currentUser: User | null
): Promise<string | void> => {
  if (title === "" && text === "" && (file === null || !file.file)) {
    return Promise.resolve("All fields must be filled");
  }

  if (!currentUser) {
    return Promise.resolve("No user is logged in");
  }

  let fileUrl = null;
  try {
    if (file && file.file) {
      fileUrl = await upload(file.file);
    }

    const forumRef = collection(db, "Forums");
    const newForumRef = doc(forumRef);

    const forumData: any = {
      forumId: newForumRef.id,
      createdAt: new Date(),
      senderId: currentUser.id,
      title: title,
      contents: text,
      replies: [],
    };

    if (fileUrl) {
      forumData.file = fileUrl;
      forumData.fileName = file?.name;
      forumData.fileType = file?.type;
    }

    await setDoc(newForumRef, forumData);

    return Promise.resolve();
  } catch (error) {
    console.error("Failed to post the forum:", error);
    return Promise.resolve("Failed to post the forum");
  }
};

export const sendReply = async (
  forum: Forum | null,
  text: string,
  currentUser: User | null,
  file: FileState | null
) => {
  if (!forum) {
    return Promise.resolve("Forum post is not available");
  }

  if (typeof forum?.forumId === "string") {
    let fileUrl = null;

    const newReply: any = {
      senderId: currentUser?.id,
      createdAt: new Date(),
      contents: text,
    };
    const forumDocRef = doc(db, "Forums", forum.forumId);

    try {
      if (file && file.file) {
        fileUrl = await upload(file.file);
      }

      if (fileUrl) {
        newReply.file = fileUrl;
        newReply.fileName = file?.name;
        newReply.fileType = file?.type;
      }

      await updateDoc(forumDocRef, {
        replies: arrayUnion(newReply),
      });
      return;
    } catch (error) {
      console.error(error);
      return Promise.resolve("Failed to reply");
    }
  } else {
    return Promise.resolve("Forum ID is not available or is not a string");
  }
};
