import { X } from "lucide-react";
import { Button } from "./ui/button";
import { FileState } from "./model/file-state-model";

interface ImagePreviewProps {
  file: FileState;
  setFile: React.Dispatch<React.SetStateAction<FileState | null>>;
}

export default function ImagePreview({ file, setFile }: ImagePreviewProps) {
  return (
    <div className="flex flex-row gap-2">
      <img
        src={file.url}
        alt={file.name}
        className="max-w-48 max-h-48 p-8 bg-secondary-background rounded-2xl mt-8"
      />

      <Button
        variant="destructive"
        className="mt-8 p-2"
        onClick={() => setFile(null)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
