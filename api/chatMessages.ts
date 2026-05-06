import { apiClient } from './client';

const BASE = '/api/v1/chat-messages';

type ChatMessage = {
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type ChatMessagesResponse = {
  roomId: string;
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
};

type GetChatMessagesParams = {
  cursor?: string;
  limit?: number;
};

export const getChatMessages = (token: string, roomId: string, params?: GetChatMessagesParams) =>
  apiClient.get<ChatMessagesResponse>(`${BASE}/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
