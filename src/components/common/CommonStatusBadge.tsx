import { Chip } from "@mui/material";
import type { Status } from "@/types/common";

interface CommonStatusBadgeProps {
  status: string | Status;
  size?: "small" | "medium";
}

const colorMap: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "var(--color-success-pale)", color: "var(--color-success-dark)" },
  INACTIVE: { bg: "var(--color-error-pale)", color: "var(--color-primary-hover)" },
  PENDING: { bg: "var(--color-warning-pale)", color: "var(--color-warning-dark)" },
  VERIFIED: { bg: "var(--color-success-pale)", color: "var(--color-success-dark)" },
  PUBLISHED: { bg: "var(--color-success-pale)", color: "var(--color-success-dark)" },
  DRAFT: { bg: "var(--color-light-surface-blue)", color: "var(--color-chart-indigo-dark)" },
  ARCHIVED: { bg: "var(--color-light-surface-alt)", color: "var(--color-chart-slate)" },
  UPCOMING: { bg: "var(--color-light-surface-blue)", color: "var(--color-chart-blue-dark)" },
  ONGOING: { bg: "var(--color-warning-pale)", color: "var(--color-warning-dark)" },
  COMPLETED: { bg: "var(--color-light-surface-alt)", color: "var(--color-chart-slate)" },
  CANCELLED: { bg: "var(--color-error-pale)", color: "var(--color-primary-hover)" },
  REGISTERED: { bg: "var(--color-success-pale)", color: "var(--color-success-dark)" },
};

export default function CommonStatusBadge({ status, size = "small" }: CommonStatusBadgeProps) {
  const colors = colorMap[status] || { bg: "var(--color-light-surface-blue)", color: "var(--color-chart-indigo-dark)" };
  return (
    <Chip
      label={status}
      size={size}
      sx={{ backgroundColor: colors.bg, color: colors.color, fontWeight: 600, fontSize: "0.75rem" }}
    />
  );
}
