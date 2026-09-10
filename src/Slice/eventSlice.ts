import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { EventItem, EventFilters, CreateEventRequest, UpdateEventRequest, EventRegistration } from "@/types/event";
import { eventService } from "@/services";

interface EventState {
  items: EventItem[];
  selectedEvent: EventItem | null;
  registrations: EventRegistration[];
  myRegistrations: EventRegistration[];
  loading: boolean;
  error: string | null;
  filters: EventFilters;
  search: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

const initialState: EventState = {
  items: [], selectedEvent: null, registrations: [], myRegistrations: [],
  loading: false, error: null, filters: {}, search: "", pageNumber: 1, pageSize: 10, totalCount: 0,
};

export const fetchEventsAsync = createAsyncThunk("events/fetchAll", async (_, { getState }) => {
  const state = getState() as { events: EventState };
  return eventService.getAll({ pageNumber: state.events.pageNumber, pageSize: state.events.pageSize, search: state.events.search, filters: state.events.filters });
});

export const fetchEventByIdAsync = createAsyncThunk("events/fetchById", async (id: string, { rejectWithValue }) => {
  const res = await eventService.getById(id);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const createEventAsync = createAsyncThunk("events/create", async (data: CreateEventRequest, { rejectWithValue }) => {
  const res = await eventService.create(data);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const updateEventAsync = createAsyncThunk("events/update", async ({ id, data }: { id: string; data: UpdateEventRequest }, { rejectWithValue }) => {
  const res = await eventService.update(id, data);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const deleteEventAsync = createAsyncThunk("events/delete", async (id: string, { rejectWithValue }) => {
  const res = await eventService.delete(id);
  if (!res.success) return rejectWithValue(res.message);
  return id;
});

export const registerForEventAsync = createAsyncThunk("events/register", async ({ eventId, alumniId }: { eventId: string; alumniId: string }, { rejectWithValue }) => {
  const res = await eventService.register(eventId, alumniId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const cancelEventRegistrationAsync = createAsyncThunk("events/cancelRegistration", async ({ eventId, alumniId }: { eventId: string; alumniId: string }, { rejectWithValue }) => {
  const res = await eventService.cancelRegistration(eventId, alumniId);
  if (!res.success) return rejectWithValue(res.message);
  return { eventId, alumniId };
});

export const fetchEventRegistrationsAsync = createAsyncThunk("events/fetchRegistrations", async (eventId: string, { rejectWithValue }) => {
  const res = await eventService.getRegistrations(eventId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const fetchMyRegistrationsAsync = createAsyncThunk("events/fetchMyRegistrations", async (alumniId: string, { rejectWithValue }) => {
  const res = await eventService.getMyRegistrations(alumniId);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

const eventSlice = createSlice({
  name: "events", initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload; state.pageNumber = 1; },
    setFilters(state, action: PayloadAction<EventFilters>) { state.filters = action.payload; state.pageNumber = 1; },
    setPage(state, action: PayloadAction<number>) { state.pageNumber = action.payload; },
    setPageSize(state, action: PayloadAction<number>) { state.pageSize = action.payload; state.pageNumber = 1; },
    setSelectedEvent(state, action: PayloadAction<EventItem | null>) { state.selectedEvent = action.payload; },
    clearEventError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEventsAsync.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data.items; state.totalCount = action.payload.data.totalCount; })
      .addCase(fetchEventsAsync.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch events"; })
      .addCase(fetchEventByIdAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchEventByIdAsync.fulfilled, (state, action) => { state.loading = false; state.selectedEvent = action.payload; })
      .addCase(fetchEventByIdAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createEventAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(createEventAsync.pending, (state) => { state.loading = true; })
      .addCase(createEventAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateEventAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(updateEventAsync.pending, (state) => { state.loading = true; })
      .addCase(updateEventAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(deleteEventAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteEventAsync.pending, (state) => { state.loading = true; })
      .addCase(deleteEventAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(registerForEventAsync.fulfilled, (state, action) => { state.myRegistrations.push(action.payload); state.loading = false; })
      .addCase(registerForEventAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerForEventAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(cancelEventRegistrationAsync.fulfilled, (state, action) => { state.myRegistrations = state.myRegistrations.filter((r) => !(r.eventId === action.payload.eventId && r.alumniId === action.payload.alumniId)); state.loading = false; })
      .addCase(cancelEventRegistrationAsync.pending, (state) => { state.loading = true; })
      .addCase(cancelEventRegistrationAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchEventRegistrationsAsync.fulfilled, (state, action) => { state.registrations = action.payload; })
      .addCase(fetchMyRegistrationsAsync.fulfilled, (state, action) => { state.myRegistrations = action.payload; });
  },
});

export const { setSearch, setFilters, setPage, setPageSize, setSelectedEvent, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
