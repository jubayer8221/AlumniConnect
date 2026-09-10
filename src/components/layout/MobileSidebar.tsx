import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
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
} from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { logoutAsync } from "@/Slice/authSlice";
import { closeMobileSidebar } from "@/Slice/uiSlice";
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
    icon: <LayoutDashboard size={22} />,
  },
  {
    label: "Alumni",
    path: "/alumni",
    icon: <Users size={22} />,
    children: [
      {
        label: "All Alumni",
        path: "/alumni",
      },
      {
        label: "Profile Setup",
        path: "/alumni/profile-setup",
        icon: <FileText size={16} />,
      },
      {
        label: "Settings & Privacy",
        path: "/alumni/settings-privacy",
        icon: <Shield size={16} />,
      },
      {
        label: "Alumni Directory",
        path: "/alumni/directory",
        icon: <Users size={16} />,
      },
    ],
  },
  {
    label: "Profile Setup",
    path: "/profile-setup",
    icon: <FileText size={22} />,
  },
  {
    label: "Settings & Privacy",
    path: "/settings-privacy",
    icon: <Shield size={22} />,
  },
  {
    label: "Events",
    path: "/events",
    icon: <CalendarDays size={22} />,
  },
  {
    label: "Notices",
    path: "/notices",
    icon: <Bell size={22} />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 size={22} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings size={22} />,
  },
];

const alumniNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/alumni/dashboard",
    icon: <LayoutDashboard size={22} />,
  },
  {
    label: "Profile",
    path: "/alumni/profile",
    icon: <UserCircle size={22} />,
    children: [
      {
        label: "Profile Setup",
        path: "/alumni/profile-setup",
        icon: <FileText size={16} />,
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
    icon: <CalendarDays size={22} />,
  },
  {
    label: "Notices",
    path: "/alumni/notices",
    icon: <Bell size={22} />,
  },
  {
    label: "My Account",
    path: "/alumni/account",
    icon: <Briefcase size={22} />,
  },
];

export default function MobileSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { role, user } = useAppSelector((s) => s.auth);
  const mobileOpen = useAppSelector((s) => s.ui.mobileSidebarOpen);

  // Controls the HeaderProfileDialog
  const [openDialog, setopenDialog] = useState<HTMLElement | null>(null);

  const navItems = role === "ADMIN" ? adminNav : alumniNav;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/dashboard" &&
      path !== "/alumni/dashboard" &&
      path !== "/alumni/profile" &&
      path !== "/alumni" &&
      location.pathname.startsWith(path));

  const initialExpanded = navItems
    .filter((item) => item.children?.some((c) => location.pathname === c.path))
    .map((item) => item.path);

  const [expanded, setExpanded] = useState<string[]>(initialExpanded);

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  return (
    <Drawer
      open={mobileOpen}
      onClose={() => dispatch(closeMobileSidebar())}
      disableScrollLock
      slotProps={{
        paper: {
          sx: {
            width: 280,
            bgcolor: "primary.dark",
          },
        },
      }}
    >
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo / Application Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2.5,
            minHeight: 72,
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
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            <GraduationCap size={22} color="white" />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {appConfig.appName}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {appConfig.institutionName}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Navigation */}
        <List
          sx={{
            flex: 1,
            py: 1.5,
            px: 1.5,
            overflowY: "auto",
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            const hasChildren = !!item.children;
            const isExpanded = expanded.includes(item.path);

            if (hasChildren) {
              return (
                <Box key={item.path}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => toggleExpand(item.path)}
                      sx={{
                        borderRadius: 10,
                        py: 1.25,
                        px: 1.5,
                        minHeight: 48,
                        color: active ? "white" : "rgba(255,255,255,0.6)",
                        background: active
                          ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                          : "transparent",
                        boxShadow: active
                          ? "0 4px 12px rgba(99,102,241,0.3)"
                          : "none",
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
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: "0.9rem",
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
                              onClick={() => dispatch(closeMobileSidebar())}
                              sx={{
                                borderRadius: 8,
                                py: 0.75,
                                px: 2,
                                minHeight: 40,
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
                                      fontSize: "0.85rem",
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
                  onClick={() => dispatch(closeMobileSidebar())}
                  sx={{
                    borderRadius: 10,
                    py: 1.25,
                    px: 1.5,
                    minHeight: 48,
                    color: active ? "white" : "rgba(255,255,255,0.6)",
                    background: active
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "transparent",
                    boxShadow: active
                      ? "0 4px 12px rgba(99,102,241,0.3)"
                      : "none",
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
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Bottom Section */}
        <Box sx={{ p: 2 }}>
          {/* Logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => dispatch(logoutAsync())}
              sx={{
                borderRadius: 10,
                py: 1.25,
                px: 1.5,
                color: "rgba(255,255,255,0.5)",
                "&:hover": {
                  bgcolor: "rgba(239,68,68,0.15)",
                  color: "#fca5a5",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "inherit",
                }}
              >
                <LogOut size={22} />
              </ListItemIcon>

              <ListItemText
                primary="Logout"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* User Profile */}
          {user && (
            <Box
              sx={{
                mt: 0.5,
                px: 1.5,
                pt: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                borderRadius: 2,
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.06)",
                },
              }}
              onClick={(e) => setopenDialog(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "rgba(99,102,241,0.3)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {user.username?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
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
                    lineHeight: 1.4,
                  }}
                >
                  {role === "ADMIN" ? "Administrator" : "Alumni Member"}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Profile Dialog */}
      <HeaderProfileDialog
        anchorEl={openDialog}
        onClose={() => setopenDialog(null)}
        username={user?.username}
      />
    </Drawer>
  );
}
