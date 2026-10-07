import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateEventRequest,
  EventItem,
  EventQueryParams,
  EventRegistration,
  UpdateEventRequest,
} from "@/types/event";

export interface EventService {
  getAll(
    params: EventQueryParams,
  ): Promise<ApiResponse<PagedResult<EventItem>>>;

  getById(id: string): Promise<ApiResponse<EventItem>>;

  create(payload: CreateEventRequest): Promise<ApiResponse<EventItem>>;

  update(
    id: string,
    payload: UpdateEventRequest,
  ): Promise<ApiResponse<EventItem>>;

  remove(id: string): Promise<ApiResponse<boolean>>;

  getRegistrations(eventId: string): Promise<ApiResponse<EventRegistration[]>>;

  register(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<EventRegistration>>;

  cancelRegistration(
    eventId: string,
    alumniId: string,
  ): Promise<ApiResponse<boolean>>;
}
