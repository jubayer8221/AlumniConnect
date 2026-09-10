import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ToastMessage {
  id: string;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  theme: "light" | "dark";
  toasts: ToastMessage[];
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  theme: "light",
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui", initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    toggleSidebarCollapse(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    toggleMobileSidebar(state) { state.mobileSidebarOpen = !state.mobileSidebarOpen; },
    closeMobileSidebar(state) { state.mobileSidebarOpen = false; },
    setTheme(state, action: PayloadAction<"light" | "dark">) { state.theme = action.payload; },
    showToast(state, action: PayloadAction<Omit<ToastMessage, "id">>) {
      state.toasts.push({ ...action.payload, id: Date.now().toString() });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar, toggleSidebarCollapse, toggleMobileSidebar, closeMobileSidebar,
  setTheme, showToast, removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
