import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DashboardData } from "@/types/dashboard";
import api from "@/services/api/apiClient";
import { getApiErrorMessage } from "@/utils/apiError";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

/* ============================================================
   Thunk — GET /api/Dashboard/GetDashboardData
   ============================================================ */
export const fetchDashboardDataAsync = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("dashboard/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<DashboardData>("/Dashboard/GetDashboardData");
    return res.data;
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Unable to load dashboard data"),
    );
  }
});

/* ============================================================
   Slice
   ============================================================ */
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardData(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to load dashboard data";
      });
  },
});

export const { clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
