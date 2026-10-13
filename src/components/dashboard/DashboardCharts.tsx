import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { DashboardData } from "@/types/dashboard";

const PIE_COLORS = ["var(--color-chart-indigo)", "var(--color-chart-pink)", "var(--color-warning)", "var(--color-chart-emerald)", "var(--color-info)", "var(--color-chart-purple)", "var(--color-error)", "var(--color-chart-lime)"];

interface DashboardChartsProps {
  data: DashboardData;
}

const chartCardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.06)" },
} as const;

export default function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, var(--color-chart-indigo), var(--color-chart-purple))" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni Growth</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.alumniGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-light-surface-alt)" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-gray200)", fontSize: 13 }} />
                <Line type="monotone" dataKey="count" stroke="var(--color-chart-indigo)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-chart-indigo)" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, var(--color-chart-pink), var(--color-chart-pink-light))" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Department</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.alumniByDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-light-surface-alt)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-gray200)", fontSize: 13 }} cursor={{ fill: "rgba(var(--rgb-chart-pink), 0.05)" }} />
                <Bar dataKey="value" fill="var(--color-chart-pink)" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, var(--color-chart-emerald), var(--color-success-light))" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Graduation Year</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.alumniByGraduationYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-light-surface-alt)" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-gray200)", fontSize: 13 }} cursor={{ fill: "rgba(var(--rgb-chart-emerald), 0.05)" }} />
                <Bar dataKey="value" fill="var(--color-chart-emerald)" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card sx={chartCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 2, background: "linear-gradient(180deg, var(--color-info), var(--color-info-light))" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" } }}>Alumni by Industry</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.alumniByIndustry} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100}>
                  {data.alumniByIndustry.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-gray200)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
