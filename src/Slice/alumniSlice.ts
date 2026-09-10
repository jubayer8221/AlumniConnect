import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Alumni, AlumniFilters, CreateAlumniRequest, UpdateAlumniRequest } from "@/types/alumni";
import { alumniService } from "@/services";

interface AlumniState {
  items: Alumni[];
  selectedAlumni: Alumni | null;
  loading: boolean;
  error: string | null;
  filters: AlumniFilters;
  search: string;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

const initialState: AlumniState = {
  items: [],
  selectedAlumni: null,
  loading: false,
  error: null,
  filters: {},
  search: "",
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  sortBy: "fullName",
  sortDirection: "asc",
};

export const fetchAlumniAsync = createAsyncThunk(
  "alumni/fetchAll",
  async (_, { getState }) => {
    const state = getState() as { alumni: AlumniState };
    const res = await alumniService.getAll({
      pageNumber: state.alumni.pageNumber,
      pageSize: state.alumni.pageSize,
      search: state.alumni.search,
      sortBy: state.alumni.sortBy,
      sortDirection: state.alumni.sortDirection,
      filters: state.alumni.filters,
    });
    return res;
  }
);

export const fetchAlumniByIdAsync = createAsyncThunk(
  "alumni/fetchById",
  async (id: string) => {
    const res = await alumniService.getById(id);
    if (!res.success) throw new Error(res.message);
    return res.data;
  }
);

export const createAlumniAsync = createAsyncThunk(
  "alumni/create",
  async (data: CreateAlumniRequest, { rejectWithValue }) => {
    const res = await alumniService.create(data);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const updateAlumniAsync = createAsyncThunk(
  "alumni/update",
  async ({ id, data }: { id: string; data: UpdateAlumniRequest }, { rejectWithValue }) => {
    const res = await alumniService.update(id, data);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const deleteAlumniAsync = createAsyncThunk(
  "alumni/delete",
  async (id: string, { rejectWithValue }) => {
    const res = await alumniService.delete(id);
    if (!res.success) return rejectWithValue(res.message);
    return id;
  }
);

export const verifyAlumniAsync = createAsyncThunk(
  "alumni/verify",
  async (id: string, { rejectWithValue }) => {
    const res = await alumniService.verify(id);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const updateAlumniStatusAsync = createAsyncThunk(
  "alumni/updateStatus",
  async ({ id, status }: { id: string; status: Alumni["status"] }, { rejectWithValue }) => {
    const res = await alumniService.updateStatus(id, status);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

export const updateAlumniPrivacyAsync = createAsyncThunk(
  "alumni/updatePrivacy",
  async ({ id, privacy }: { id: string; privacy: Alumni["privacy"] }, { rejectWithValue }) => {
    const res = await alumniService.updatePrivacy(id, privacy);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  }
);

const alumniSlice = createSlice({
  name: "alumni",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<AlumniFilters>) {
      state.filters = action.payload;
      state.pageNumber = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.search = "";
      state.pageNumber = 1;
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
    setSort(state, action: PayloadAction<{ sortBy: string; sortDirection: "asc" | "desc" }>) {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    setSelectedAlumni(state, action: PayloadAction<Alumni | null>) {
      state.selectedAlumni = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlumniAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlumniAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.totalCount = action.payload.data.totalCount;
      })
      .addCase(fetchAlumniAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch alumni";
      })
      .addCase(fetchAlumniByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlumniByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlumni = action.payload;
      })
      .addCase(fetchAlumniByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch alumni";
      })
      .addCase(createAlumniAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlumniAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAlumniAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAlumniAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlumniAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAlumniAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAlumniAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAlumniAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAlumniAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyAlumniAsync.fulfilled, (state, action) => {
        state.selectedAlumni = action.payload;
        state.items = state.items.map((a) => (a.id === action.payload.id ? action.payload : a));
      })
      .addCase(updateAlumniStatusAsync.fulfilled, (state, action) => {
        state.selectedAlumni = action.payload;
        state.items = state.items.map((a) => (a.id === action.payload.id ? action.payload : a));
      })
      .addCase(updateAlumniPrivacyAsync.fulfilled, (state, action) => {
        state.selectedAlumni = action.payload;
        state.items = state.items.map((a) => (a.id === action.payload.id ? action.payload : a));
      });
  },
});

export const {
  setFilters, clearFilters, setSearch, setPage, setPageSize, setSort,
  setSelectedAlumni, clearError,
} = alumniSlice.actions;

export default alumniSlice.reducer;
