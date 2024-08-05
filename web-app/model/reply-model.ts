export interface Reply {
  contents: string;
  createdAt: Date;
  file?: string;
  fileName?: string;
  fileType?: string;
  senderId?: string;
}
