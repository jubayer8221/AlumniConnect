import React from "react";
import {
  Box,
  Breadcrumbs as MUIBreadcrumbs,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import { labelForSegment, isDynamicSegment } from "@/config/navigation";
import { useBreadcrumbLabels } from "./breadcrumbLabelContext";

interface Crumb {
  label: string;
  path: string;
  isLast: boolean;
}

function getPartialPaths(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map(
    (_, index) => `/${segments.slice(0, index + 1).join("/")}`,
  );
}

export default function Breadcrumbs() {
  const theme = useTheme();
  const location = useLocation();
  const role = useAppSelector((state) => state.auth.authUser?.role ?? null);
  const { labels } = useBreadcrumbLabels();

  // Hide on the two dashboard roots.
  if (
    location.pathname === "/alumni/dashboard" ||
    location.pathname === "/dashboard"
  ) {
    return null;
  }

  const rootPath = role === "ADMIN" ? "/dashboard" : "/alumni/dashboard";
  const paths = getPartialPaths(location.pathname);

  if (paths.length === 0) return null;

  const crumbs: Crumb[] = paths.map((path, index) => {
    const segments = path.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";

    const label = isDynamicSegment(last)
      ? (labels[path] ?? "Details")
      : labelForSegment(last);

    return { label, path, isLast: index === paths.length - 1 };
  });

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 2,
          py: 1,
          borderRadius: "16px",
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <MUIBreadcrumbs
          separator={
            <NavigateNextRoundedIcon
              sx={{
                fontSize: "1.1rem",
                color: alpha(theme.palette.text.secondary, 0.4),
              }}
            />
          }
          aria-label="breadcrumb"
        >
          {/* Home → role-appropriate dashboard */}
          <Box
            component={Link}
            to={rootPath}
            aria-label="Dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                color: "primary.main",
                transform: "translateY(-1px)",
              },
            }}
          >
            <HomeRoundedIcon sx={{ fontSize: "1.25rem" }} />
          </Box>

          {/* Dynamic segments */}
          {crumbs.map((crumb) => {
            if (crumb.isLast) {
              return (
                <Typography
                  key={crumb.path}
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: theme.palette.primary.main,
                    px: 1,
                    py: 0.25,
                    borderRadius: "6px",
                  }}
                >
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Box
                key={crumb.path}
                component={Link}
                to={crumb.path}
                sx={{
                  typography: "body2",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  "&:hover": { color: theme.palette.primary.dark },
                }}
              >
                {crumb.label}
              </Box>
            );
          })}
        </MUIBreadcrumbs>
      </Box>
    </Box>
  );
}
