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

export default function NewForumDialog() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-5 right-5 py-6">
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
                defaultValue=""
                placeholder="Enter the title of the forum"
                className=""
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
              />
            </div>
          </div>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
