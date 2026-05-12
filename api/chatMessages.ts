import { fetch as expoFetch } from 'expo/fetch';
import { apiClient, getApiBaseUrl } from './client';

const BASE = '/api/v1/chat-messages';

export type ChatMessage = {
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  actionResult?: ChatMessageActionResult;
};

export type ChatMessagesResponse = {
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

export type SendChatMessageChunk = {
  content: string;
};

export type ItineraryPlan = {
  index?: number;
  plan_name: string;
  time: string;
  place: string;
  note: string;
  cost?: {
    amount: number;
    currency: string;
    amount_krw: number | null;
  } | null;
  status: string;
};

export type DoneItinerary = {
  itineraryId: string;
  startDate: string;
  endDate: string;
  dayPlans: Record<string, ItineraryPlan[]>;
  updatedAt: string;
};

export type DoneChange = {
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

export type DoneReservation = {
  reservationId: string;
  type: string;
  status: string;
  bookingUrl: string;
  detail: Record<string, unknown>;
  totalPrice: number;
  currency: string;
  reservedAt: string;
};

export type DoneCancel = {
  reservationId: string;
  status: string;
  cancelledAt: string;
};

export type ChatMessageActionResult =
  | { type: 'itinerary'; data: DoneItinerary }
  | { type: 'change'; data: DoneChange }
  | { type: 'reservation'; data: DoneReservation }
  | { type: 'cancel'; data: DoneCancel };

export type SendChatMessageDone = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  itinerary?: DoneItinerary;
  change?: DoneChange;
  reservation?: DoneReservation;
  cancel?: DoneCancel;
};

export type ChatMessageStreamHandlers = {
  onChunk?: (chunk: SendChatMessageChunk) => void;
  onDone?: (done: SendChatMessageDone) => void;
};

export class ChatMessageStreamError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`Chat message stream request failed with status ${status}`);
    this.name = 'ChatMessageStreamError';
    this.status = status;
    this.body = body;
  }
}

export const getChatMessages = (token: string, roomId: string, params?: GetChatMessagesParams) =>
  apiClient.get<ChatMessagesResponse>(`${BASE}/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

const parseSseMessage = (message: string) => {
  const lines = message.split(/\r?\n/);
  let event = 'message';
  const dataLines: string[] = [];
  let hasStartedData = false;

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      hasStartedData = true;
      dataLines.push(line.slice('data:'.length).trimStart());
      continue;
    }

    if (hasStartedData && line.trim()) {
      dataLines.push(line);
    }
  }

  return {
    event,
    data: dataLines.join('\n'),
  };
};

const handleSseMessage = (message: string, handlers: ChatMessageStreamHandlers): boolean => {
  const { event, data } = parseSseMessage(message);
  const normalizedEvent = event.toLowerCase();

  if (!data) {
    return false;
  }

  if (data === '[DONE]') {
    return true;
  }

  if (normalizedEvent === 'chunk') {
    handlers.onChunk?.(JSON.parse(data) as SendChatMessageChunk);
    return false;
  }

  if (normalizedEvent === 'done') {
    handlers.onDone?.(JSON.parse(data) as SendChatMessageDone);
    return true;
  }

  return false;
};

const sendChatMessage = async (
  token: string,
  roomId: string,
  body: SendChatMessageRequest,
): Promise<Response> => {
  const url = `${getApiBaseUrl()}${BASE}/${roomId}`;

  const response = await expoFetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ChatMessageStreamError(response.status, await response.text());
  }

  return response;
};

export const readChatMessageStream = async (response: Response, handlers: ChatMessageStreamHandlers) => {
  if (!response.body) {
    throw new Error('Chat message stream response body is empty');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const decoded = decoder.decode(value, { stream: true });
    buffer += decoded;
    const messages = buffer.split(/\r?\n\r?\n/);
    buffer = messages.pop() ?? '';

    for (const message of messages) {
      const isDone = handleSseMessage(message, handlers);
      if (isDone) {
        return;
      }
    }
  }

  buffer += decoder.decode();

  if (buffer.trim()) {
    handleSseMessage(buffer, handlers);
  }
};

export const sendChatMessageStream = async (
  token: string,
  roomId: string,
  body: SendChatMessageRequest,
  handlers: ChatMessageStreamHandlers,
) => {
  const response = await sendChatMessage(token, roomId, body);
  await readChatMessageStream(response, handlers);
};
