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

type CreateChatRoomRequest = {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  adultCount: number;
  childCount: number;
  childAges: number[];
};

type CreatedChatRoom = {
  roomId: string;
  name: string;
  itineraryId: string;
  clerkId: string;
  createdAt: string;
  updatedAt: string;
};

export const getChatRooms = (token: string) =>
  apiClient.get<ChatRoomsResponse>(BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createChatRoom = (token: string, body: CreateChatRoomRequest) =>
  apiClient.post<CreatedChatRoom>(BASE, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
