import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Notice, NoticeFilters, CreateNoticeRequest, UpdateNoticeRequest } from "@/types/notice";
import { noticeService } from "@/services";

interface NoticeState {
  items: Notice[];
  selectedNotice: Notice | null;
  loading: boolean;
  error: string | null;
  filters: NoticeFilters;
  search: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

const initialState: NoticeState = {
  items: [], selectedNotice: null, loading: false, error: null,
  filters: {}, search: "", pageNumber: 1, pageSize: 10, totalCount: 0,
};

export const fetchNoticesAsync = createAsyncThunk("notices/fetchAll", async (_, { getState }) => {
  const state = getState() as { notices: NoticeState };
  return noticeService.getAll({ pageNumber: state.notices.pageNumber, pageSize: state.notices.pageSize, search: state.notices.search, filters: state.notices.filters });
});

export const fetchNoticeByIdAsync = createAsyncThunk("notices/fetchById", async (id: string, { rejectWithValue }) => {
  const res = await noticeService.getById(id);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const createNoticeAsync = createAsyncThunk("notices/create", async (data: CreateNoticeRequest, { rejectWithValue }) => {
  const res = await noticeService.create(data);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const updateNoticeAsync = createAsyncThunk("notices/update", async ({ id, data }: { id: string; data: UpdateNoticeRequest }, { rejectWithValue }) => {
  const res = await noticeService.update(id, data);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const deleteNoticeAsync = createAsyncThunk("notices/delete", async (id: string, { rejectWithValue }) => {
  const res = await noticeService.delete(id);
  if (!res.success) return rejectWithValue(res.message);
  return id;
});

export const publishNoticeAsync = createAsyncThunk("notices/publish", async (id: string, { rejectWithValue }) => {
  const res = await noticeService.publish(id);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

export const unpublishNoticeAsync = createAsyncThunk("notices/unpublish", async (id: string, { rejectWithValue }) => {
  const res = await noticeService.unpublish(id);
  if (!res.success) return rejectWithValue(res.message);
  return res.data;
});

const noticeSlice = createSlice({
  name: "notices", initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload; state.pageNumber = 1; },
    setFilters(state, action: PayloadAction<NoticeFilters>) { state.filters = action.payload; state.pageNumber = 1; },
    setPage(state, action: PayloadAction<number>) { state.pageNumber = action.payload; },
    setPageSize(state, action: PayloadAction<number>) { state.pageSize = action.payload; state.pageNumber = 1; },
    setSelectedNotice(state, action: PayloadAction<Notice | null>) { state.selectedNotice = action.payload; },
    clearNoticeError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoticesAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNoticesAsync.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data.items; state.totalCount = action.payload.data.totalCount; })
      .addCase(fetchNoticesAsync.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Failed to fetch notices"; })
      .addCase(fetchNoticeByIdAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchNoticeByIdAsync.fulfilled, (state, action) => { state.loading = false; state.selectedNotice = action.payload; })
      .addCase(fetchNoticeByIdAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createNoticeAsync.pending, (state) => { state.loading = true; })
      .addCase(createNoticeAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(createNoticeAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateNoticeAsync.pending, (state) => { state.loading = true; })
      .addCase(updateNoticeAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(updateNoticeAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(deleteNoticeAsync.pending, (state) => { state.loading = true; })
      .addCase(deleteNoticeAsync.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteNoticeAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(publishNoticeAsync.fulfilled, (state, action) => { state.selectedNotice = action.payload; state.items = state.items.map((n) => n.id === action.payload.id ? action.payload : n); })
      .addCase(unpublishNoticeAsync.fulfilled, (state, action) => { state.selectedNotice = action.payload; state.items = state.items.map((n) => n.id === action.payload.id ? action.payload : n); });
  },
});

export const { setSearch, setFilters, setPage, setPageSize, setSelectedNotice, clearNoticeError } = noticeSlice.actions;
export default noticeSlice.reducer;
