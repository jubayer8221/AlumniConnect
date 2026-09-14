import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "#6366f1",
  trend,
  subtitle,
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.6),
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${theme.palette.background.paper} 100%)`,
        backdropFilter: "blur(8px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 12px 24px -6px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.35),
          "& .stat-icon": {
            transform: "scale(1.05)",
            backgroundColor: alpha(color, 0.15),
          },
        },
      }}
    >
      <CardContent sx={{ p: 2.5, pb: 2, flexGrow: 1 }}>
        {/* Main Content: Left Icon + Right Details */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Left: Icon Badge */}
          <Box
            className="stat-icon"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2.5,
              backgroundColor: alpha(color, 0.08),
              color: color,
              transition: "all 0.25s ease",
              flexShrink: 0,
              "& > svg": {
                width: 22,
                height: 22,
                strokeWidth: 2,
              },
            }}
          >
            {icon}
          </Box>

          {/* Right: Label & Primary Metric */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              noWrap
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                letterSpacing: "0.02em",
                mb: 0.25,
              }}
            >
              {title}
            </Typography>

            <Typography
              noWrap
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Footer Section */}
      {(trend !== undefined || subtitle) && (
        <Box
          sx={{
            px: 2.5,
            pb: 2,
            pt: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {trend !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
                bgcolor:
                  trend >= 0
                    ? alpha(theme.palette.success.main, 0.08)
                    : alpha(theme.palette.error.main, 0.08),
                color: trend >= 0 ? "success.main" : "error.main",
              }}
            >
              {trend >= 0 ? (
                <TrendingUp size={13} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={13} strokeWidth={2.5} />
              )}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.725rem",
                  lineHeight: 1,
                }}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </Typography>
            </Box>
          )}

          {subtitle && (
            <Typography
              noWrap
              sx={{
                fontSize: "0.725rem",
                color: "text.secondary",
                fontWeight: 400,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}
