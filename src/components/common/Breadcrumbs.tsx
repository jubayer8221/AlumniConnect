import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import { matchRoute, type RouteDescriptor } from "@/config/routeRegistry";
import { useBreadcrumbLabels } from "./breadcrumbLabelContext";

function getPartialPaths(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map(
    (_, index) => `/${segments.slice(0, index + 1).join("/")}`,
  );
}

function getDescriptor(path: string): RouteDescriptor | undefined {
  return matchRoute(path);
}

export default function Breadcrumbs() {
  const location = useLocation();
  const role = useAppSelector((state) => state.auth.role);
  const { labels } = useBreadcrumbLabels();
  const currentDescriptor = getDescriptor(location.pathname);

  if (
    location.pathname === "/alumni/dashboard" ||
    location.pathname === "/dashboard"
  ) {
    return null;
  }

  const rootPath = role === "ADMIN" ? "/dashboard" : "/alumni/dashboard";
  const paths = getPartialPaths(location.pathname);
  const crumbs = paths
    .map((path) => ({ path, descriptor: getDescriptor(path) }))
    .filter(
      (crumb): crumb is { path: string; descriptor: RouteDescriptor } =>
        !!crumb.descriptor,
    );

  if (!currentDescriptor || crumbs.length === 0) return null;

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      sx={{
        px: { xs: 2, sm: 3, md: 3.5 },
        py: 1.5,
        bgcolor: "background.default",
      }}
    >
      <MUILink component={Link} to={rootPath} underline="hover" color="inherit">
        Dashboard
      </MUILink>
      {crumbs.map(({ path, descriptor }, index) => {
        const isLast = index === crumbs.length - 1;
        const label = descriptor.dynamic
          ? (labels[path] ?? descriptor.label)
          : descriptor.label;

        return isLast ? (
          <Typography key={path} color="text.primary">
            {label}
          </Typography>
        ) : (
          <MUILink
            key={path}
            component={Link}
            to={path}
            underline="hover"
            color="inherit"
          >
            {label}
          </MUILink>
        );
      })}
    </MUIBreadcrumbs>
  );
}
