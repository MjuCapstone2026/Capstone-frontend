import { apiClient } from './client';

const BASE = '/api/v1/chat-rooms';

type ChatRoomPreferences = {
  budget: string;
  style: string;
};

type ChatRoom = {
  roomId: string;
  name: string;
  clerkId: string;
  aiSummary: string | null;
  preferences: ChatRoomPreferences | null;
  createdAt: string;
  updatedAt: string;
};

type ChatRoomsResponse = {
  rooms: ChatRoom[];
};

export const getChatRooms = (token: string) =>
  apiClient.get<ChatRoomsResponse>(BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
