// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import type { PermissionAction } from "@/utils/authUtils";
// import { UserRole } from "@/types/auth";
// // import type { UserRole } from "@/types/auth";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   roles?: UserRole[];
//   permission?: string;
//   action?: PermissionAction;
//   fallbackPath?: string;
// }

// export default function ProtectedRoute({
//   children,
//   roles,
//   permission,
//   action,
//   fallbackPath = "/unauthorized",
// }: ProtectedRouteProps) {
//   const { isAuthenticated, role, hasPermission } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }
//   if (roles && role && !roles.includes(role)) {
//     return <Navigate to={fallbackPath} replace />;
//   }
//   if (permission && !hasPermission(permission, action)) {
//     return <Navigate to={fallbackPath} replace />;
//   }
//   return <>{children}</>;
// }

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { PermissionAction } from "@/utils/authUtils";
import { UserRole } from "@/types/auth";
// import UnauthorizedPage from "@/pages/UnauthorizedPage";
import CommonLoading from "@/components/common/CommonLoading";
import UnauthorizedPage from "./UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permission?: string;
  action?: PermissionAction;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  roles,
  permission,
  action,
  fallbackPath = "/unauthorized",
}: ProtectedRouteProps) {
  const { isAuthenticated, role, hasPermission, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth state to finish rehydrating before deciding anything.
  if (loading) {
    return <CommonLoading fullHeight />;
  }

  // 2. Not logged in → go to login, remembering where they were headed.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 3. Role check — treats a missing role as unauthorized when roles are required.
  if (roles && (!role || !roles.includes(role))) {
    return renderFallback(fallbackPath, location);
  }

  // 4. Permission check (action defaults to whatever useAuth decides).
  if (permission && !hasPermission(permission, action)) {
    return renderFallback(fallbackPath, location);
  }

  return <>{children}</>;
}

function renderFallback(
  fallbackPath: string,
  location: ReturnType<typeof useLocation>,
) {
  if (fallbackPath === "/unauthorized") {
    return <UnauthorizedPage />;
  }
  return (
    <Navigate to={fallbackPath} replace state={{ from: location.pathname }} />
  );
}
