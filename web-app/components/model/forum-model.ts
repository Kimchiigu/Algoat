export interface Forum {
  contents: string;
  createdAt: Date;
  file?: string;
  fileName?: string;
  fileType?: string;
  replies: any[];
  senderId: string;
  title: string;
}
