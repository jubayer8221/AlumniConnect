import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { noticeService } from "@/services";
import type {
  CreateNoticeRequest,
  Notice,
  NoticeQueryParams,
  UpdateNoticeRequest,
} from "@/types/notice";
import { getApiErrorMessage } from "@/utils/apiError";

interface NoticeState {
  items: Notice[];
  selectedNotice: Notice | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  loading: boolean;
  error: string | null;
}

const initialState: NoticeState = {
  items: [],
  selectedNotice: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  search: "",
  loading: false,
  error: null,
};

/* ============================================================
   Thunks
   ============================================================ */

export const fetchNoticesAsync = createAsyncThunk<
  { items: Notice[]; totalCount: number },
  NoticeQueryParams | void,
  { rejectValue: string }
>("notices/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const query: NoticeQueryParams = params ?? { pageNumber: 1, pageSize: 10 };
    const res = await noticeService.getAll(query);
    if (!res.success) return rejectWithValue(res.message);
    return { items: res.data.items, totalCount: res.data.totalRecords };
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to load notices"));
  }
});

export const fetchNoticeByIdAsync = createAsyncThunk<
  Notice,
  string,
  { rejectValue: string }
>("notices/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await noticeService.getById(id);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to load notice"));
  }
});

export const createNoticeAsync = createAsyncThunk<
  Notice,
  CreateNoticeRequest,
  { rejectValue: string }
>("notices/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await noticeService.create(payload);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to create notice"));
  }
});

export const updateNoticeAsync = createAsyncThunk<
  Notice,
  { id: string; data: UpdateNoticeRequest },
  { rejectValue: string }
>("notices/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await noticeService.update(id, data);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to update notice"));
  }
});

export const deleteNoticeAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notices/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await noticeService.remove(id);
    if (!res.success) return rejectWithValue(res.message);
    return id;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to delete notice"));
  }
});

export const publishNoticeAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notices/publish", async (id, { rejectWithValue }) => {
  try {
    const res = await noticeService.publish(id);
    if (!res.success) return rejectWithValue(res.message);
    return id;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to publish"));
  }
});

export const unpublishNoticeAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notices/unpublish", async (id, { rejectWithValue }) => {
  try {
    const res = await noticeService.unpublish(id);
    if (!res.success) return rejectWithValue(res.message);
    return id;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Unable to unpublish"));
  }
});

/* ============================================================
   Slice
   ============================================================ */

const noticeSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {
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
    clearSelectedNotice(state) {
      state.selectedNotice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoticesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoticesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchNoticesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to load notices";
      })

      .addCase(fetchNoticeByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNoticeByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotice = action.payload;
      })
      .addCase(fetchNoticeByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to load notice";
      })

      .addCase(createNoticeAsync.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.totalCount += 1;
      })
      .addCase(updateNoticeAsync.fulfilled, (state, action) => {
        state.items = state.items.map((n) =>
          n.id === action.payload.id ? action.payload : n,
        );
        if (state.selectedNotice?.id === action.payload.id) {
          state.selectedNotice = action.payload;
        }
      })
      .addCase(deleteNoticeAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(publishNoticeAsync.fulfilled, (state, action) => {
        state.items = state.items.map((n) =>
          n.id === action.payload ? { ...n, status: "PUBLISHED" } : n,
        );
      })
      .addCase(unpublishNoticeAsync.fulfilled, (state, action) => {
        state.items = state.items.map((n) =>
          n.id === action.payload ? { ...n, status: "DRAFT" } : n,
        );
      });
  },
});

export const { setSearch, setPage, setPageSize, clearSelectedNotice } =
  noticeSlice.actions;

export default noticeSlice.reducer;
