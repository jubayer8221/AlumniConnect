import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardData } from "@/types/dashboard";
import { alumniService } from "@/services";
import { eventService } from "@/services";
import { noticeService } from "@/services";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = { data: null, loading: false, error: null };

export const fetchDashboardDataAsync = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => {
  const res = await alumniService.getDashboardData();
  if (!res.success) return rejectWithValue(res.message);
  const eventsRes = await eventService.getAll({ pageNumber: 1, pageSize: 5 });
  const noticesRes = await noticeService.getAll({ pageNumber: 1, pageSize: 5, filters: { status: "PUBLISHED" } });
  const data = res.data;
  data.upcomingEvents = eventsRes.data.items.filter((e) => e.status === "UPCOMING").map((e) => ({
    id: e.id, eventId: e.eventId, title: e.title, date: e.date, location: e.location, eventType: e.eventType,
  }));
  data.recentNotices = noticesRes.data.items.map((n) => ({ id: n.id, title: n.title, category: n.category, publishDate: n.publishDate }));
  data.summary.totalEvents = eventsRes.data.totalCount;
  data.summary.upcomingEvents = data.upcomingEvents.length;
  return data;
});

const dashboardSlice = createSlice({
  name: "dashboard", initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardDataAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboardDataAsync.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchDashboardDataAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default dashboardSlice.reducer;
