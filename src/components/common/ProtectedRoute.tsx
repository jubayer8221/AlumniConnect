import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && role && !roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}
