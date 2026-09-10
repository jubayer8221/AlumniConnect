import type { EventService } from "@/services/interfaces/EventService";
import type { EventItem, CreateEventRequest, UpdateEventRequest, EventQueryParams, EventRegistration, EventFilters } from "@/types/event";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";
import { seedEvents, seedRegistrations } from "@/data/seedData";
import { generateEventId, generateRegistrationId, generateUUID } from "@/utils/generateId";

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureEvents(): EventItem[] {
  let events = localStorageService.get<EventItem[]>(STORAGE_KEYS.EVENTS, []);
  if (events.length === 0) {
    events = [...seedEvents];
    localStorageService.set(STORAGE_KEYS.EVENTS, events);
  }
  return events;
}

function saveEvents(events: EventItem[]): void {
  localStorageService.set(STORAGE_KEYS.EVENTS, events);
}

function ensureRegistrations(): EventRegistration[] {
  let regs = localStorageService.get<EventRegistration[]>(STORAGE_KEYS.EVENT_REGISTRATIONS, []);
  if (regs.length === 0) {
    regs = [...seedRegistrations];
    localStorageService.set(STORAGE_KEYS.EVENT_REGISTRATIONS, regs);
  }
  return regs;
}

function saveRegistrations(regs: EventRegistration[]): void {
  localStorageService.set(STORAGE_KEYS.EVENT_REGISTRATIONS, regs);
}

function matchesEventFilters(event: EventItem, filters?: EventFilters, search?: string): boolean {
  if (search) {
    const q = search.toLowerCase();
    if (!event.title.toLowerCase().includes(q) && !event.description.toLowerCase().includes(q) && !event.location.toLowerCase().includes(q)) return false;
  }
  if (filters) {
    if (filters.eventType && event.eventType !== filters.eventType) return false;
    if (filters.status && event.status !== filters.status) return false;
  }
  return true;
}

export const mockEventService: EventService = {
  async getAll(params?: EventQueryParams): Promise<PaginatedResponse<EventItem>> {
    await delay();
    const all = ensureEvents();
    const filtered = all.filter((e) => matchesEventFilters(e, params?.filters, params?.search));
    const page = params?.pageNumber || 1;
    const size = params?.pageSize || 10;
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);
    return {
      success: true,
      message: "Events retrieved successfully",
      data: { items, totalCount: filtered.length, pageNumber: page, pageSize: size },
    };
  },

  async getById(id: string): Promise<ApiResponse<EventItem>> {
    await delay();
    const all = ensureEvents();
    const found = all.find((e) => e.id === id || e.eventId === id);
    if (!found) return { success: false, message: "Event not found", data: null as unknown as EventItem };
    return { success: true, message: "Event retrieved", data: found };
  },

  async create(data: CreateEventRequest): Promise<ApiResponse<EventItem>> {
    await delay();
    const all = ensureEvents();
    const existingIds = all.map((e) => e.eventId);
    const now = new Date().toISOString();
    const newEvent: EventItem = {
      id: generateUUID(),
      eventId: generateEventId(existingIds),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    all.push(newEvent);
    saveEvents(all);
    return { success: true, message: "Event created successfully", data: newEvent };
  },

  async update(id: string, data: UpdateEventRequest): Promise<ApiResponse<EventItem>> {
    await delay();
    const all = ensureEvents();
    const idx = all.findIndex((e) => e.id === id || e.eventId === id);
    if (idx === -1) return { success: false, message: "Event not found", data: null as unknown as EventItem };
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() } as EventItem;
    saveEvents(all);
    return { success: true, message: "Event updated successfully", data: all[idx] };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    await delay();
    const all = ensureEvents();
    const filtered = all.filter((e) => e.id !== id && e.eventId !== id);
    if (filtered.length === all.length) return { success: false, message: "Event not found", data: null };
    saveEvents(filtered);
    return { success: true, message: "Event deleted successfully", data: null };
  },

  async register(eventId: string, alumniId: string): Promise<ApiResponse<EventRegistration>> {
    await delay();
    const events = ensureEvents();
    const event = events.find((e) => e.id === eventId || e.eventId === eventId);
    if (!event) return { success: false, message: "Event not found", data: null as unknown as EventRegistration };
    const regs = ensureRegistrations();
    const existing = regs.find((r) => r.eventId === event.id && r.alumniId === alumniId && r.status === "REGISTERED");
    if (existing) return { success: false, message: "Already registered for this event", data: null as unknown as EventRegistration };
    const activeRegs = regs.filter((r) => r.eventId === event.id && r.status === "REGISTERED");
    if (activeRegs.length >= event.capacity) {
      return { success: false, message: "Event is at full capacity", data: null as unknown as EventRegistration };
    }
    const newReg: EventRegistration = {
      id: generateUUID(),
      registrationId: generateRegistrationId(regs.map((r) => r.registrationId)),
      eventId: event.id,
      alumniId,
      registrationDate: new Date().toISOString(),
      status: "REGISTERED",
    };
    regs.push(newReg);
    saveRegistrations(regs);
    return { success: true, message: "Registered successfully", data: newReg };
  },

  async cancelRegistration(eventId: string, alumniId: string): Promise<ApiResponse<null>> {
    await delay();
    const events = ensureEvents();
    const event = events.find((e) => e.id === eventId || e.eventId === eventId);
    if (!event) return { success: false, message: "Event not found", data: null };
    const regs = ensureRegistrations();
    const idx = regs.findIndex((r) => r.eventId === event.id && r.alumniId === alumniId && r.status === "REGISTERED");
    if (idx === -1) return { success: false, message: "Registration not found", data: null };
    regs[idx].status = "CANCELLED";
    saveRegistrations(regs);
    return { success: true, message: "Registration cancelled", data: null };
  },

  async getRegistrations(eventId: string): Promise<ApiResponse<EventRegistration[]>> {
    await delay(100);
    const events = ensureEvents();
    const event = events.find((e) => e.id === eventId || e.eventId === eventId);
    if (!event) return { success: false, message: "Event not found", data: [] };
    const regs = ensureRegistrations();
    return { success: true, message: "Registrations retrieved", data: regs.filter((r) => r.eventId === event.id) };
  },

  async getMyRegistrations(alumniId: string): Promise<ApiResponse<EventRegistration[]>> {
    await delay(100);
    const regs = ensureRegistrations();
    return { success: true, message: "My registrations retrieved", data: regs.filter((r) => r.alumniId === alumniId) };
  },
};
