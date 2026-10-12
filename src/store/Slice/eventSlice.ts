import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EventItem, EventRegistration } from "@/types/event";

interface EventState {
  items: EventItem[];
  selectedEvent: EventItem | null;
  registrations: EventRegistration[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  items: [],
  selectedEvent: null,
  registrations: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  search: "",
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<EventItem[]>) {
      state.items = action.payload;
    },
    setSelectedEvent(state, action: PayloadAction<EventItem | null>) {
      state.selectedEvent = action.payload;
    },
    setRegistrations(state, action: PayloadAction<EventRegistration[]>) {
      state.registrations = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.pageNumber = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
      state.registrations = [];
    },
  },
});

export const {
  setEvents,
  setSelectedEvent,
  setRegistrations,
  setTotalCount,
  setSearch,
  setPage,
  setPageSize,
  setLoading,
  setError,
  clearSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
