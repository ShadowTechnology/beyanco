import { User } from './user.model';

export interface ChatHistory {
  id?: number;
  title: string;
  messages: string; // JSON string representing the conversation
  createdAt?: string;
  user?: User;
}
