import { FileState } from "@/components/model/file-state-model";
import { User } from "@/components/model/user-model";
import { db } from "@/firebase";
import upload from "@/lib/upload";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { FileType } from "lucide-react";

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
