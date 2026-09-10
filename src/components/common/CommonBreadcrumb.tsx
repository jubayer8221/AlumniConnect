import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CommonBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function CommonBreadcrumb({ items }: CommonBreadcrumbProps) {
  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return isLast ? (
          <Typography key={i} sx={{ color: "text.primary" }} variant="body2">{item.label}</Typography>
        ) : (
          <Link key={i} component={RouterLink} to={item.path || "#"} sx={{ color: "inherit", textDecoration: "none" }} variant="body2">
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
