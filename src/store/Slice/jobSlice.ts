// src/store/Slice/jobSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JobItem } from "@/types/job";

interface JobState {
  jobs: JobItem[];
  featuredJobs: JobItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const initialState: JobState = {
  jobs: [],
  featuredJobs: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobData(
      state,
      action: PayloadAction<{
        items: JobItem[];
        totalCount?: number;
        pageNumber?: number;
        pageSize?: number;
      }>,
    ) {
      state.jobs = action.payload.items;
      state.totalCount =
        action.payload.totalCount ?? action.payload.items.length;
      if (action.payload.pageNumber !== undefined)
        state.pageNumber = action.payload.pageNumber;
      if (action.payload.pageSize !== undefined)
        state.pageSize = action.payload.pageSize;
    },
    setFeaturedJobs(state, action: PayloadAction<JobItem[]>) {
      state.featuredJobs = action.payload;
    },
    setJobPage(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setJobPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    clearJobData(state) {
      state.jobs = [];
      state.featuredJobs = [];
      state.totalCount = 0;
      state.pageNumber = 1;
    },
  },
});

export const {
  setJobData,
  setFeaturedJobs,
  setJobPage,
  setJobPageSize,
  clearJobData,
} = jobSlice.actions;

export default jobSlice.reducer;
