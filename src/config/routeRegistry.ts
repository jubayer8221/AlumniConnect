import { matchPath } from "react-router-dom";

export type RouteRole = "admin" | "alumni";

export interface RouteDescriptor {
  pattern: string;
  label: string;
  parentPattern?: string;
  dynamic?: boolean;
  roles?: RouteRole[];
}

export const routeRegistry: RouteDescriptor[] = [
  { pattern: "/", label: "Home" },
  { pattern: "/login", label: "Login" },
  { pattern: "/unauthorized", label: "Unauthorized" },
  {
    pattern: "/alumni/dashboard",
    label: "Dashboard",
    roles: ["admin", "alumni"],
  },
  { pattern: "/alumni/profile", label: "Profile", roles: ["admin", "alumni"] },
  {
    pattern: "/alumni/profile-setup",
    label: "Profile Setup",
    roles: ["admin", "alumni"],
  },
  {
    pattern: "/alumni/settings-privacy",
    label: "Settings & Privacy",
    roles: ["admin", "alumni"],
  },
  {
    pattern: "/alumni/directory",
    label: "Alumni Directory",
    roles: ["admin", "alumni"],
  },
  { pattern: "/alumni/events", label: "Events", roles: ["admin", "alumni"] },
  {
    pattern: "/alumni/events/:id",
    label: "Event",
    parentPattern: "/alumni/events",
    dynamic: true,
    roles: ["admin", "alumni"],
  },
  { pattern: "/alumni/notices", label: "Notices", roles: ["admin", "alumni"] },
  {
    pattern: "/alumni/notices/:id",
    label: "Notice",
    parentPattern: "/alumni/notices",
    dynamic: true,
    roles: ["admin", "alumni"],
  },
  //   {
  //     pattern: "/alumni/account",
  //     label: "My Account",
  //     roles: ["admin", "alumni"],
  //   },
  {
    pattern: "/alumni/create",
    label: "Create Alumni",
    parentPattern: "/alumni",
    roles: ["admin", "alumni"],
  },
  {
    pattern: "/alumni/:id/edit",
    label: "Edit Alumni",
    parentPattern: "/alumni/:id",
    dynamic: true,
    roles: ["admin", "alumni"],
  },
  {
    pattern: "/alumni/:id",
    label: "Alumni",
    parentPattern: "/alumni",
    dynamic: true,
    roles: ["admin", "alumni"],
  },
  { pattern: "/dashboard", label: "Dashboard", roles: ["admin"] },
  { pattern: "/alumni", label: "Manage Alumni", roles: ["admin"] },
  { pattern: "/events", label: "Events", roles: ["admin"] },
  {
    pattern: "/events/create",
    label: "Create Event",
    parentPattern: "/events",
    roles: ["admin"],
  },
  {
    pattern: "/events/:id/edit",
    label: "Edit Event",
    parentPattern: "/events/:id",
    dynamic: true,
    roles: ["admin"],
  },
  {
    pattern: "/events/:id",
    label: "Event",
    parentPattern: "/events",
    dynamic: true,
    roles: ["admin"],
  },
  { pattern: "/notices", label: "Notices", roles: ["admin"] },
  {
    pattern: "/notices/create",
    label: "Create Notice",
    parentPattern: "/notices",
    roles: ["admin"],
  },
  {
    pattern: "/notices/:id/edit",
    label: "Edit Notice",
    parentPattern: "/notices/:id",
    dynamic: true,
    roles: ["admin"],
  },
  {
    pattern: "/notices/:id",
    label: "Notice",
    parentPattern: "/notices",
    dynamic: true,
    roles: ["admin"],
  },
  { pattern: "/reports", label: "Reports", roles: ["admin"] },
  { pattern: "/settings", label: "Settings", roles: ["admin"] },
  { pattern: "*", label: "Not Found" },
];

export function matchRoute(pathname: string): RouteDescriptor | undefined {
  return routeRegistry.find((route) =>
    matchPath({ path: route.pattern, end: true }, pathname),
  );
}

export function getRouteLabel(pathname: string, fallback = pathname): string {
  return matchRoute(pathname)?.label ?? fallback;
}
