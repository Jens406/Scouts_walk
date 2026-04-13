import { http } from './httpClient';

export interface ChatMessageDTO {
  id: string;
  channelId: string;
  channelType: string;
  userId: string;
  username: string;
  content: string;
  milestoneId?: string;
  communityId?: string;
  createdAt: string;
}

export interface PostMessageData {
  content: string;
  channelType: string;
  milestoneId?: string;
  communityId?: string;
}

export const chatApi = {
  getMessages: (channelId: string) =>
    http.get<ChatMessageDTO[]>(`/api/chat/${channelId}/messages`),
  postMessage: (channelId: string, data: PostMessageData) =>
    http.post<ChatMessageDTO>(`/api/chat/${channelId}/messages`, data),
};
