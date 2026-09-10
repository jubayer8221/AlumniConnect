import { Chip } from "@mui/material";
import type { Status } from "@/types/common";

interface CommonStatusBadgeProps {
  status: string | Status;
  size?: "small" | "medium";
}

const colorMap: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "#dcfce7", color: "#166534" },
  INACTIVE: { bg: "#fee2e2", color: "#991b1b" },
  PENDING: { bg: "#fef9c3", color: "#854d0e" },
  VERIFIED: { bg: "#dcfce7", color: "#166534" },
  PUBLISHED: { bg: "#dcfce7", color: "#166534" },
  DRAFT: { bg: "#e0e7ff", color: "#3730a3" },
  ARCHIVED: { bg: "#f1f5f9", color: "#475569" },
  UPCOMING: { bg: "#dbeafe", color: "#1e40af" },
  ONGOING: { bg: "#fef9c3", color: "#854d0e" },
  COMPLETED: { bg: "#f1f5f9", color: "#475569" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b" },
  REGISTERED: { bg: "#dcfce7", color: "#166534" },
};

export default function CommonStatusBadge({ status, size = "small" }: CommonStatusBadgeProps) {
  const colors = colorMap[status] || { bg: "#e0e7ff", color: "#3730a3" };
  return (
    <Chip
      label={status}
      size={size}
      sx={{ backgroundColor: colors.bg, color: colors.color, fontWeight: 600, fontSize: "0.75rem" }}
    />
  );
}
