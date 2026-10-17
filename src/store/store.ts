import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Reducer } from "redux";
import eventReducer from "@/store/Slice/eventSlice";
import noticeReducer from "@/store/Slice/noticeSlice";
import dashboardReducer from "@/store/Slice/dashboardSlice";
import uiReducer from "@/store/Slice/uiSlice";
import authReducer from "./Slice/authSlice";
import alumniReducer from "@/store/Slice/alumniSlice";
import newsReducer from "@/store/Slice/newsSlice";
import landingReducer from "@/store/Slice/landingSlice";
import mentorReducer from "@/store/Slice/mentorSlice";
import jobReducer from "@/store/Slice/jobSlice";
import connectionReducer from "@/store/Slice/connectionSlice";
import messageReducer from "@/store/Slice/messageSlice";
import roleReducer from "@/store/Slice/roleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alumni: alumniReducer,
    events: eventReducer,
    notices: noticeReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
    news: newsReducer,
    landing: landingReducer,
    mentor: mentorReducer,
    job: jobReducer,
    connection: connectionReducer,
    message: messageReducer,
    role: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
