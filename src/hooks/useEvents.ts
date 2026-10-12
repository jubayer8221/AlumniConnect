import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setEvents,
  setSelectedEvent,
  setRegistrations,
  setTotalCount,
  setLoading,
  setError,
  setSearch as setSearchAction,
  setPage as setPageAction,
  setPageSize as setPageSizeAction,
} from "@/store/Slice/eventSlice";
import type {
  EventItem,
  EventRegistration,
  EventStatus,
  EventType,
} from "@/types/event";
import api from "@/services/api/apiClient";

/* ---------- raw API shape ---------- */
interface RawEvent {
  eventID: string;
  eventTitle: string;
  description: string;
  createByID?: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  organizer: string;
  capacity: number;
  regDeadline?: string;
  image?: string;
  setDate?: string;
  eventType?: string;
  status?: string;
}

/* ---------- create/update payload ---------- */
export interface CreateUpdateEventPayload {
  eventID?: string; // omit or "" for create; set for update
  eventTitle: string;
  description: string;
  createByID?: string;
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
  location: string;
  venue: string;
  organizer: string;
  capacity: number;
  regDeadline?: string;
  image?: string;
  setDate?: string;
}

/* ---------- transform ---------- */
const splitDateTime = (iso: string) => {
  const [date = "", time = ""] = (iso ?? "").split("T");
  return { date, time: time.slice(0, 5) };
};

const deriveStatus = (raw: RawEvent): EventStatus => {
  if (raw.status) return raw.status as EventStatus;
  const s = new Date(raw.startDate).getTime();
  const e = new Date(raw.endDate).getTime();
  if (!s || !e) return "UPCOMING";
  const now = Date.now();
  if (now < s) return "UPCOMING";
  if (now <= e) return "ONGOING";
  return "COMPLETED";
};

const transformEvent = (raw: RawEvent): EventItem => {
  const start = splitDateTime(raw.startDate);
  const end = splitDateTime(raw.endDate);
  return {
    id: raw.eventID,
    eventId: raw.eventID,
    title: raw.eventTitle,
    description: raw.description ?? "",
    eventType: (raw.eventType as EventType) ?? "Other",
    date: start.date,
    startTime: start.time,
    endTime: end.time,
    location: raw.location ?? "",
    venue: raw.venue ?? "",
    organizer: raw.organizer ?? "",
    registrationDeadline: raw.regDeadline ?? "",
    capacity: raw.capacity ?? 0,
    image: raw.image,
    status: deriveStatus(raw),
    createdAt: raw.setDate ?? "",
    updatedAt: raw.setDate ?? "",
  };
};

/** Normalize list response — supports array or paged wrapper */
const normalizeListResponse = (
  data: unknown,
): { items: RawEvent[]; totalRecords: number } => {
  if (Array.isArray(data)) {
    return { items: data as RawEvent[], totalRecords: data.length };
  }

  const obj = data as Record<string, unknown> | null;
  if (!obj) return { items: [], totalRecords: 0 };

  const inner =
    (obj.items as unknown) ??
    (obj.data as unknown) ??
    (obj.result as unknown) ??
    obj;

  if (Array.isArray(inner)) {
    const total =
      (obj.totalRecords as number) ??
      (obj.totalCount as number) ??
      (obj.total as number) ??
      inner.length;
    return { items: inner as RawEvent[], totalRecords: total };
  }

  if (inner && typeof inner === "object") {
    const page = inner as Record<string, unknown>;
    const items = (page.items ?? page.data ?? []) as RawEvent[];
    const total =
      (page.totalRecords as number) ??
      (page.totalCount as number) ??
      (obj.totalRecords as number) ??
      (obj.totalCount as number) ??
      (Array.isArray(items) ? items.length : 0);
    return {
      items: Array.isArray(items) ? items : [],
      totalRecords: total,
    };
  }

  return { items: [], totalRecords: 0 };
};

/* ---------- params (match API query names) ---------- */
export interface FetchEventsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string; // maps to searchstring
  upcomingOnly?: boolean;
  fromDate?: string; // ISO date-time
  toDate?: string; // ISO date-time
}

