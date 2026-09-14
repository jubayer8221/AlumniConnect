import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { DashboardData } from "@/types/dashboard";

const PIE_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#8b5cf6", "#ef4444", "#84cc16"];

interface DashboardChartsProps {
  data: DashboardData;
}

const chartCardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
} as const;

export default function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni Growth</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.alumniGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: "#6366f1" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, #ec4899, #f472b6)" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Department</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.alumniByDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} cursor={{ fill: "rgba(236,72,153,0.05)" }} />
                <Bar dataKey="value" fill="#ec4899" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, #10b981, #34d399)" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Graduation Year</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.alumniByGraduationYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, #0ea5e9, #38bdf8)" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Industry</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.alumniByIndustry} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100}>
                  {data.alumniByIndustry.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
