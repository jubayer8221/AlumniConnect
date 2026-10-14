// src/store/Slice/roleSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RoleItem } from "@/types/role";

interface RoleState {
  roles: RoleItem[];
}

const initialState: RoleState = {
  roles: [],
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRoleData(state, action: PayloadAction<RoleItem[]>) {
      state.roles = action.payload;
    },
    clearRoleData(state) {
      state.roles = [];
    },
  },
});

export const { setRoleData, clearRoleData } = roleSlice.actions;
export default roleSlice.reducer;
