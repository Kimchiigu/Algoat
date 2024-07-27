import { FileState } from "@/components/model/file-state-model";

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
