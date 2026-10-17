import { lazy, Suspense, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { store } from "@/store/store";
import { createAppTheme } from "@/store/theme";
import { colors } from "@/theme/colors";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { hasAdminAccess } from "@/utils/authUtils";
import ToastContainer from "@/components/common/Toast";

import { useAppSelector } from "./hooks/useAppDispatch";
import LandingPage from "./components/landingPage/LandingPage";
import MomentsGallery from "./components/LandingContent/MomentsGallery";

const PrivacyPolicyPage = lazy(
  () => import("@/components/landingPage/PrivacyPolicyPage"),
);
const TermsOfServicePage = lazy(
  () => import("@/components/landingPage/TermsOfServicePage"),
);
const CookiePolicyPage = lazy(
  () => import("@/components/landingPage/CookiePolicyPage"),
);
const NotFoundPage = lazy(() => import("@/components/common/NotFoundPage"));
const ForgotPasswordPage = lazy(
  () => import("./components/login/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("./components/login/ResetPasswordPage"),
);

const AppLayout = lazy(() => import("@/components/layout/AppLayout"));
const LoginPage = lazy(() => import("@/components/login/LoginPage"));
const SignUpPage = lazy(() => import("@/components/login/SignUpPage"));
const UnauthorizedPage = lazy(
  () => import("@/components/common/UnauthorizedPage"),
);
const AdminDashboardPage = lazy(
  () => import("@/components/dashboard/AdminDashboardPage"),
);
const AlumniListPage = lazy(
  () => import("@/components/alumniProfile/AlumniListPage"),
);
const AlumniFormPage = lazy(
  () => import("@/components/alumniProfile/AlumniFormPage"),
);
const AlumniDetailsPage = lazy(
  () => import("@/components/alumniProfile/AlumniDetailsPage"),
);
const AlumniDashboardPage = lazy(
  () => import("@/components/dashboard/AlumniDashboardPage"),
);
const ProfileSetupPage = lazy(
  () => import("@/components/alumniProfile/ProfileSetupPage"),
);
const SettingsPrivacyPage = lazy(
  () => import("@/components/alumniProfile/SettingsPrivacyPage"),
);
const AlumniDirectoryPage = lazy(
  () => import("@/components/alumniProfile/AlumniDirectoryPage"),
);
const AlumniAccountPage = lazy(
  () => import("@/components/alumniProfile/AlumniAccountPage"),
);
const EventListPage = lazy(() => import("@/components/event/EventListPage"));
const EventDetailsPage = lazy(
  () => import("@/components/event/EventDetailsPage"),
);
const EventFormPage = lazy(() => import("@/components/event/EventFormPage"));
const NoticeListPage = lazy(() => import("@/components/notice/NoticeListPage"));
const NoticeDetailsPage = lazy(
  () => import("@/components/notice/NoticeDetailsPage"),
);
const NoticeFormPage = lazy(() => import("@/components/notice/NoticeFormPage"));
const ReportsPage = lazy(() => import("@/components/report/ReportsPage"));
const SettingsPage = lazy(() => import("@/components/settings/SettingsPage"));
const UserRoleManagementPage = lazy(
  () => import("@/components/settings/UserRoleManagementPage"),
);
const PublicEventsListPage = lazy(
  () => import("./components/landingPage/event/PublicEventsListPage"),
);
const PublicEventDetailsPage = lazy(
  () => import("./components/landingPage/event/PublicEventDetailsPage"),
);
const AboutPage = lazy(
  () => import("./components/landingPage/about/AboutPage"),
);
const PublicNewsListPage = lazy(
  () => import("./components/landingPage/PublicNewsListPage"),
);
const NewsListPage = lazy(() => import("./components/news/NewsListPage"));
const NewsFormPage = lazy(() => import("./components/news/NewsFormPage"));
const LandingContentPage = lazy(
  () => import("./components/LandingContent/LandingContentPage"),
);
const HeroSlideFormPage = lazy(
  () => import("./components/LandingContent/HeroSlideFormPage"),
);
const GalleryPhotoFormPage = lazy(
  () => import("./components/LandingContent/GalleryPhotoFormPage"),
);
const PublicGalleryPage = lazy(
  () => import("./components/landingPage/PublicGalleryPage"),
);
const PublicNewsDetailsPage = lazy(
  () => import("./components/landingPage/PublicNewsDetailsPage"),
);
const PublicMentorshipPage = lazy(
  () => import("./components/landingPage/PublicMentorshipPage"),
);
const MentorshipPage = lazy(
  () => import("./components/mentorship/MentorshipPage"),
);
const RolesPage = lazy(() => import("./components/configuration/RolesPage"));
const VerifyMemberPage = lazy(
  () => import("./components/configuration/VerifyMemberPage"),
);
const MyNetworkPage = lazy(() => import("./components/network/MyNetworkPage"));
const MessagesPage = lazy(() => import("./components/messages/MessagesPage"));
const JobBoardPage = lazy(() => import("./components/job/JobBoardPage"));
const JobFormPage = lazy(() => import("./components/job/JobFormPage"));
const PublicActivitiesPage = lazy(
  () => import("./components/landingPage/PublicActivitiesPage"),
);
const PublicActivityDetailsPage = lazy(
  () => import("./components/landingPage/PublicActivityDetailsPage"),
);
const PublicJobsListPage = lazy(
  () => import("./components/landingPage/PublicJobsListPage"),
);
const PublicJobDetailsPage = lazy(
  () => import("./components/landingPage/PublicJobDetailsPage"),
);

function LegacyAlumniProfileRedirect({ edit = false }: { edit?: boolean }) {
  const { id } = useParams();
  if (!id) return <Navigate to="/alumni/network/directory" replace />;
  return (
    <Navigate
      to={`/alumni/profile-details/${id}${edit ? "/edit" : ""}`}
      replace
    />
  );
}

function ScrollToTopOnPathChange() {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      previousPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.authUser);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role ?? null;

  const homePath = hasAdminAccess(role) ? "/dashboard" : "/alumni/dashboard";

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress aria-label="Loading page" />
        </Box>
      }
    >
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<PublicEventsListPage />} />
        <Route path="/events/:id" element={<PublicEventDetailsPage />} />
        <Route path="/news" element={<PublicNewsListPage />} />
        <Route path="/news/:id" element={<PublicNewsDetailsPage />} />
        <Route path="/news/:id/:slug" element={<PublicNewsDetailsPage />} />
        <Route path="/gallery" element={<PublicGalleryPage />} />
        <Route path="/mentorship" element={<PublicMentorshipPage />} />
        <Route path="/activities" element={<PublicActivitiesPage />} />
        <Route path="/activities/:id" element={<PublicActivityDetailsPage />} />
        <Route path="/jobs" element={<PublicJobsListPage />} />
        <Route path="/jobs/:id" element={<PublicJobDetailsPage />} />

        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />

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
            <ProtectedRoute roles={["ADMIN", "MODERATOR", "ALUMNI"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/alumni/dashboard" element={<AlumniDashboardPage />} />
          <Route
            path="/alumni/profile-details"
            element={<AlumniDetailsPage />}
          />
          <Route
            path="/alumni/profile-details/edit"
            element={<ProfileSetupPage />}
          />
          <Route
            path="/alumni/profile-details/:id"
            element={<AlumniDetailsPage />}
          />
          <Route
            path="/alumni/profile-details/:id/edit"
            element={<AlumniFormPage />}
          />
          <Route
            path="/alumni/profile"
            element={<Navigate to="/alumni/profile-details" replace />}
          />
          <Route
            path="/alumni/profile-setup"
            element={<Navigate to="/alumni/profile-details/edit" replace />}
          />
          <Route
            path="/alumni/settings-privacy"
            element={<SettingsPrivacyPage />}
          />
          <Route path="/alumni/settings" element={<SettingsPage />} />
          <Route
            path="/alumni/network/directory"
            element={<AlumniDirectoryPage />}
          />
          <Route
            path="/alumni/network/my-network"
            element={<MyNetworkPage />}
          />
          <Route path="/alumni/network/messages" element={<MessagesPage />} />
          <Route
            path="/alumni/network/mentorship"
            element={<MentorshipPage />}
          />
          <Route path="/alumni/account" element={<AlumniAccountPage />} />
          <Route path="/alumni/new" element={<AlumniFormPage />} />
          <Route
            path="/alumni/create"
            element={<Navigate to="/alumni/new" replace />}
          />
          <Route path="/alumni/:id" element={<LegacyAlumniProfileRedirect />} />
          <Route
            path="/alumni/:id/edit"
            element={<LegacyAlumniProfileRedirect edit />}
          />
          <Route path="/alumni/explore/events" element={<EventListPage />} />
          <Route
            path="/alumni/explore/events/:id"
            element={<EventDetailsPage />}
          />
          <Route path="/alumni/explore/news" element={<NewsListPage />} />
          <Route path="/alumni/explore/notices" element={<NoticeListPage />} />
          <Route
            path="/alumni/explore/notices/:id"
            element={<NoticeDetailsPage />}
          />
          <Route path="/alumni/explore/job-board" element={<JobBoardPage />} />
        </Route>

        {/* ---------- Admin only ---------- */}
        <Route
          element={
            <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/alumni" element={<AlumniListPage />} />

          {/* Configuration */}
          <Route
            path="/alumni/configuration/landing-page"
            element={<LandingContentPage />}
          />
          <Route path="/alumni/explore/gallery" element={<MomentsGallery />} />
          <Route
            path="/alumni/explore/gallery/new"
            element={<GalleryPhotoFormPage />}
          />
          <Route
            path="/alumni/explore/gallery/:id"
            element={<GalleryPhotoFormPage />}
          />
          <Route
            path="/alumni/configuration/landing-page/slides/new"
            element={<HeroSlideFormPage />}
          />
          <Route
            path="/alumni/configuration/landing-page/slides/:id"
            element={<HeroSlideFormPage />}
          />
          <Route
            path="/alumni/configuration/user-roles"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <UserRoleManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni/configuration/roles"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni/configuration/verify-member"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <VerifyMemberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni/user-roles"
            element={<Navigate to="/alumni/configuration/user-roles" replace />}
          />

          {/* Job Board (admin/moderator) */}
          <Route
            path="/alumni/explore/job-board/new"
            element={<JobFormPage />}
          />
          <Route
            path="/alumni/explore/job-board/:id/edit"
            element={<JobFormPage />}
          />

          {/* Event create / edit */}
          <Route
            path="/alumni/explore/events/new"
            element={<EventFormPage />}
          />
          <Route
            path="/alumni/explore/events/create"
            element={<Navigate to="/alumni/explore/events/new" replace />}
          />
          <Route
            path="/alumni/explore/events/:id/edit"
            element={<EventFormPage />}
          />

          {/* News create / edit */}
          <Route
            path="/alumni/explore/news/create"
            element={<NewsFormPage />}
          />
          <Route
            path="/alumni/explore/news/edit/:id"
            element={<NewsFormPage />}
          />

          {/* Notices admin */}
          <Route
            path="/alumni/explore/notices/create"
            element={<NoticeFormPage />}
          />
          <Route
            path="/alumni/explore/notices/:id/edit"
            element={<NoticeFormPage />}
          />

          <Route path="/reports" element={<ReportsPage />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ---------- Redirects ---------- */}
        <Route
          path="/profile-setup"
          element={<Navigate to="/alumni/profile-details/edit" replace />}
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
    </Suspense>
  );
}

function AppTheme() {
  const colorMode = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", colors.primary);
  }, []);

  return (
    <ThemeProvider theme={createAppTheme(colorMode)}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTopOnPathChange />
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
