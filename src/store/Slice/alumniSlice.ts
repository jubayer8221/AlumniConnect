// src/store/Slice/alumniSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AlumniPrivacySettings,
  AlumniProfileFullModel,
} from "@/types/alumni";

export interface AlumniFilters {
  status?: string;
  programId?: number;
  graduationYear?: number;
}

interface AlumniState {
  alumni: AlumniProfileFullModel[];
  selectedAlumni: AlumniProfileFullModel | null;
  privacy: AlumniPrivacySettings | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  filters: AlumniFilters;
}

const initialState: AlumniState = {
  alumni: [],
  selectedAlumni: null,
  privacy: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  search: "",
  sortBy: "fullName",
  sortDirection: "asc",
  filters: {},
};

const alumniSlice = createSlice({
  name: "alumni",
  initialState,
  reducers: {
    setAlumniData(
      state,
      action: PayloadAction<{
        items: AlumniProfileFullModel[];
        totalCount?: number;
        pageNumber?: number;
        pageSize?: number;
      }>,
    ) {
      const { items, totalCount, pageNumber, pageSize } = action.payload;
      state.alumni = items;
      state.totalCount = totalCount ?? items.length;
      if (pageNumber !== undefined) state.pageNumber = pageNumber;
      if (pageSize !== undefined) state.pageSize = pageSize;
    },
    setSelectedAlumni(
      state,
      action: PayloadAction<AlumniProfileFullModel | null>,
    ) {
      state.selectedAlumni = action.payload;
    },
    setPrivacy(state, action: PayloadAction<AlumniPrivacySettings | null>) {
      state.privacy = action.payload;
    },
    clearSelectedAlumni(state) {
      state.selectedAlumni = null;
    },
    clearAlumniData(state) {
      state.alumni = [];
      state.selectedAlumni = null;
      state.privacy = null;
      state.totalCount = 0;
      state.pageNumber = 1;
      state.search = "";
      state.filters = {};
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.pageNumber = 1;
    },
    setFilters(state, action: PayloadAction<AlumniFilters>) {
      state.filters = action.payload;
      state.pageNumber = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.pageNumber = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    setSort(
      state,
      action: PayloadAction<{
        sortBy: string;
        sortDirection: "asc" | "desc";
      }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
  },
});

export const {
  setAlumniData,
  setSelectedAlumni,
  setPrivacy,
  clearSelectedAlumni,
  clearAlumniData,
  setSearch,
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  setSort,
} = alumniSlice.actions;

export default alumniSlice.reducer;