export const useEvents = () => {
  const dispatch = useDispatch();

  const items = useSelector((s: RootState) => s.events.items);
  const selectedEvent = useSelector((s: RootState) => s.events.selectedEvent);
  const registrations = useSelector((s: RootState) => s.events.registrations);
  const totalCount = useSelector((s: RootState) => s.events.totalCount);
  const pageNumber = useSelector((s: RootState) => s.events.pageNumber);
  const pageSize = useSelector((s: RootState) => s.events.pageSize);
  const search = useSelector((s: RootState) => s.events.search);
  const loading = useSelector((s: RootState) => s.events.loading);
  const error = useSelector((s: RootState) => s.events.error);

  /* ---------- list: GET /Event/GetEvents ---------- */
  const fetchEvents = useCallback(
    async (params?: FetchEventsParams) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const res = await api.get("/Event/GetEvents", {
          params: {
            pageNumber: params?.pageNumber ?? 1,
            pageSize: params?.pageSize ?? 20,
            searchstring: params?.search || undefined,
            upcomingOnly: params?.upcomingOnly,
            fromDate: params?.fromDate || undefined,
            toDate: params?.toDate || undefined,
          },
        });

        const { items: rawItems, totalRecords } = normalizeListResponse(
          res.data,
        );

        dispatch(setEvents(rawItems.map(transformEvent)));
        dispatch(setTotalCount(totalRecords));
        return { items: rawItems, totalRecords };
      } catch (err: unknown) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        console.error("Failed to load events", err);
        dispatch(
          setError(anyErr?.response?.data?.message ?? "Unable to load events"),
        );
        dispatch(setEvents([]));
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /* ---------- detail: GET /Event/{id} ---------- */
  const fetchEventById = useCallback(
    async (id: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const res = await api.get(`/Event/${id}`);
        const raw = (res.data?.data ?? res.data) as RawEvent;
        if (!raw?.eventID) {
          dispatch(setError("Unable to load event"));
          return null;
        }

        const event = transformEvent(raw);
        dispatch(setSelectedEvent(event));
        return event;
      } catch (err: unknown) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        console.error("Failed to load event", err);
        dispatch(
          setError(anyErr?.response?.data?.message ?? "Unable to load event"),
        );
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /* ---------- registrations (update paths when API is ready) ---------- */
  const fetchRegistrations = useCallback(
    async (eventId: string) => {
      try {
        const res = await api.get(`/Event/${eventId}`);
        const data = res.data?.data ?? res.data ?? [];
        dispatch(setRegistrations(Array.isArray(data) ? data : []));
        return data as EventRegistration[];
      } catch (err) {
        console.error("Failed to load registrations", err);
        dispatch(setRegistrations([]));
        return null;
      }
    },
    [dispatch],
  );

  const registerForEvent = useCallback(
    async (eventId: string, alumniId: string) => {
      const res = await api.post(`/Event/${eventId}/register`, { alumniId });
      return res.data?.data ?? res.data;
    },
    [],
  );

  const cancelRegistration = useCallback(
    async (eventId: string, alumniId: string) => {
      await api.delete(`/Event/${eventId}/registrations/${alumniId}`);
    },
    [],
  );

  /* ---------- create / update: POST /Event/CreateUpdateEvent ---------- */
  const createEvent = useCallback(async (payload: CreateUpdateEventPayload) => {
    const res = await api.post("/Event/CreateUpdateEvent", {
      ...payload,
      eventID: payload.eventID ?? "",
    });
    const raw = (res.data?.data ?? res.data) as RawEvent;
    return transformEvent(raw);
  }, []);

  const updateEvent = useCallback(
    async (id: string, payload: Omit<CreateUpdateEventPayload, "eventID">) => {
      const res = await api.post("/Event/CreateUpdateEvent", {
        ...payload,
        eventID: id,
      });
      const raw = (res.data?.data ?? res.data) as RawEvent;
      return transformEvent(raw);
    },
    [],
  );

  const deleteEvent = useCallback(async (id: string) => {
    // update when you have the real delete endpoint
    await api.delete(`/Event/${id}`);
  }, []);

  /* ---------- setters ---------- */
  const setSearch = useCallback(
    (v: string) => dispatch(setSearchAction(v)),
    [dispatch],
  );
  const setPage = useCallback(
    (v: number) => dispatch(setPageAction(v)),
    [dispatch],
  );
  const setPageSize = useCallback(
    (v: number) => dispatch(setPageSizeAction(v)),
    [dispatch],
  );

  return {
    items,
    selectedEvent,
    registrations,
    totalCount,
    pageNumber,
    pageSize,
    search,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    fetchRegistrations,
    registerForEvent,
    cancelRegistration,
    createEvent,
    updateEvent,
    deleteEvent,
    setSearch,
    setPage,
    setPageSize,
  };
};
