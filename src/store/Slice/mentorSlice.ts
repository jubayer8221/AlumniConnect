// src/store/Slice/mentorSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MentorListItem } from "@/types/mentor";

interface MentorState {
  mentors: MentorListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const initialState: MentorState = {
  mentors: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 12,
};

const mentorSlice = createSlice({
  name: "mentor",
  initialState,
  reducers: {
    setMentorData(
      state,
      action: PayloadAction<{
        items: MentorListItem[];
        totalCount?: number;
        pageNumber?: number;
        pageSize?: number;
      }>,
    ) {
      state.mentors = action.payload.items;
      state.totalCount =
        action.payload.totalCount ?? action.payload.items.length;
      if (action.payload.pageNumber !== undefined)
        state.pageNumber = action.payload.pageNumber;
      if (action.payload.pageSize !== undefined)
        state.pageSize = action.payload.pageSize;
    },
    setMentorPage(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setMentorPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    clearMentorData(state) {
      state.mentors = [];
      state.totalCount = 0;
      state.pageNumber = 1;
    },
  },
});

export const {
  setMentorData,
  setMentorPage,
  setMentorPageSize,
  clearMentorData,
} = mentorSlice.actions;

export default mentorSlice.reducer;
