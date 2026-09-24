import { lazy, Suspense, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store } from "@/store/store";
import { createAppTheme } from "@/store/theme";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { restoreSessionAsync } from "@/Slice/authSlice";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import {
  ToastContainer,
  CommonLoading,
  NotFoundPage,
} from "@/components/common";

import LoginPage from "@/components/login/LoginPage";
import UnauthorizedPage from "@/components/common/UnauthorizedPage";
import AdminDashboardPage from "@/components/dashboard/AdminDashboardPage";
import AlumniListPage from "@/components/alumniProfile/AlumniListPage";
import AlumniFormPage from "@/components/alumniProfile/AlumniFormPage";
import AlumniDetailsPage from "@/components/alumniProfile/AlumniDetailsPage";
import AlumniDashboardPage from "@/components/dashboard/AlumniDashboardPage";
import ProfileSetupPage from "@/components/alumniProfile/ProfileSetupPage";
import SettingsPrivacyPage from "@/components/alumniProfile/SettingsPrivacyPage";
import AlumniDirectoryPage from "@/components/alumniProfile/AlumniDirectoryPage";
// import AlumniAccountPage from "@/components/alumniProfile/AlumniAccountPage";
import EventListPage from "@/components/event/EventListPage";
import EventDetailsPage from "@/components/event/EventDetailsPage";
import EventFormPage from "@/components/event/EventFormPage";
import NoticeListPage from "@/components/notice/NoticeListPage";
import NoticeDetailsPage from "@/components/notice/NoticeDetailsPage";
import NoticeFormPage from "@/components/notice/NoticeFormPage";
import ReportsPage from "@/components/report/ReportsPage";
import SettingsPage from "@/components/settings/SettingsPage";

function AppRoutes() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(restoreSessionAsync());
  }, [dispatch]);

  if (isAuthenticated === undefined) {
    return <CommonLoading message="Loading your session..." fullScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated === undefined ? (
            <CommonLoading message="Loading your session..." fullScreen />
          ) : isAuthenticated ? (
            <Navigate
              to={role === "ADMIN" ? "/dashboard" : "/alumni/dashboard"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={role === "ADMIN" ? "/dashboard" : "/alumni/dashboard"}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Shared alumni routes */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN", "ALUMNI"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/alumni/dashboard" element={<AlumniDashboardPage />} />
        <Route path="/alumni/profile" element={<AlumniDetailsPage />} />
        <Route path="/alumni/profile-setup" element={<ProfileSetupPage />} />
        <Route
          path="/alumni/settings-privacy"
          element={<SettingsPrivacyPage />}
        />
        <Route path="/alumni/directory" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/events" element={<EventListPage />} />
        <Route path="/alumni/events/:id" element={<EventDetailsPage />} />
        <Route path="/alumni/notices" element={<NoticeListPage />} />
        <Route path="/alumni/notices/:id" element={<NoticeDetailsPage />} />
        {/* <Route path="/alumni/account" element={<AlumniAccountPage />} /> */}
        <Route path="/alumni/create" element={<AlumniFormPage />} />
        <Route path="/alumni/:id" element={<AlumniDetailsPage />} />
        <Route path="/alumni/:id/edit" element={<AlumniFormPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/alumni" element={<AlumniListPage />} />
        <Route path="/events" element={<EventListPage isAdmin />} />
        <Route path="/events/create" element={<EventFormPage />} />
        <Route path="/events/:id" element={<EventDetailsPage isAdmin />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
        <Route path="/notices" element={<NoticeListPage isAdmin />} />
        <Route path="/notices/create" element={<NoticeFormPage />} />
        <Route path="/notices/:id" element={<NoticeDetailsPage isAdmin />} />
        <Route path="/notices/:id/edit" element={<NoticeFormPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="/profile-setup"
        element={<Navigate to="/alumni/profile-setup" replace />}
      />
      <Route
        path="/settings-privacy"
        element={<Navigate to="/alumni/settings-privacy" replace />}
      />

      <Route
        path="*"
        element={
          <NotFoundPage
            homePath={
              isAuthenticated
                ? role === "ADMIN"
                  ? "/dashboard"
                  : "/alumni/dashboard"
                : "/login"
            }
          />
        }
      />
    </Routes>
  );
}

function AppTheme() {
  const colorMode = useAppSelector((s) => s.ui.theme);

  return (
    <ThemeProvider theme={createAppTheme(colorMode)}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppTheme />
    </Provider>
  );
}
