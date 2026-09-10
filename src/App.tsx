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
import { ToastContainer, CommonLoading } from "@/components/common";

import LoginPage from "@/app/LoginPage";
import UnauthorizedPage from "@/app/UnauthorizedPage";
import AdminDashboardPage from "@/app/AdminDashboardPage";
import AlumniListPage from "@/app/AlumniListPage";
import AlumniFormPage from "@/app/AlumniFormPage";
import AlumniDetailsPage from "@/app/AlumniDetailsPage";
import AlumniDashboardPage from "@/app/AlumniDashboardPage";
import AlumniProfilePage from "@/app/AlumniProfilePage";
import ProfileSetupPage from "@/app/ProfileSetupPage";
import SettingsPrivacyPage from "@/app/SettingsPrivacyPage";
import AlumniDirectoryPage from "@/app/AlumniDirectoryPage";
import AlumniAccountPage from "@/app/AlumniAccountPage";
import EventListPage from "@/app/EventListPage";
import EventDetailsPage from "@/app/EventDetailsPage";
import EventFormPage from "@/app/EventFormPage";
import NoticeListPage from "@/app/NoticeListPage";
import NoticeDetailsPage from "@/app/NoticeDetailsPage";
import NoticeFormPage from "@/app/NoticeFormPage";
import ReportsPage from "@/app/ReportsPage";
import SettingsPage from "@/app/SettingsPage";

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
        <Route path="/alumni/create" element={<AlumniFormPage />} />
        <Route path="/alumni/:id" element={<AlumniDetailsPage />} />
        <Route path="/alumni/:id/edit" element={<AlumniFormPage />} />
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
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/settings-privacy" element={<SettingsPrivacyPage />} />
        <Route path="/alumni/dashboard" element={<AlumniDashboardPage />} />
        <Route path="/alumni/profile" element={<AlumniProfilePage />} />
        <Route path="/alumni/profile-setup" element={<ProfileSetupPage />} />
        <Route
          path="/alumni/settings-privacy"
          element={<SettingsPrivacyPage />}
        />
        <Route path="/alumni/directory" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/account" element={<AlumniAccountPage />} />
        <Route path="/alumni/events" element={<EventListPage />} />
        <Route path="/alumni/events/:id" element={<EventDetailsPage />} />
        <Route path="/alumni/notices" element={<NoticeListPage />} />
        <Route path="/alumni/notices/:id" element={<NoticeDetailsPage />} />
      </Route>

      {/* Alumni routes */}
      <Route
        element={
          <ProtectedRoute roles={["ALUMNI"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/alumni/dashboard" element={<AlumniDashboardPage />} />
        <Route path="/alumni/profile" element={<AlumniProfilePage />} />
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
        <Route path="/alumni/account" element={<AlumniAccountPage />} />
        <Route path="/alumni/create" element={<AlumniFormPage />} />
        <Route path="/alumni/:id" element={<AlumniDetailsPage />} />
        <Route path="/alumni/:id/edit" element={<AlumniFormPage />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? role === "ADMIN"
                  ? "/dashboard"
                  : "/alumni/dashboard"
                : "/login"
            }
            replace
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
