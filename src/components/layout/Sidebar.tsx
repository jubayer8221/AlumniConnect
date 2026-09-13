import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  UserCircle,
  Briefcase,
  ChevronDown,
  Shield,
  FileText,
  ListIcon,
} from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { logoutAsync } from "@/Slice/authSlice";
import { appConfig } from "@/config/appConfig";
import HeaderProfileDialog from "../alumniProfile/HeaderProfileDialog";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: {
    label: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

const adminNav: NavItem[] = [
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
      // {
      //   label: "Profile Setup",
      //   path: "/alumni/profile-setup",
      //   icon: <FileText size={16} />,
      // },

      // {
      //   label: "Alumni Directory",
      //   path: "/alumni/directory",
      //   icon: <Users size={16} />,
      // },
      {
        label: "Settings & Privacy",
        path: "/alumni/settings-privacy",
        icon: <Shield size={16} />,
      },
    ],
  },
  {
    label: "Alumni All",
    path: "/alumni/directory",
    // path: "/alumni",
    icon: <ListIcon size={16} />,
  },
  {
    label: "Events",
    path: "/events",
    icon: <CalendarDays size={20} />,
  },
  {
    label: "Notices",
    path: "/notices",
    icon: <Bell size={20} />,
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
];

const alumniNav: NavItem[] = [
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
      {
        label: "All Alumni",
        path: "/alumni/directory",
        icon: <Users size={16} />,
      },
    ],
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
    label: "My Account",
    path: "/alumni/account",
    icon: <Briefcase size={20} />,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { role, user } = useAppSelector((s) => s.auth);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  // HeaderProfileDialog state
  const [openDialog, setopenDialog] = useState<HTMLElement | null>(null);

  const navItems = role === "ADMIN" ? adminNav : alumniNav;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/dashboard" &&
      path !== "/alumni/dashboard" &&
      path !== "/alumni/profile" &&
      path !== "/alumni" &&
      location.pathname.startsWith(path));

  // For items with children, auto-expand if any child is active
  const initialExpanded = navItems
    .filter((item) =>
      item.children?.some(
        (c) =>
          location.pathname === c.path ||
          (c.path !== "/alumni" && location.pathname.startsWith(c.path)),
      ),
    )
    .map((item) => item.path);

  const [expanded, setExpanded] = useState<string[]>(initialExpanded);

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.path);
    const hasChildren = !!item.children;
    const isExpanded = expanded.includes(item.path);

    if (hasChildren && !collapsed) {
      return (
        <Box key={item.path}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => toggleExpand(item.path)}
              sx={{
                borderRadius: 10,
                py: 1.25,
                px: 1.5,
                minHeight: 44,
                color: active ? "white" : "rgba(255,255,255,0.6)",
                background: active
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "transparent",
                boxShadow: active
                  ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: active
                    ? "rgba(99,102,241,0.8)"
                    : "rgba(255,255,255,0.08)",
                  color: "white",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    },
                  },
                }}
              />

              <ChevronDown
                size={16}
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </ListItemButton>
          </ListItem>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List
              disablePadding
              sx={{
                pl: 3,
                mb: 0.5,
              }}
            >
              {item.children!.map((child) => {
                const childActive = location.pathname === child.path;

                return (
                  <ListItem key={child.path} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={child.path}
                      selected={childActive}
                      sx={{
                        borderRadius: 8,
                        py: 0.75,
                        px: 2,
                        minHeight: 36,
                        color: childActive
                          ? "#a5b4fc"
                          : "rgba(255,255,255,0.5)",
                        "&.Mui-selected": {
                          bgcolor: "rgba(99,102,241,0.15)",
                        },
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.06)",
                          color: "white",
                        },
                      }}
                    >
                      {child.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 28,
                            color: "inherit",
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                      )}

                      <ListItemText
                        primary={child.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: "0.8rem",
                              fontWeight: 500,
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={active}
          sx={{
            borderRadius: 10,
            py: 1.25,
            px: collapsed ? 1 : 1.5,
            minHeight: 44,
            justifyContent: collapsed ? "center" : "flex-start",
            color: active ? "white" : "rgba(255,255,255,0.6)",
            background: active
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "transparent",
            boxShadow: active ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: active
                ? "rgba(99,102,241,0.8)"
                : "rgba(255,255,255,0.08)",
              color: "white",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 36,
              color: "inherit",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  },
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 264,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        bgcolor: "primary.dark",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: collapsed ? 2 : 2.5,
          minHeight: 72,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
          }}
        >
          <GraduationCap size={22} color="white" />
        </Box>

        {!collapsed && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "white",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {appConfig.appName}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.5)",
                mt: 0.25,
              }}
            >
              {appConfig.institutionShortName}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          py: 1,
          px: collapsed ? 1 : 1.5,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navItems.map(renderNavItem)}
      </List>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      />

      {/* Bottom Section */}
      <Box sx={{ p: collapsed ? 1.5 : 2 }}>
        {/* User Profile */}
        {user && (
          <Box
            onClick={(e) => setopenDialog(e.currentTarget)}
            sx={{
              my: 0.5,
              px: collapsed ? 0 : 1.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 1,
              cursor: "pointer",
              borderRadius: 2,
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "rgba(99,102,241,0.3)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </Avatar>

            {!collapsed && (
              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.displayName || user.username}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.4)",
                    mt: 0.25,
                  }}
                >
                  {role === "ADMIN" ? "Administrator" : "Alumni Member"}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Profile Dialog */}
      <HeaderProfileDialog
        anchorEl={openDialog}
        onClose={() => setopenDialog(null)}
        username={user?.username}
      />
    </Box>
  );
}
