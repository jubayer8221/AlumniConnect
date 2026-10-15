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
  BaggageClaim,
  BadgeCheck,
  Briefcase,
  Network,
  MessageSquare,
  UserCheck,
  Compass,
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
  /** Renders as an <a href> and opens in a new tab instead of a router <Link>. */
  external?: boolean;
  /** Hidden from non-admin roles (e.g. MODERATOR). */
  adminOnly?: boolean;
  children?: NavChild[];
}

/* ============================================================
   Shared items
   ============================================================ */

const publicSiteItem: NavItem = {
  label: "Public Site",
  path: "/",
  icon: <Globe size={20} />,
  external: true,
};

const configurationItem: NavItem = {
  label: "Configuration",
  path: "/alumni/configuration",
  icon: <Settings size={20} />,
  adminOnly: true,
  children: [
    {
      label: "Landing Page",
      path: "/alumni/configuration/landing-page",
      icon: <Image size={16} />,
    },
    {
      label: "User Roles",
      path: "/alumni/configuration/user-roles",
      icon: <UserCog size={16} />,
    },
    {
      label: "Roles",
      path: "/alumni/configuration/roles",
      icon: <Shield size={16} />,
    },
    {
      label: "Verify Member",
      path: "/alumni/configuration/verify-member",
      icon: <BadgeCheck size={16} />,
    },
  ],
};

const accountItem: NavItem = {
  label: "Account",
  path: "/alumni/profile-details",
  icon: <UserCircle size={20} />,
  children: [
    {
      label: "My Profile",
      path: "/alumni/profile-details",
      icon: <UserCircle size={16} />,
    },
    {
      label: "Settings & Privacy",
      path: "/alumni/settings-privacy",
      icon: <Shield size={16} />,
    },
  ],
};

const networkItem: NavItem = {
  label: "Network",
  path: "/alumni/network",
  icon: <Network size={20} />,
  children: [
    {
      label: "Alumni Directory",
      path: "/alumni/network/directory",
      icon: <Users size={16} />,
    },
    {
      label: "My Network",
      path: "/alumni/network/my-network",
      icon: <Network size={16} />,
    },
    {
      label: "Messages",
      path: "/alumni/network/messages",
      icon: <MessageSquare size={16} />,
    },
    {
      label: "Mentorship",
      path: "/alumni/network/mentorship",
      icon: <UserCheck size={16} />,
    },
  ],
};

const exploreItem: NavItem = {
  label: "Explore",
  path: "/alumni/explore",
  icon: <Compass size={20} />,
  children: [
    {
      label: "Job Board",
      path: "/alumni/explore/job-board",
      icon: <Briefcase size={16} />,
    },
    {
      label: "Events",
      path: "/alumni/explore/events",
      icon: <CalendarDays size={16} />,
    },
    {
      label: "Notices",
      path: "/alumni/explore/notices",
      icon: <Bell size={16} />,
    },
    {
      label: "News",
      path: "/alumni/explore/news",
      icon: <Newspaper size={16} />,
    },
  ],
};

/* ============================================================
   Role-specific nav
   ============================================================ */

export const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  accountItem,
  networkItem,
  exploreItem,
  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 size={20} />,
  },
  configurationItem,
  publicSiteItem,
];

export const alumniNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/alumni/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  accountItem,
  networkItem,
  exploreItem,
  publicSiteItem,
];

export const getNavForRole = (role: string | null | undefined): NavItem[] => {
  if (role === "ADMIN") return adminNav;
  if (role === "MODERATOR") return adminNav.filter((item) => !item.adminOnly);
  return alumniNav;
};

/* ============================================================
   Breadcrumb / document-title helpers
   ============================================================ */

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

export const SEGMENT_LABELS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  registerSegments(map, adminNav);
  registerSegments(map, alumniNav);
  return map;
})();

export const ACTION_LABELS: Record<string, string> = {
  new: "Create",
  create: "Create",
  edit: "Edit",
};

export function isDynamicSegment(segment: string): boolean {
  return (
    /^\d+$/.test(segment) ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      segment,
    ) ||
    /^[0-9a-fA-F]{24,}$/.test(segment)
  );
}

export function humanize(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function labelForSegment(segment: string): string {
  return SEGMENT_LABELS[segment] ?? ACTION_LABELS[segment] ?? humanize(segment);
}
