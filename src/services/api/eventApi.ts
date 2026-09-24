import type { EventService } from "@/services/interfaces/EventService";
import type {
  EventItem,
  CreateEventRequest,
  UpdateEventRequest,
  EventQueryParams,
  EventRegistration,
} from "@/types/event";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import { apiClient } from "./apiClient";

export const restEventService: EventService = {
  async getAll(
    params?: EventQueryParams,
  ): Promise<PaginatedResponse<EventItem>> {
    const res = await apiClient.get("/events", { params });
    return res.data;
  },
  async getById(id: string): Promise<ApiResponse<EventItem>> {
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },
  async create(data: CreateEventRequest): Promise<ApiResponse<EventItem>> {
    const res = await apiClient.post("/events", data);
    return res.data;
  },
  async update(
    id: string,
    data: UpdateEventRequest,
  ): Promise<ApiResponse<EventItem>> {
    const res = await apiClient.put(`/events/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  },
  async register(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<EventRegistration>> {
    const res = await apiClient.post(`/events/${eventId}/register`, {
      alumniId,
    });
    return res.data;
  },
  async cancelRegistration(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<null>> {
    const res = await apiClient.delete(`/events/${eventId}/register`, {
      data: { alumniId },
    });
    return res.data;
  },
  async getRegistrations(
    eventId: string,
  ): Promise<ApiResponse<EventRegistration[]>> {
    const res = await apiClient.get(`/events/${eventId}/registrations`);
    return res.data;
  },
  async getMyRegistrations(
    alumniId: string,
  ): Promise<ApiResponse<EventRegistration[]>> {
    const res = await apiClient.get(`/alumni/${alumniId}/registrations`);
    return res.data;
  },
};
