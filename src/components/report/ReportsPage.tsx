import { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Download,
  BarChart3,
  Users,
  User,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchDashboardDataAsync } from "@/Slice/dashboardSlice";
import { fetchAlumniAsync } from "@/Slice/alumniSlice";
import {
  CommonPageHeader,
  CommonLoading,
  CommonCard,
} from "@/components/common";
import { exportAlumniToCSV } from "@/utils/csvExport";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import StatCard from "../dashboard/StatCard";

const PIE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((s) => s.dashboard);
  const alumni = useAppSelector((s) => s.alumni.items);

  useEffect(() => {
    dispatch(fetchDashboardDataAsync());
    dispatch(fetchAlumniAsync());
  }, [dispatch]);

  if (loading && !data) return <CommonLoading />;

  const stats = [
    {
      title: "Total Alumni",
      value: data?.summary.totalAlumni ?? 0,
      icon: <Users size={20} />,
    },
    {
      title: "Male Alumni",
      value: data?.summary.maleAlumni ?? 0,
      icon: <User size={20} />,
    },
    {
      title: "Female Alumni",
      value: data?.summary.femaleAlumni ?? 0,
      icon: <User size={20} />,
    },
    {
      title: "Other",
      value: data?.summary.otherAlumni ?? 0,
      icon: <User size={20} />,
    },
    {
      title: "Mentor Count",
      value: data?.summary.mentors ?? 0,
      icon: <Star size={20} />,
    },
    {
      title: "Verified Alumni",
      value: data?.summary.verifiedAlumni ?? 0,
      icon: <CheckCircle size={20} />,
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title="Reports & Statistics"
        subtitle="Alumni data insights and export"
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={() => exportAlumniToCSV(alumni)}
          >
            Export All Alumni CSV
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Graduates by Year
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.alumniByGraduationYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Alumni by Location
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.alumniByLocation}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.alumniByLocation.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Graduates by Department
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Department</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Count</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Percentage</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.alumniByDepartment.map((d) => (
                        <TableRow key={d.label}>
                          <TableCell>{d.label}</TableCell>
                          <TableCell align="right">{d.value}</TableCell>
                          <TableCell align="right">
                            {(
                              (d.value / data.summary.totalAlumni) *
                              100
                            ).toFixed(1)}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
