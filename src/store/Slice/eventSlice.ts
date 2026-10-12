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

// import {
//   createAsyncThunk,
//   createSlice,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import { eventService } from "@/services";
// import type {
//   CreateEventRequest,
//   EventItem,
//   EventQueryParams,
//   EventRegistration,
//   UpdateEventRequest,
// } from "@/types/event";
// import { getApiErrorMessage } from "@/utils/apiError";

// interface EventState {
//   items: EventItem[];
//   selectedEvent: EventItem | null;
//   registrations: EventRegistration[];
//   totalCount: number;
//   pageNumber: number;
//   pageSize: number;
//   search: string;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: EventState = {
//   items: [],
//   selectedEvent: null,
//   registrations: [],
//   totalCount: 0,
//   pageNumber: 1,
//   pageSize: 10,
//   search: "",
//   loading: false,
//   error: null,
// };

// /* ============================================================
//    Thunks — events
//    ============================================================ */

// export const fetchEventsAsync = createAsyncThunk<
//   { items: EventItem[]; totalCount: number },
//   EventQueryParams | void,
//   { rejectValue: string }
// >("events/fetchAll", async (params, { rejectWithValue }) => {
//   try {
//     const query: EventQueryParams = params ?? {
//       pageNumber: 1,
//       pageSize: 10,
//     };
//     const res = await eventService.getAll(query);
//     if (!res.success) return rejectWithValue(res.message);
//     return { items: res.data.items, totalCount: res.data.totalRecords };
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to load events"));
//   }
// });

// export const fetchEventByIdAsync = createAsyncThunk<
//   EventItem,
//   string,
//   { rejectValue: string }
// >("events/fetchById", async (id, { rejectWithValue }) => {
//   try {
//     const res = await eventService.getById(id);
//     if (!res.success) return rejectWithValue(res.message);
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to load event"));
//   }
// });

// export const createEventAsync = createAsyncThunk<
//   EventItem,
//   CreateEventRequest,
//   { rejectValue: string }
// >("events/create", async (payload, { rejectWithValue }) => {
//   try {
//     const res = await eventService.create(payload);
//     if (!res.success) return rejectWithValue(res.message);
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to create event"));
//   }
// });

// export const updateEventAsync = createAsyncThunk<
//   EventItem,
//   { id: string; data: UpdateEventRequest },
//   { rejectValue: string }
// >("events/update", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const res = await eventService.update(id, data);
//     if (!res.success) return rejectWithValue(res.message);
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to update event"));
//   }
// });

// export const deleteEventAsync = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("events/delete", async (id, { rejectWithValue }) => {
//   try {
//     const res = await eventService.remove(id);
//     if (!res.success) return rejectWithValue(res.message);
//     return id;
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to delete event"));
//   }
// });

// /* ============================================================
//    Thunks — registrations
//    ============================================================ */

// export const fetchEventRegistrationsAsync = createAsyncThunk<
//   EventRegistration[],
//   string,
//   { rejectValue: string }
// >("events/fetchRegistrations", async (eventId, { rejectWithValue }) => {
//   try {
//     const res = await eventService.getRegistrations(eventId);
//     if (!res.success) return rejectWithValue(res.message);
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(
//       getApiErrorMessage(err, "Unable to load registrations"),
//     );
//   }
// });

// export const registerForEventAsync = createAsyncThunk<
//   EventRegistration,
//   { eventId: string; alumniId: string },
//   { rejectValue: string }
// >("events/register", async ({ eventId, alumniId }, { rejectWithValue }) => {
//   try {
//     const res = await eventService.register(eventId, alumniId);
//     if (!res.success) return rejectWithValue(res.message);
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(getApiErrorMessage(err, "Unable to register"));
//   }
// });

// export const cancelEventRegistrationAsync = createAsyncThunk<
//   { eventId: string; alumniId: string },
//   { eventId: string; alumniId: string },
//   { rejectValue: string }
// >(
//   "events/cancelRegistration",
//   async ({ eventId, alumniId }, { rejectWithValue }) => {
//     try {
//       const res = await eventService.cancelRegistration(eventId, alumniId);
//       if (!res.success) return rejectWithValue(res.message);
//       return { eventId, alumniId };
//     } catch (err) {
//       return rejectWithValue(getApiErrorMessage(err, "Unable to cancel"));
//     }
//   },
// );

// /* ============================================================
//    Slice
//    ============================================================ */

// const eventSlice = createSlice({
//   name: "events",
//   initialState,
//   reducers: {
//     setSearch(state, action: PayloadAction<string>) {
//       state.search = action.payload;
//       state.pageNumber = 1;
//     },
//     setPage(state, action: PayloadAction<number>) {
//       state.pageNumber = action.payload;
//     },
//     setPageSize(state, action: PayloadAction<number>) {
//       state.pageSize = action.payload;
//       state.pageNumber = 1;
//     },
//     clearSelectedEvent(state) {
//       state.selectedEvent = null;
//       state.registrations = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEventsAsync.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEventsAsync.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.items;
//         state.totalCount = action.payload.totalCount;
//       })
//       .addCase(fetchEventsAsync.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Unable to load events";
//       })

//       .addCase(fetchEventByIdAsync.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEventByIdAsync.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedEvent = action.payload;
//       })
//       .addCase(fetchEventByIdAsync.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? "Unable to load event";
//       })

//       .addCase(createEventAsync.fulfilled, (state, action) => {
//         state.items = [action.payload, ...state.items];
//         state.totalCount += 1;
//       })
//       .addCase(updateEventAsync.fulfilled, (state, action) => {
//         state.items = state.items.map((e) =>
//           e.id === action.payload.id ? action.payload : e,
//         );
//         if (state.selectedEvent?.id === action.payload.id) {
//           state.selectedEvent = action.payload;
//         }
//       })
//       .addCase(deleteEventAsync.fulfilled, (state, action) => {
//         state.items = state.items.filter((e) => e.id !== action.payload);
//         state.totalCount = Math.max(0, state.totalCount - 1);
//       })

//       .addCase(fetchEventRegistrationsAsync.fulfilled, (state, action) => {
//         state.registrations = action.payload;
//       })
//       .addCase(registerForEventAsync.fulfilled, (state, action) => {
//         const existing = state.registrations.findIndex(
//           (r) => r.id === action.payload.id,
//         );
//         if (existing === -1) state.registrations.push(action.payload);
//         else state.registrations[existing] = action.payload;
//       })
//       .addCase(cancelEventRegistrationAsync.fulfilled, (state, action) => {
//         state.registrations = state.registrations.map((r) =>
//           r.eventId === action.payload.eventId &&
//           r.alumniId === action.payload.alumniId
//             ? { ...r, status: "CANCELLED" as const }
//             : r,
//         );
//       });
//   },
// });

// export const { setSearch, setPage, setPageSize, clearSelectedEvent } =
//   eventSlice.actions;
// export default eventSlice.reducer;
