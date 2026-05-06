import { apiClient, getApiBaseUrl } from './client';

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

type SendChatMessageRequest = {
  content: string;
};

type ItineraryPlan = {
  plan_name: string;
  time: string;
  place: string;
  note: string;
  status: string;
};

type DoneItinerary = {
  itineraryId: string;
  startDate: string;
  endDate: string;
  dayPlans: Record<string, ItineraryPlan[]>;
  updatedAt: string;
};

type DoneChange = {
  itineraryId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  budget: number;
  adultCount: number;
  childCount: number;
  childAges: number[];
  updatedAt: string;
};

type DoneReservation = {
  reservationId: string;
  type: string;
  status: string;
  bookingUrl: string;
  detail: Record<string, unknown>;
  totalPrice: number;
  currency: string;
  reservedAt: string;
};

type DoneCancel = {
  reservationId: string;
  status: string;
  cancelledAt: string;
};

export type SendChatMessageDone = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  itinerary?: DoneItinerary;
  change?: DoneChange;
  reservation?: DoneReservation;
  cancel?: DoneCancel;
};

export const getChatMessages = (token: string, roomId: string, params?: GetChatMessagesParams) =>
  apiClient.get<ChatMessagesResponse>(`${BASE}/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const sendChatMessage = (token: string, roomId: string, body: SendChatMessageRequest): Promise<Response> =>
  fetch(`${getApiBaseUrl()}${BASE}/${roomId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });
