import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { PermissionAction } from "@/utils/authUtils";
import { UserRole } from "@/types/auth";
// import type { UserRole } from "@/types/auth";

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
  const { isAuthenticated, role, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && role && !roles.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }
  if (permission && !hasPermission(permission, action)) {
    return <Navigate to={fallbackPath} replace />;
  }
  return <>{children}</>;
}
