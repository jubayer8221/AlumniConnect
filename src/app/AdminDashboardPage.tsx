import { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Award,
  CalendarDays,
  Bell,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchDashboardDataAsync } from "@/Slice/dashboardSlice";
import {
  CommonLoading,
  CommonEmptyState,
  CommonPageHeader,
} from "@/components/common";
import StatCard from "@/app/components/StatCard";
import DashboardCharts from "@/app/components/DashboardCharts";
import { fromNow, formatDate } from "@/utils/dateUtils";
import { appConfig } from "@/config/appConfig";

const cardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
} as const;

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardDataAsync());
  }, [dispatch]);

  if (loading && !data) return <CommonLoading />;
  if (!data) return <CommonEmptyState title="No dashboard data available" />;

  const stats = [
    {
      title: "Total Alumni",
      value: data.summary.totalAlumni,
      icon: <Users size={22} />,
      color: "#6366f1",
      trend: 12.5,
    },
    {
      title: "Active",
      value: data.summary.activeAlumni,
      icon: <UserCheck size={22} />,
      color: "#10b981",
    },
    {
      title: "Verified",
      value: data.summary.verifiedAlumni,
      icon: <Award size={22} />,
      color: "#8b5cf6",
    },
    {
      title: "Mentors",
      value: data.summary.mentors,
      icon: <Briefcase size={22} />,
      color: "#f59e0b",
    },
    {
      title: "Pending",
      value: data.summary.pendingAlumni,
      icon: <UserX size={22} />,
      color: "#ef4444",
    },
    {
      title: "Inactive",
      value: data.summary.inactiveAlumni,
      icon: <UserX size={22} />,
      color: "#64748b",
    },
    {
      title: "New This Year",
      value: data.summary.newAlumniThisYear,
      icon: <UserPlus size={22} />,
      color: "#06b6d4",
    },
    {
      title: "Events",
      value: data.summary.totalEvents,
      icon: <CalendarDays size={22} />,
      color: "#ec4899",
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title="Welcome back, Admin"
        subtitle={`Here's what's happening with your alumni community at ${appConfig.institutionName}.`}
      />

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 6, md: 6, md: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <DashboardCharts data={data} />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 24,
                      borderRadius: 2,
                      background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Recent Alumni
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/alumni")}
                  sx={{ color: "#6366f1", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              <List>
                {data.recentAlumni.map((alum, i) => (
                  <Box key={alum.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1,
                        "&:hover": { bgcolor: "action.hover" },
                        borderRadius: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/alumni/${alum.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                            fontWeight: 700,
                          }}
                        >
                          {alum.fullName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {alum.fullName}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {alum.departmentName || "—"} • Added{" "}
                            {fromNow(alum.createdAt)}
                          </Typography>
                        }
                      />
                      <Chip
                        label={alum.alumniId}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1, fontSize: "0.7rem" }}
                      />
                    </ListItem>
                    {i < data.recentAlumni.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 24,
                      borderRadius: 2,
                      background: "linear-gradient(180deg, #ec4899, #f472b6)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Upcoming Events
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/events")}
                  sx={{ color: "#ec4899", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {data.upcomingEvents.length === 0 ? (
                <CommonEmptyState title="No upcoming events" />
              ) : (
                <List>
                  {data.upcomingEvents.map((evt, i) => (
                    <Box key={evt.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/events/${evt.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(236,72,153,0.1)",
                              color: "#ec4899",
                            }}
                          >
                            <CalendarDays size={20} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {evt.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {formatDate(evt.date)} • {evt.location}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < data.upcomingEvents.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #f59e0b, #fbbf24)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  Recent Notices
                </Typography>
              </Box>
              {data.recentNotices.length === 0 ? (
                <CommonEmptyState title="No notices" />
              ) : (
                <List>
                  {data.recentNotices.map((notice, i) => (
                    <Box key={notice.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/notices/${notice.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(245,158,11,0.1)",
                              color: "#f59e0b",
                            }}
                          >
                            <Bell size={20} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {notice.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {notice.category} •{" "}
                              {formatDate(notice.publishDate)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < data.recentNotices.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    borderRadius: 2,
                    background: "linear-gradient(180deg, #ef4444, #f87171)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  Pending Verification
                </Typography>
              </Box>
              {data.pendingVerification.length === 0 ? (
                <CommonEmptyState
                  title="No pending verifications"
                  message="All alumni are verified."
                />
              ) : (
                <List>
                  {data.pendingVerification.map((alum, i) => (
                    <Box key={alum.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(239,68,68,0.1)",
                              color: "#ef4444",
                              fontWeight: 700,
                            }}
                          >
                            {alum.fullName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {alum.fullName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {alum.email}
                            </Typography>
                          }
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/alumni/${alum.id}`)}
                          sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                          Review
                        </Button>
                      </ListItem>
                      {i < data.pendingVerification.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
