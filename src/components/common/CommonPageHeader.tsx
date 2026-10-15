import { Box, Typography } from "@mui/material";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CommonPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function CommonPageHeader({
  title,
  subtitle,
  actions,
}: CommonPageHeaderProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5, maxWidth: 600 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}
