import api from "@/services/api/apiClient";
import type { EventService } from "@/services/interfaces/EventService";
import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateEventRequest,
  EventItem,
  EventQueryParams,
  EventRegistration,
  UpdateEventRequest,
} from "@/types/event";

export const restEventService: EventService = {
  async getAll(params: EventQueryParams) {
    const res = await api.get<PagedResult<EventItem>>("/Event/GetEvents", {
      params: {
        search: params.search,
        upcomingOnly: params.filters?.status === "UPCOMING",
        fromDate: params.filters?.dateFrom,
        toDate: params.filters?.dateTo,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      },
    });
    return { success: true, message: "OK", data: res.data };
  },

  async getById(id) {
    const res = await api.get<EventItem>(`/Event/${id}`);
    return { success: true, message: "OK", data: res.data };
  },

  async create(payload: CreateEventRequest) {
    const res = await api.post<EventItem>("/Event/CreateUpdateEvent", payload);
    return { success: true, message: "Event created", data: res.data };
  },

  async update(id, payload: UpdateEventRequest) {
    const res = await api.post<EventItem>("/Event/CreateUpdateEvent", {
      ...payload,
      eventID: id,
    });
    return { success: true, message: "Event updated", data: res.data };
  },

  async remove(id) {
    await api.post("/Event/DeleteEvent", { eventID: id });
    return { success: true, message: "Event deleted", data: true };
  },

  async getRegistrations(eventId) {
    const res = await api.get<EventRegistration[]>(
      `/Event/${eventId}/Registrations`,
    );
    return { success: true, message: "OK", data: res.data };
  },

  async register(eventId, alumniId) {
    const res = await api.post<EventRegistration>(
      `/Event/${eventId}/Register`,
      { alumniId },
    );
    return { success: true, message: "Registered", data: res.data };
  },

  async cancelRegistration(eventId, alumniId) {
    await api.post(`/Event/${eventId}/CancelRegistration`, { alumniId });
    return { success: true, message: "Cancelled", data: true };
  },
};
