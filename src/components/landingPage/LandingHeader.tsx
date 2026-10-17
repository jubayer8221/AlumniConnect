import { lazy, useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Toolbar,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  X,
  LayoutDashboard,
  User,
  Lock,
  LogOut,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
import { useAuth } from "@/hooks/useAuth";
import { hasAdminAccess } from "@/utils/authUtils";

const ChangePasswordDialog = lazy(
  () => import("../login/ChangePasswordDialog"),
);

/** Nav items either scroll to a landing section or navigate to a route. */
type NavItem =
  | { label: string; type: "hash"; href: string }
  | { label: string; type: "route"; to: string };

const NAV: NavItem[] = [
  { label: "Home", type: "hash", href: "/" },
  { label: "About", type: "route", to: "/about" },
  { label: "Events", type: "route", to: "/events" },
  { label: "News", type: "route", to: "/news" },
  { label: "Gallery", type: "route", to: "/gallery" },
  { label: "Jobs", type: "route", to: "/jobs" },
];

/* Shared styles so "Sign In" matches the other nav links exactly */
const navLinkSx = (active: boolean) => ({
  position: "relative" as const,
  fontSize: "0.9rem",
  fontWeight: 700,
  cursor: "pointer",
  color: active ? "var(--color-primary)" : "text.primary",
  py: 0.5,
  transition: "color 0.2s ease",

  /* Animated underline grows from center on hover */
  "&::after": {
    content: '""',
    position: "absolute" as const,
    left: "50%",
    bottom: 0,
    height: 2,
    width: active ? "100%" : 0,
    borderRadius: 2,
    bgcolor: "var(--color-primary)",
    transform: "translateX(-50%)",
    transition: "width 0.25s ease, background-color 0.2s ease",
  },
  "&:hover": {
    color: "var(--color-primary)",
    "&::after": { width: "100%" },
  },
});

function initialsOf(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function LandingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, authUser, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userAnchor, setUserAnchor] = useState<HTMLElement | null>(null);
  const [changePwOpen, setChangePwOpen] = useState(false);

  const isOnLanding = location.pathname === "/";

  useEffect(() => {
    if (!isOnLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOnLanding]);

  const solid = !isOnLanding || scrolled;
  const isAdmin = hasAdminAccess(role);
  const roleLabel = role === "MODERATOR" ? "Moderator" : "Administrator";

  const displayName =
    authUser?.displayName || authUser?.fullName || authUser?.username || "User";
  const displayEmail = authUser?.email ?? "";
  const photoUrl = authUser?.profilePhoto ?? "";

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNav = (item: NavItem) => {
    setMobileOpen(false);
    if (item.type === "route") {
      navigate(item.to);
      return;
    }
    if (isOnLanding) {
      scrollTo(item.href);
    } else {
      navigate(`/${item.href}`);
    }
  };

  useEffect(() => {
    if (!isOnLanding) return;
    if (location.hash) {
      const id = location.hash;
      const t = setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOnLanding, location.hash]);

  const goHome = () => {
    setMobileOpen(false);
    if (isOnLanding) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const goToDashboard = () => {
    setUserAnchor(null);
    navigate(isAdmin ? "/dashboard" : "/alumni/dashboard");
  };

  const handleLogout = () => {
    setUserAnchor(null);
    void logout();
  };

  const openChangePassword = () => {
    setUserAnchor(null);
    setChangePwOpen(true);
  };

  const isActive = (item: NavItem): boolean => {
    if (item.type === "route") {
      return (
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
      );
    }
    return location.pathname === "/";
  };

  const isSignInActive = location.pathname === "/login";

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 8, md: 16 },
          zIndex: (theme) => theme.zIndex.appBar - 1,
          // bgcolor: "rgba(var(--rgb-white), 0.72)",
          bgcolor: "transparent",
          backdropFilter: "blur(14px) saturate(100%)",
          WebkitBackdropFilter: "blur(14px) saturate(180%)",
          pointerEvents: "none",
        }}
      />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: { xs: 8, md: 16 },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "calc(100% - 24px)", md: "calc(100% - 32px)" },
          maxWidth: "lg",
          borderRadius: 3,
          color: "text.primary",
          bgcolor: "rgba(var(--rgb-white), 0.92)",

          backdropFilter: "blur(14px) saturate(180%)",
          WebkitBackdropFilter: "blur(14px) saturate(180%)",
          border: "1px solid",
          borderColor: solid
            ? "rgba(var(--rgb-black), 0.06)"
            : "rgba(var(--rgb-white), 0.35)",

          boxShadow: solid
            ? "0 10px 30px rgba(var(--rgb-black), 0.10), 0 4px 12px rgba(var(--rgb-black), 0.05)"
            : "0 4px 20px rgba(var(--rgb-black), 0.05)",

          transition:
            "box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease",

          "&:hover": {
            boxShadow:
              "0 14px 40px rgba(var(--rgb-black), 0.12), 0 6px 16px rgba(var(--rgb-black), 0.06)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
            {/* ---------- Logo ---------- */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                borderRadius: 2,
                px: 1,
                py: 0.5,
                transition: "transform 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  bgcolor: "rgba(var(--rgb-primary), 0.05)",
                },
                "&:hover .logo-img": {
                  transform: "scale(1.06)",
                },
              }}
              onClick={goHome}
            >
              <Box
                component="img"
                src="/image/logo-small-64.png"
                srcSet="/image/logo-small-64.png 1x, /image/logo-small.png 2x"
                alt={appConfig.appName}
                width={64}
                height={60}
                className="logo-img"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  transition: "transform 0.25s ease",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: "text.primary",
                  }}
                >
                  {appConfig.appName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: "text.secondary",
                    lineHeight: 1.2,
                  }}
                >
                  {appConfig.institutionShortName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* ---------- Desktop nav links ---------- */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {NAV.map((item) => {
                const active = isActive(item);
                return (
                  <Typography
                    key={item.type === "route" ? item.to : item.href}
                    onClick={() => handleNav(item)}
                    sx={navLinkSx(active)}
                  >
                    {item.label}
                  </Typography>
                );
              })}
            </Stack>

            {/* ---------- Desktop right side ---------- */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                ml: 3,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {isAuthenticated ? (
                <IconButton
                  onClick={(e) => setUserAnchor(e.currentTarget)}
                  sx={{
                    p: 0.5,
                    border: "2px solid",
                    borderColor: "divider",
                    transition:
                      "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      transform: "scale(1.05)",
                      boxShadow:
                        "0 0 0 4px rgba(var(--rgb-primary), 0.12), 0 4px 12px rgba(var(--rgb-primary), 0.15)",
                    },
                  }}
                  aria-label="Open user menu"
                >
                  <Avatar
                    src={photoUrl || undefined}
                    alt={displayName}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "var(--color-primary)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {initialsOf(displayName)}
                  </Avatar>
                </IconButton>
              ) : (
                <>
                  {/* Sign In — styled exactly like a nav link */}
                  <Typography
                    onClick={() => navigate("/login")}
                    sx={navLinkSx(isSignInActive)}
                  >
                    Sign In
                  </Typography>

                  {/* Join Network — filled CTA button */}
                  <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                      bgcolor: "var(--color-primary)",
                      color: "var(--color-white)",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 3,
                      boxShadow: "0 4px 12px rgba(var(--rgb-primary), 0.25)",
                      transition:
                        "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        bgcolor: "var(--color-primary-hover)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(var(--rgb-primary), 0.35)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    Join Network
                  </Button>
                </>
              )}
            </Stack>

            {/* ---------- Mobile menu icon ---------- */}
            <IconButton
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="landing-mobile-navigation"
              sx={{
                display: { xs: "flex", md: "none" },
                color: "text.primary",
                transition: "background-color 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(var(--rgb-primary), 0.08)",
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* -------- Mobile drawer -------- */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          slotProps={{
            paper: { id: "landing-mobile-navigation", sx: { width: 280 } },
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              sx={{
                transition: "background-color 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(var(--rgb-black), 0.06)",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <X />
            </IconButton>
          </Box>

          {isAuthenticated && (
            <Box
              sx={{
                px: 2,
                pb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                src={photoUrl || undefined}
                alt={displayName}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "var(--color-primary)",
                  fontWeight: 700,
                }}
              >
                {initialsOf(displayName)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  {displayName}
                </Typography>
                <Typography
                  noWrap
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  {isAdmin ? roleLabel : "Alumni Member"}
                </Typography>
              </Box>
            </Box>
          )}

          <List>
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <ListItemButton
                  key={item.type === "route" ? item.to : item.href}
                  onClick={() => handleNav(item)}
                  selected={active}
                  sx={{
                    transition:
                      "background-color 0.2s ease, padding-left 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(var(--rgb-primary), 0.06)",
                      pl: 3,
                    },
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      borderRight: "3px solid",
                      borderColor: "var(--color-primary)",
                      "& .MuiListItemText-primary": {
                        fontWeight: 700,
                        color: "var(--color-primary)",
                      },
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<LayoutDashboard size={18} />}
                  onClick={() => {
                    setMobileOpen(false);
                    goToDashboard();
                  }}
                  sx={{
                    bgcolor: "var(--color-primary)",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(var(--rgb-primary), 0.25)",
                    transition:
                      "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      bgcolor: "var(--color-primary-hover)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(var(--rgb-primary), 0.35)",
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<User size={18} />}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/alumni/profile");
                  }}
                  sx={{
                    textTransform: "none",
                    transition:
                      "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      bgcolor: "rgba(var(--rgb-primary), 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    transition:
                      "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      bgcolor: "rgba(var(--rgb-primary), 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "var(--color-primary)",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(var(--rgb-primary), 0.25)",
                    transition:
                      "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      bgcolor: "var(--color-primary-hover)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(var(--rgb-primary), 0.35)",
                    },
                  }}
                >
                  Join Network
                </Button>
              </>
            )}
          </Box>
        </Drawer>
      </AppBar>

      {/* -------- User dropdown popover -------- */}
      <Popover
        disableScrollLock
        open={!!userAnchor}
        anchorEl={userAnchor}
        onClose={() => setUserAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 260,
              borderRadius: 2.5,
              overflow: "hidden",
              boxShadow:
                "0 16px 40px rgba(var(--rgb-black), 0.14), 0 6px 16px rgba(var(--rgb-black), 0.08)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 2,
            bgcolor: "background.default",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Avatar
            src={photoUrl || undefined}
            alt={displayName}
            sx={{
              width: 46,
              height: 46,
              bgcolor: "var(--color-primary)",
              fontWeight: 700,
            }}
          >
            {initialsOf(displayName)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {displayName}
            </Typography>
            {displayEmail && (
              <Typography
                noWrap
                sx={{ fontSize: "0.72rem", color: "text.secondary" }}
              >
                {displayEmail}
              </Typography>
            )}
            <Chip
              label={isAdmin ? roleLabel : "Alumni Member"}
              size="small"
              color={isAdmin ? "primary" : "default"}
              variant={isAdmin ? "filled" : "outlined"}
              sx={{ mt: 0.5, height: 20, fontSize: "0.65rem", fontWeight: 600 }}
            />
          </Box>
        </Box>

        <List sx={{ py: 0.5 }}>
          <ListItemButton
            onClick={goToDashboard}
            sx={{
              py: 1.1,
              px: 2,
              gap: 1.5,
              transition: "background-color 0.2s ease, padding-left 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(var(--rgb-primary), 0.06)",
                pl: 2.5,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <LayoutDashboard size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Go to Dashboard"
              sx={{ fontSize: "0.875rem", fontWeight: 600 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              setUserAnchor(null);
              navigate("/alumni/profile");
            }}
            sx={{
              py: 1.1,
              px: 2,
              gap: 1.5,
              transition: "background-color 0.2s ease, padding-left 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(var(--rgb-primary), 0.06)",
                pl: 2.5,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <User size={18} />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          <Divider sx={{ my: 0.5 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.1,
              px: 2,
              gap: 1.5,
              color: "error.main",
              transition: "background-color 0.2s ease, padding-left 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(var(--rgb-error), 0.08)",
                pl: 2.5,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "error.main" }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "error.main",
              }}
            />
          </ListItemButton>
        </List>
      </Popover>

      {changePwOpen && (
        <ChangePasswordDialog open onClose={() => setChangePwOpen(false)} />
      )}
    </>
  );
}
