// src/store/Slice/connectionSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConnectionItem, ConnectionStatusInfo } from "@/types/connection";

interface ConnectionState {
  connections: ConnectionItem[];
  pendingRequests: ConnectionItem[];
  // status cache keyed by other user id
  statuses: Record<number, ConnectionStatusInfo>;
}

const initialState: ConnectionState = {
  connections: [],
  pendingRequests: [],
  statuses: {},
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnections(state, action: PayloadAction<ConnectionItem[]>) {
      state.connections = action.payload;
    },
    setPendingRequests(state, action: PayloadAction<ConnectionItem[]>) {
      state.pendingRequests = action.payload;
    },
    setConnectionStatus(
      state,
      action: PayloadAction<{
        otherUserID: number;
        info: ConnectionStatusInfo;
      }>,
    ) {
      state.statuses[action.payload.otherUserID] = action.payload.info;
    },
    clearConnectionStatus(state, action: PayloadAction<number>) {
      delete state.statuses[action.payload];
    },
    clearConnectionData(state) {
      state.connections = [];
      state.pendingRequests = [];
      state.statuses = {};
    },
  },
});

export const {
  setConnections,
  setPendingRequests,
  setConnectionStatus,
  clearConnectionStatus,
  clearConnectionData,
} = connectionSlice.actions;

export default connectionSlice.reducer;
