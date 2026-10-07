import type { EventService } from "@/services/interfaces/EventService";
import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateEventRequest,
  EventItem,
  EventQueryParams,
  EventRegistration,
  UpdateEventRequest,
} from "@/types/event";

const store: EventItem[] = [];
const registrations: EventRegistration[] = [];

export const mockEventService: EventService = {
  async getAll(
    params: EventQueryParams,
  ): Promise<ApiResponse<PagedResult<EventItem>>> {
    const start = (params.pageNumber - 1) * params.pageSize;
    const items = store.slice(start, start + params.pageSize);
    return {
      success: true,
      message: "OK",
      data: {
        items,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalRecords: store.length,
        totalPages: Math.ceil(store.length / params.pageSize),
      },
    };
  },

  async getById(id) {
    const item = store.find((e) => e.id === id);
    if (!item) throw new Error("Event not found");
    return { success: true, message: "OK", data: item };
  },

  async create(payload: CreateEventRequest) {
    const item: EventItem = {
      id: String(Date.now()),
      eventId: `EVT-${store.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    store.push(item);
    return { success: true, message: "Event created", data: item };
  },

  async update(id, payload: UpdateEventRequest) {
    const idx = store.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Event not found");
    store[idx] = {
      ...store[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return { success: true, message: "Event updated", data: store[idx] };
  },

  async remove(id) {
    const idx = store.findIndex((e) => e.id === id);
    if (idx !== -1) store.splice(idx, 1);
    return { success: true, message: "Event deleted", data: true };
  },

  async getRegistrations(eventId) {
    return {
      success: true,
      message: "OK",
      data: registrations.filter((r) => r.eventId === eventId),
    };
  },

  async register(eventId, alumniId) {
    const existing = registrations.find(
      (r) => r.eventId === eventId && r.alumniId === alumniId,
    );
    if (existing) {
      existing.status = "REGISTERED";
      return { success: true, message: "Registered", data: existing };
    }
    const reg: EventRegistration = {
      id: String(Date.now()),
      registrationId: `REG-${registrations.length + 1}`,
      eventId,
      alumniId,
      registrationDate: new Date().toISOString(),
      status: "REGISTERED",
    };
    registrations.push(reg);
    return { success: true, message: "Registered", data: reg };
  },

  async cancelRegistration(eventId, alumniId) {
    const reg = registrations.find(
      (r) => r.eventId === eventId && r.alumniId === alumniId,
    );
    if (reg) reg.status = "CANCELLED";
    return { success: true, message: "Cancelled", data: true };
  },
};
