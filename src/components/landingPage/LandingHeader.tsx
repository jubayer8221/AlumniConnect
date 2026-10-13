import { useEffect, useState } from "react";
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
import ChangePasswordDialog from "../login/ChangePasswordDialog";

/** Nav items either scroll to a landing section or navigate to a route. */
type NavItem =
  | { label: string; type: "hash"; href: string }
  | { label: string; type: "route"; to: string };

const NAV: NavItem[] = [
  { label: "Home", type: "hash", href: "/" },
  { label: "About", type: "route", to: "/about" },
  { label: "Events", type: "route", to: "/events" },
  { label: "News", type: "route", to: "/news" },
];

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
  const isAdmin = role === "ADMIN";

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

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: solid ? "rgba(var(--rgb-white), 0.95)" : "transparent",
          backdropFilter: solid ? "blur(12px)" : "none",
          boxShadow: solid ? "0 4px 20px rgba(var(--rgb-black), 0.06)" : "none",
          borderBottom: solid ? "1px solid" : "none",
          borderColor: "divider",
          transition: "all 0.3s ease",
          color: solid ? "text.primary" : "var(--color-surface)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
              }}
              onClick={goHome}
            >
              <Box
                component="img"
                src="/image/logo-small.png"
                alt={appConfig.appName}
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: solid ? "text.primary" : "var(--color-surface)",
                  }}
                >
                  {appConfig.appName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: solid
                      ? "text.secondary"
                      : "rgba(var(--rgb-white), 0.75)",
                    lineHeight: 1.2,
                  }}
                >
                  {appConfig.institutionShortName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* -------- Desktop nav links -------- */}
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
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      opacity: active ? 1 : 0.9,
                      color: active
                        ? "var(--color-primary)"
                        : solid
                          ? "text.primary"
                          : "var(--color-surface)",
                      borderBottom: active
                        ? "2px solid"
                        : "2px solid transparent",
                      borderColor: active
                        ? "var(--color-primary)"
                        : "transparent",
                      pb: 0.25,
                      transition: "opacity 0.2s, color 0.2s, border-color 0.2s",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    {item.label}
                  </Typography>
                );
              })}
            </Stack>

            {/* -------- Desktop right side -------- */}
            <Stack
              direction="row"
              spacing={1.5}
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
                    borderColor: solid ? "divider" : "rgba(255,255,255,0.4)",
                    transition: "border-color 0.2s, transform 0.15s",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      transform: "scale(1.04)",
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
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: solid ? "text.primary" : "var(--color-surface)",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    sx={{
                      bgcolor: "var(--color-primary)",
                      color: "var(--color-white)",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3,
                      "&:hover": { bgcolor: "var(--color-primary-hover)" },
                    }}
                  >
                    Join Network
                  </Button>
                </>
              )}
            </Stack>

            <IconButton
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="landing-mobile-navigation"
              sx={{
                display: { xs: "flex", md: "none" },
                color: solid ? "text.primary" : "var(--color-surface)",
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
                  {isAdmin ? "Administrator" : "Alumni Member"}
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
                    "&:hover": { bgcolor: "var(--color-primary-hover)" },
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
                  sx={{ textTransform: "none" }}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{ textTransform: "none" }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "var(--color-primary)",
                    textTransform: "none",
                    "&:hover": { bgcolor: "var(--color-primary-hover)" },
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
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {/* Header */}
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
              label={isAdmin ? "Administrator" : "Alumni Member"}
              size="small"
              color={isAdmin ? "primary" : "default"}
              variant={isAdmin ? "filled" : "outlined"}
              sx={{ mt: 0.5, height: 20, fontSize: "0.65rem", fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Menu items */}
        <List sx={{ py: 0.5 }}>
          <ListItemButton
            onClick={goToDashboard}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
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
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <User size={18} />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton>

          {/* <ListItemButton
            onClick={openChangePassword}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Lock size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Change Password"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton> */}

          {/* <ListItemButton
            onClick={() => {
              setUserAnchor(null);
              navigate(isAdmin ? "/settings" : "/alumni/settings-privacy");
            }}
            sx={{ py: 1.1, px: 2, gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: "text.secondary" }}>
              <Settings size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            />
          </ListItemButton> */}

          <Divider sx={{ my: 0.5 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.1,
              px: 2,
              gap: 1.5,
              color: "error.main",
              "&:hover": { bgcolor: "error.50" },
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

      {/* Change password dialog — outside popover */}
      <ChangePasswordDialog
        open={changePwOpen}
        onClose={() => setChangePwOpen(false)}
      />
    </>
  );
}
