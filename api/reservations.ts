import { apiClient } from './client';

const BASE = '/api/v1/reservations';

type FlightDetail = {
  airline: string;
  flight_no?: string;
  departure: string;
  arrival: string;
  departing_at: string;
  arriving_at: string;
  stops: number;
};

type AccommodationDetail = {
  name: string;
  rooms: number;
  check_in: string;
  check_out: string;
  guests: number;
};

type ReservationBaseRequest = {
  itineraryId: string;
  bookedBy: 'user' | 'ai';
  bookingUrl?: string;
  externalRefId?: string;
  totalPrice?: number;
  currency?: string;
  reservedAt?: string;
};

type CreateReservationRequest =
  | (ReservationBaseRequest & { type: 'flight'; detail: FlightDetail })
  | (ReservationBaseRequest & { type: 'accommodation'; detail: AccommodationDetail });

type ReservationBase = {
  reservationId: string;
  itineraryId: string;
  status: 'confirmed' | 'changed' | 'cancelled';
  bookedBy: 'user' | 'ai';
  bookingUrl: string | null;
  externalRefId: string | null;
  totalPrice: number | null;
  currency: string | null;
  reservedAt: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Reservation =
  | (ReservationBase & { type: 'flight'; detail: FlightDetail })
  | (ReservationBase & { type: 'accommodation'; detail: AccommodationDetail });

type ReservationsParams = {
  type?: 'flight' | 'accommodation';
  status?: 'confirmed' | 'changed' | 'cancelled';
};

type ReservationsResponse = { reservations: Reservation[] };

type CreateReservationResponse = {
  reservationId: string;
  itineraryId: string;
  type: 'flight' | 'accommodation';
  status: 'confirmed';
  reservedAt: string;
  createdAt: string;
  updatedAt: string;
};

type DeleteReservationResponse = { reservationId: string; deleted: boolean };

type UpdateReservationRequest =
  | { status: 'cancelled'; cancelledAt: string }
  | { status: 'changed'; detail: FlightDetail | AccommodationDetail; reservedAt: string; totalPrice?: number; currency?: string };

type UpdateReservationResponse =
  | { reservationId: string; status: 'cancelled'; cancelledAt: string; updatedAt: string }
  | { reservationId: string; status: 'changed'; reservedAt: string; updatedAt: string };

export const getReservations = (token: string, params?: ReservationsParams) =>
  apiClient.get<ReservationsResponse>(BASE, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createReservation = (token: string, body: CreateReservationRequest) =>
  apiClient.post<CreateReservationResponse>(BASE, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateReservation = (token: string, reservationId: string, body: UpdateReservationRequest) =>
  apiClient.patch<UpdateReservationResponse>(`${BASE}/${reservationId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteReservation = (token: string, reservationId: string) =>
  apiClient.delete<DeleteReservationResponse>(`${BASE}/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
