import type {
  EventItem,
  CreateEventRequest,
  UpdateEventRequest,
  EventQueryParams,
  EventRegistration,
} from "@/types/event";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

export interface EventService {
  getAll(params?: EventQueryParams): Promise<PaginatedResponse<EventItem>>;
  getById(id: string): Promise<ApiResponse<EventItem>>;
  create(data: CreateEventRequest): Promise<ApiResponse<EventItem>>;
  update(id: string, data: UpdateEventRequest): Promise<ApiResponse<EventItem>>;
  delete(id: string): Promise<ApiResponse<null>>;
  register(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<EventRegistration>>;
  cancelRegistration(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<null>>;
  getRegistrations(eventId: string): Promise<ApiResponse<EventRegistration[]>>;
  getMyRegistrations(
    alumniId: string,
  ): Promise<ApiResponse<EventRegistration[]>>;
}
