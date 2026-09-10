import { Box, Typography, Breadcrumbs } from "@mui/material";
import CommonBreadcrumb from "./CommonBreadcrumb";

interface BreadcrumbItem { label: string; path?: string }

interface CommonPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function CommonPageHeader({ title, subtitle, breadcrumbs, actions }: CommonPageHeaderProps) {
  return (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
      {breadcrumbs && <CommonBreadcrumb items={breadcrumbs} />}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>{title}</Typography>
          {subtitle && <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, maxWidth: 600 }}>{subtitle}</Typography>}
        </Box>
        {actions && <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
