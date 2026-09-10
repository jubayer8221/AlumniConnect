import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User, UserRole, AuthSession } from "@/types/auth";
import type { LoginRequest, ChangePasswordRequest } from "@/types/auth";
import { authService } from "@/services";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: undefined,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    const res = await authService.login(credentials);
    if (!res.success) return rejectWithValue(res.message);
    return res.data;
  },
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const restoreSessionAsync = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    const session = authService.getSession();
    if (!session) return null;
    const res = await authService.getCurrentUser();
    if (!res.success || !res.data) return null;
    return { user: res.data, session };
  },
);

export const changePasswordAsync = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    const res = await authService.changePassword(data);
    if (!res.success) return rejectWithValue(res.message);
    return res.message;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(restoreSessionAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.role = action.payload.user.role;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSessionAsync.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;

export function persistSession(session: AuthSession | null): void {
  if (session) {
    localStorageService.set(STORAGE_KEYS.AUTH_SESSION, session);
  } else {
    localStorageService.remove(STORAGE_KEYS.AUTH_SESSION);
  }
}
