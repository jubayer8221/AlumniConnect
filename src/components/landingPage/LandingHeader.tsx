import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
import { useAuth } from "@/hooks/useAuth";

/** Nav items either scroll to a landing section or navigate to a route. */
type NavItem =
  | { label: string; type: "hash"; href: string }
  | { label: string; type: "route"; to: string };

const NAV: NavItem[] = [
  { label: "Home", type: "hash", href: "/" },
  { label: "About", type: "route", to: "/about" },
  // { label: "Programs", type: "hash", href: "#programs" },
  { label: "Events", type: "route", to: "/events" },
  { label: "News", type: "route", to: "/news" },
  // { label: "Activities", type: "hash", href: "#activities" },
  // { label: "Gallery", type: "hash", href: "#gallery" },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Are we on the landing page itself?
  const isOnLanding = location.pathname === "/";

  useEffect(() => {
    if (!isOnLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOnLanding]);

  // Header is solid if we're not on the landing page, or if we've scrolled.
  const solid = !isOnLanding || scrolled;

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
    navigate(role === "ADMIN" ? "/dashboard" : "/alumni/dashboard");
  };

  const isActive = (item: NavItem): boolean => {
    if (item.type === "route") {
      return (
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
      );
    }
    // Home (hash "/")
    return location.pathname === "/";
  };

  return (
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
              sx={{ width: 40, height: 40, objectFit: "contain" }}
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

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ ml: 3, display: { xs: "none", md: "flex" } }}
          >
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={goToDashboard}
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
                Go to Dashboard
              </Button>
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
            <Button
              variant="contained"
              onClick={goToDashboard}
              sx={{
                bgcolor: "var(--color-primary)",
                textTransform: "none",
                "&:hover": { bgcolor: "var(--color-primary-hover)" },
              }}
            >
              Go to Dashboard
            </Button>
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
  );
}
