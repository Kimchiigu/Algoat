import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { LinkIcon } from "lucide-react";
import { handleFile, handlePost } from "@/controller/forum-controller";
import { useState, useRef } from "react";
import { FileState } from "./model/file-state-model";
import { toast } from "@/components/ui/use-toast";
import FilePreview from "./file-preview";
import useUserStore from "@/lib/user-store";

export default function NewForumDialog() {
  const [file, setFile] = useState<FileState | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { currentUser } = useUserStore();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePostClick = async () => {
    const message = await handlePost(title, text, file, currentUser);
    if (message) {
      toast({
        title: "Post failed",
        description: message,
      });
    } else {
      setTitle("");
      setText("");
      setFile(null);
      setIsOpen(false);
      toast({
        title: "Post success",
        description: "Forum posted successfully",
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="absolute top-5 right-5"
          onClick={() => setIsOpen(true)}
        >
          <div className="text-xl font-bold">Start New Discussion</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle>Create New Discussion</DialogTitle>
          <DialogDescription>
            Enter the details for your new discussion. Click post when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-center gap-6">
            <Label htmlFor="title" className="text-right w-1/5">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter the title of the forum"
              className="border-primary"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-center gap-6">
            <Label htmlFor="content" className="text-right w-1/5">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Enter the content of the forum"
              className="resize-none overflow-y-scrolls h-48 border-primary"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div
            className="flex flex-row items-center gap-6 p-4 border-2 border-dashed border-gray-300"
            {...getRootProps()}
          >
            <LinkIcon className="ml-4" />
            <Input
              type="file"
              id="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFile(e, setFile)}
              {...getInputProps()}
            />
          </div>
        </div>
        {file && file.url && <FilePreview file={file} setFile={setFile} />}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handlePostClick}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
