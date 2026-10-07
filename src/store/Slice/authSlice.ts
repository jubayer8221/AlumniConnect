import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthUser } from "@/types/auth";
import {
  clearStoredAuth,
  loadStoredAuth,
  TOKEN_KEY,
  USER_KEY,
} from "@/utils/authUtils";

interface AuthState {
  token: string | null;
  authUser: IAuthUser | null;
  loading: boolean;
  error: string | null;
}

const stored = loadStoredAuth();

const initialState: AuthState = {
  token: stored.token,
  authUser: stored.user,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: IAuthUser }>,
    ) {
      state.token = action.payload.token;
      state.authUser = action.payload.user;
      state.error = null;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.authUser = null;
      state.error = null;
      clearStoredAuth();
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } =
  authSlice.actions;
export default authSlice.reducer;
