import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/Slice/authSlice";
import alumniReducer from "@/Slice/alumniSlice";
import eventReducer from "@/Slice/eventSlice";
import noticeReducer from "@/Slice/noticeSlice";
import dashboardReducer from "@/Slice/dashboardSlice";
import uiReducer from "@/Slice/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alumni: alumniReducer,
    events: eventReducer,
    notices: noticeReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
