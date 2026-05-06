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

export type SendChatMessageChunk = {
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

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice('data:'.length).trimStart());
    }
  }

  return {
    event,
    data: dataLines.join('\n'),
  };
};

const handleSseMessage = (message: string, handlers: ChatMessageStreamHandlers) => {
  const { event, data } = parseSseMessage(message);

  if (!data) {
    return;
  }

  if (event === 'chunk') {
    handlers.onChunk?.(JSON.parse(data) as SendChatMessageChunk);
    return;
  }

  if (event === 'done') {
    handlers.onDone?.(JSON.parse(data) as SendChatMessageDone);
  }
};

const sendChatMessage = async (
  token: string,
  roomId: string,
  body: SendChatMessageRequest,
): Promise<Response> => {
  const response = await fetch(`${getApiBaseUrl()}${BASE}/${roomId}`, {
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

    buffer += decoder.decode(value, { stream: true });
    const messages = buffer.split(/\r?\n\r?\n/);
    buffer = messages.pop() ?? '';

    for (const message of messages) {
      handleSseMessage(message, handlers);
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
