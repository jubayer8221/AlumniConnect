import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store/store";
import { createAppTheme } from "@/store/theme";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ToastContainer, NotFoundPage } from "@/components/common";

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
import AlumniAccountPage from "@/components/alumniProfile/AlumniAccountPage";
import EventListPage from "@/components/event/EventListPage";
import EventDetailsPage from "@/components/event/EventDetailsPage";
import EventFormPage from "@/components/event/EventFormPage";
import NoticeListPage from "@/components/notice/NoticeListPage";
import NoticeDetailsPage from "@/components/notice/NoticeDetailsPage";
import NoticeFormPage from "@/components/notice/NoticeFormPage";
import ReportsPage from "@/components/report/ReportsPage";
import SettingsPage from "@/components/settings/SettingsPage";
import { useAppDispatch, useAppSelector } from "./hooks/useAppDispatch";
import LandingPage from "./components/landingPage/LandingPage";
import PublicEventsListPage from "./components/landingPage/event/PublicEventsListPage";
import PublicEventDetailsPage from "./components/landingPage/event/PublicEventDetailsPage";
import AboutPage from "./components/landingPage/about/AboutPage";
import PublicNewsListPage from "./components/landingPage/PublicNewsListPage";
import NewsListPage from "./components/news/NewsListPage";
import NewsFormPage from "./components/news/NewsFormPage";
import LandingContentPage from "./components/LandingContent/LandingContentPage";
import HeroSlideFormPage from "./components/LandingContent/HeroSlideFormPage";
import GalleryPhotoFormPage from "./components/LandingContent/GalleryPhotoFormPage";
import PublicGalleryPage from "./components/landingPage/PublicGalleryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function AppRoutes() {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.authUser);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role ?? null;

  const homePath = role === "ADMIN" ? "/dashboard" : "/alumni/dashboard";

  useEffect(() => {
    if (!isAuthenticated) queryClient.clear();
  }, [isAuthenticated]);

  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/events" element={<PublicEventsListPage />} />
      <Route path="/events/:id" element={<PublicEventDetailsPage />} />
      <Route path="/news" element={<PublicNewsListPage />} />
      <Route path="/gallery" element={<PublicGalleryPage />} />

      {/* <Route path="/news/:id" element={<PublicEventDetailsPage />} /> */}

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={homePath} replace /> : <LoginPage />
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ---------- Alumni + Admin (shared app shell) ---------- */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN", "ALUMNI"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Alumni home / profile */}
        <Route path="/alumni/dashboard" element={<AlumniDashboardPage />} />
        <Route path="/alumni/profile" element={<AlumniDetailsPage />} />
        <Route path="/alumni/profile-setup" element={<ProfileSetupPage />} />
        <Route
          path="/alumni/settings-privacy"
          element={<SettingsPrivacyPage />}
        />
        <Route path="/alumni/directory" element={<AlumniDirectoryPage />} />
        <Route path="/alumni/account" element={<AlumniAccountPage />} />
        <Route path="/alumni/new" element={<AlumniFormPage />} />
        <Route
          path="/alumni/create"
          element={<Navigate to="/alumni/new" replace />}
        />
        <Route path="/alumni/:id" element={<AlumniDetailsPage />} />
        <Route path="/alumni/:id/edit" element={<AlumniFormPage />} />
        <Route path="/alumni/events" element={<EventListPage />} />
        <Route path="/alumni/events/:id" element={<EventDetailsPage />} />
        <Route path="/alumni/news" element={<NewsListPage />} />
        <Route path="/alumni/news" element={<NewsListPage />} />
        <Route path="/alumni/news/create" element={<NewsFormPage />} />
        <Route path="/alumni/news/edit/:id" element={<NewsFormPage />} />
        <Route
          path="/alumni/landing/gallery/new"
          element={<GalleryPhotoFormPage />}
        />
        <Route
          path="/alumni/landing/gallery/:id"
          element={<GalleryPhotoFormPage />}
        />

        <Route path="/alumni/landing" element={<LandingContentPage />} />
        <Route
          path="/alumni/landing/slides/new"
          element={<HeroSlideFormPage />}
        />
        <Route
          path="/alumni/landing/slides/:id"
          element={<HeroSlideFormPage />}
        />
        <Route path="/alumni/notices" element={<NoticeListPage />} />
        <Route path="/alumni/notices/:id" element={<NoticeDetailsPage />} />
      </Route>

      {/* ---------- Admin only ---------- */}
      <Route
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/alumni" element={<AlumniListPage />} />

        {/* Event create / edit — admin only */}
        <Route path="/alumni/events/new" element={<EventFormPage />} />
        <Route
          path="/alumni/events/create"
          element={<Navigate to="/alumni/events/new" replace />}
        />
        <Route path="/alumni/events/:id/edit" element={<EventFormPage />} />

        {/* Notices — admin */}
        <Route path="/notices" element={<NoticeListPage isAdmin />} />
        <Route path="/notices/create" element={<NoticeFormPage />} />
        <Route path="/notices/:id" element={<NoticeDetailsPage isAdmin />} />
        <Route path="/notices/:id/edit" element={<NoticeFormPage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* ---------- Redirects ---------- */}
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
        element={<NotFoundPage homePath={isAuthenticated ? homePath : "/"} />}
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
      <QueryClientProvider client={queryClient}>
        <AppTheme />
      </QueryClientProvider>
    </Provider>
  );
}
