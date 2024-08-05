export interface User {
  id: string;
  email: string;
  username: string;
  inRoom: boolean;
  inGameRoom: boolean;
  [key: string]: any;
}
