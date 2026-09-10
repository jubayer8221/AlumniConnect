export type EventType =
  | "Reunion"
  | "Seminar"
  | "Workshop"
  | "Networking"
  | "Sports"
  | "Cultural"
  | "Career"
  | "Webinar"
  | "Other";

export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface EventItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  organizer: string;
  registrationDeadline: string;
  capacity: number;
  image?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  registrationId: string;
  eventId: string;
  alumniId: string;
  registrationDate: string;
  status: "REGISTERED" | "CANCELLED";
}

export interface EventFilters {
  search?: string;
  eventType?: EventType;
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  organizer: string;
  registrationDeadline: string;
  capacity: number;
  image?: string;
  status: EventStatus;
}

export type UpdateEventRequest = Partial<CreateEventRequest> & { id: string };

export interface EventQueryParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  filters?: EventFilters;
}
