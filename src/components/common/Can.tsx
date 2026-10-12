import { useAuth } from "@/hooks/useAuth";
import type { PermissionAction } from "@/utils/authUtils";

interface CanProps {
  permission: string;
  action?: PermissionAction;
  role?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({
  permission,
  action,
  role,
  children,
  fallback = null,
}: CanProps) {
  const { hasPermission, hasRole } = useAuth();
  const allowed = hasPermission(permission, action) && (!role || hasRole(role));
  return <>{allowed ? children : fallback}</>;
}
