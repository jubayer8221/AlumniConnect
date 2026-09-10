import { Box, Typography, Card, CardContent } from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = "#6366f1", trend, subtitle }: StatCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          borderColor: color + "40",
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, transform: "translate(30%, -30%)" }} />
      <CardContent sx={{ p: 2.5, position: "relative" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
              color: "white",
              boxShadow: `0 4px 12px ${color}30`,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 10,
                bgcolor: trend >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              }}
            >
              {trend >= 0 ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: trend >= 0 ? "success.main" : "error.main" }}>
                {trend >= 0 ? "+" : ""}{trend}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography sx={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5, color: "text.secondary", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "text.primary", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          {value}
        </Typography>
        {subtitle && <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}
