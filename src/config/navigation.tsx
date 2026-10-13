import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  BarChart3,
  Settings,
  UserCircle,
  Shield,
  Globe,
  Newspaper,
  Image,
  UserCog,
} from "lucide-react";

export interface NavChild {
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  external?: boolean;
  children?: NavChild[];
}

const publicSiteItem: NavItem = {
  label: "Public Site",
  path: "/",
  icon: <Globe size={20} />,
  external: true,
};

export const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Profile",
    path: "/alumni/profile",
    icon: <UserCircle size={20} />,
    children: [
      {
        label: "My Profile",
        path: "/alumni/profile",
        icon: <UserCircle size={16} />,
      },
      {
        label: "Settings & Privacy",
        path: "/alumni/settings-privacy",
        icon: <Shield size={16} />,
      },
    ],
  },
  {
    label: "Alumni Directory",
    path: "/alumni/directory",
    icon: <Users size={20} />,
  },
  {
    label: "User Roles",
    path: "/alumni/user-roles",
    icon: <UserCog size={20} />,
  },
  {
    label: "Landing Page",
    path: "/alumni/landing",
    icon: <Image size={20} />,
  },
  {
    label: "Events",
    path: "/alumni/events",
    icon: <CalendarDays size={20} />,
  },
  {
    label: "Notices",
    path: "/alumni/notices",
    icon: <Bell size={20} />,
  },
  {
    label: "News",
    path: "/alumni/news",
    icon: <Newspaper size={20} />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
  publicSiteItem,
];

export const alumniNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/alumni/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Profile",
    path: "/alumni/profile",
    icon: <UserCircle size={20} />,
    children: [
      {
        label: "My Profile",
        path: "/alumni/profile",
        icon: <UserCircle size={16} />,
      },
      {
        label: "Settings & Privacy",
        path: "/alumni/settings-privacy",
        icon: <Shield size={16} />,
      },
    ],
  },
  {
    label: "Alumni Directory",
    path: "/alumni/directory",
    icon: <Users size={20} />,
  },
  {
    label: "Events",
    path: "/alumni/events",
    icon: <CalendarDays size={20} />,
  },
  {
    label: "Notices",
    path: "/alumni/notices",
    icon: <Bell size={20} />,
  },
  {
    label: "News",
    path: "/alumni/news",
    icon: <Newspaper size={20} />,
  },
  publicSiteItem,
];

export const getNavForRole = (role: string | null | undefined): NavItem[] => {
  if (role === "ADMIN") return adminNav;
  if (role === "MODERATOR") {
    return adminNav.filter(
      (item) => item.path !== "/alumni/user-roles" && item.path !== "/settings",
    );
  }
  return alumniNav;
};

/* ============================================================
   Breadcrumb / document-title helpers
   ============================================================ */

/** Walk a nav tree and register its last path segment → label. */
function registerSegments(map: Record<string, string>, items: NavItem[]) {
  for (const item of items) {
    const last = item.path.split("/").filter(Boolean).pop();
    if (last) map[last] = item.label;
    item.children?.forEach((child) => {
      const childLast = child.path.split("/").filter(Boolean).pop();
      if (childLast) map[childLast] = child.label;
    });
  }
}

/**
 * Segment → label map derived from both nav trees.
 * e.g. "events" → "Events", "settings-privacy" → "Settings & Privacy"
 */
export const SEGMENT_LABELS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  registerSegments(map, adminNav);
  registerSegments(map, alumniNav);
  return map;
})();

/** URL action suffixes that are not pages. */
export const ACTION_LABELS: Record<string, string> = {
  new: "Create",
  create: "Create",
  edit: "Edit",
};

/** A segment is dynamic if it looks like an id (numeric, GUID, long hex). */
export function isDynamicSegment(segment: string): boolean {
  return (
    /^\d+$/.test(segment) ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      segment,
    ) ||
    /^[0-9a-fA-F]{24,}$/.test(segment)
  );
}

/** "profile-setup" → "Profile Setup" */
export function humanize(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Resolve a label for a non-dynamic URL segment. */
export function labelForSegment(segment: string): string {
  return SEGMENT_LABELS[segment] ?? ACTION_LABELS[segment] ?? humanize(segment);
}
