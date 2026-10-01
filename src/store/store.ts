import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Reducer } from "redux";
import authReducer, { logoutAsync } from "@/Slice/authSlice";
import alumniReducer from "@/Slice/alumniSlice";
import eventReducer from "@/Slice/eventSlice";
import noticeReducer from "@/Slice/noticeSlice";
import dashboardReducer from "@/Slice/dashboardSlice";
import uiReducer from "@/Slice/uiSlice";

const appReducer = combineReducers({
  auth: authReducer,
  alumni: alumniReducer,
  events: eventReducer,
  notices: noticeReducer,
  dashboard: dashboardReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer: Reducer<RootState> = (state, action) => {
  if (
    logoutAsync.fulfilled.match(action) ||
    logoutAsync.rejected.match(action)
  ) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
