export const queryKeys = {
  itineraries: {
    all: ['itineraries'] as const,
    detail: (itineraryId: string) => ['itineraries', itineraryId] as const,
    logs: (itineraryId: string) => ['itineraries', itineraryId, 'logs'] as const,
  },

  chatRooms: {
    all: ['chatRooms'] as const,
    detail: (roomId: string) => ['chatRooms', roomId] as const,
    messages: (roomId: string) => ['chatRooms', roomId, 'messages'] as const,
  },

  reservations: {
    all: ['reservations'] as const,
  },
} as const;

export const STALE_TIMES = {
  itineraries: {
    all: 1000 * 60 * 10,
    detail: 1000 * 60 * 5,
    logs: 1000 * 60 * 2,
  },

  chatRooms: {
    all: 1000 * 60 * 3,
    detail: 1000 * 60 * 5,
    messages: 1000 * 60 * 3,
  },

  reservations: {
    all: 1000 * 60 * 10,
  },
} as const;

export const GC_TIMES = {
  itineraries: {
    detail: 1000 * 60 * 5,
    logs: 1000 * 60 * 3,
  },

  chatRooms: {
    detail: 1000 * 60 * 5,
    messages: 1000 * 60 * 3,
  },
} as const;
