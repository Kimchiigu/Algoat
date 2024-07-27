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
import { ThemeProvider } from "next-themes";
import { Textarea } from "./ui/textarea";
import { LinkIcon } from "lucide-react";
import { handleFile, handlePost } from "@/controller/forum-controller";
import { useState, useRef } from "react";
import { FileState } from "./model/file-state-model";
import { toast } from "@/components/ui/use-toast";
import FilePreview from "./file-preview";
import useUserStore from "@/lib/user-store";
import { Toaster } from "./ui/toaster";

export default function NewForumDialog() {
  const [file, setFile] = useState<FileState | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="absolute top-5 right-5"
            onClick={() => setIsOpen(true)}
          >
            <div className="text-xl font-bold">Start New Discussion</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-10">
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
                className=""
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
                className="resize-none overflow-y-scrolls h-48"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="justify-self-start">
              <Button
                variant="ghost"
                className="w-1/5"
                onClick={handleButtonClick}
              >
                <LinkIcon />
              </Button>
              <Input
                type="file"
                id="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFile(e, setFile)}
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
    </ThemeProvider>
  );
}
