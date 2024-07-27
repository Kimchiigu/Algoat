import { FileIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { FileState } from "./model/file-state-model";

interface PreviewProps {
  file: FileState;
  setFile: React.Dispatch<React.SetStateAction<FileState | null>>;
}

export default function FilePreview({ file, setFile }: PreviewProps) {
  return (
    <div>
      {file.type.startsWith("image/") && (
        <div className="flex flex-row gap-4">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-64 max-h-64 p-0 bg-secondary-background rounded-2xl mt-8"
          />

          <Button
            variant="destructive"
            className="mt-8 p-2"
            onClick={() => setFile(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {file.type.startsWith("video/") && (
        <div className="flex flex-row gap-4">
          <video
            src={file.url}
            className="max-w-64 max-h-64 p-0 bg-secondary-background rounded-2xl mt-8"
            controls
          ></video>

          <Button
            variant="destructive"
            className="mt-8 p-2"
            onClick={() => setFile(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {file.type.startsWith("audio/") && (
        <div className="flex flex-row gap-4 items-center">
          <audio
            src={file.url}
            className="max-w-96 max-h-48 p-0 bg-secondary-background rounded-2xl mt-8"
            controls
          ></audio>

          <Button
            variant="destructive"
            className="mt-8 p-2"
            onClick={() => setFile(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!file.type.startsWith("image/") &&
        !file.type.startsWith("video/") &&
        !file.type.startsWith("audio/") && (
          <div className="flex flex-row gap-4">
            <div className="w-fit bg-secondary-background p-0 flex flex-col gap-2 rounded-xl">
              <FileIcon></FileIcon>
              <div>{file.name}</div>
              <div>{file.type}</div>
            </div>

            <Button
              variant="destructive"
              className="mt-8 p-2"
              onClick={() => setFile(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
    </div>
  );
}
