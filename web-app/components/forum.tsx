import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";

interface ForumProps {
  username: string;
  title: string;
  content: string;
  createdAt: string;
  file?: string;
  fileName?: string;
  fileType?: string;
}

export default function Forum({
  username = "",
  title = "",
  content = "",
  createdAt = "",
  file = "",
  fileName = "",
  fileType = "",
}: ForumProps) {
  return (
    <div className="p-8 w-full flex flex-col justify-start items-start">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <UserAvatar username={username} createdAt={createdAt} />
      <p className="mt-4">{content}</p>
      {file && (
        <div className="mt-8">
          {fileType.startsWith("image/") && (
            <div className="w-max h-full justify-start p-6 border-r-8 border-none">
              <img src={file} className="max-w-96 max-h-96" alt={fileName} />
            </div>
          )}

          {fileType.startsWith("video/") && (
            <div className="w-max h-full justify-start p-6 border-r-8 border-none">
              <video src={file} className="max-w-96 max-h-96" controls />
            </div>
          )}

          {fileType.startsWith("audio/") && (
            <div className="w-max h-full justify-start">
              <audio src={file} className="max-w-96 max-h-96" controls />
            </div>
          )}

          {!fileType.startsWith("image/") &&
            !fileType.startsWith("video/") &&
            !fileType.startsWith("audio/") && (
              <div className="w-max h-full justify-start">
                <div className="flex flex-col items-center">
                  <span>{fileName}</span>
                  <span>{fileType}</span>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
