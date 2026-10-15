import { useEffect, useState } from "react";
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
  IconButton,
  Tooltip,
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
  BadgeCheck,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { fetchDashboardDataAsync } from "@/store/Slice/dashboardSlice";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonLoading,
  CommonEmptyState,
  CommonPageHeader,
  CommonConfirmDialog,
} from "@/components/common";
import StatCard from "@/components/dashboard/StatCard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { fromNow, formatDate } from "@/utils/dateUtils";
import { getApiErrorMessage } from "@/utils/apiError";
import { appConfig } from "@/config/appConfig";
import Footer from "../common/Footer";

const cardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.06)" },
} as const;

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authUser: user } = useAuth();
  const { data, loading } = useAppSelector((s) => s.dashboard);
  const { verifyAlumni } = useAlumni();

  const [confirmVerify, setConfirmVerify] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);

  /* ★ Fetch only if store is empty */
  useEffect(() => {
    if (!data) {
      void dispatch(fetchDashboardDataAsync());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (!confirmVerify) return;
    setVerifying(true);
    try {
      await verifyAlumni(confirmVerify.id);
      dispatch(
        showToast({
          message: `${confirmVerify.name} verified successfully.`,
          severity: "success",
        }),
      );
      // Refresh dashboard so the pending list updates
      await dispatch(fetchDashboardDataAsync());
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to verify alumni"),
          severity: "error",
        }),
      );
    } finally {
      setVerifying(false);
      setConfirmVerify(null);
    }
  };

  if (loading && !data) return <CommonLoading />;
  if (!data) return <CommonEmptyState title="No dashboard data available" />;

  const stats = [
    {
      title: "Total Alumni",
      value: data.summary.totalAlumni,
      icon: <Users size={22} />,
      color: "var(--color-chart-indigo)",
    },
    {
      title: "Active",
      value: data.summary.activeAlumni,
      icon: <UserCheck size={22} />,
      color: "var(--color-chart-emerald)",
    },
    {
      title: "Verified",
      value: data.summary.verifiedAlumni,
      icon: <Award size={22} />,
      color: "var(--color-chart-purple)",
    },
    {
      title: "Mentors",
      value: data.summary.mentors,
      icon: <Briefcase size={22} />,
      color: "var(--color-warning)",
    },
    {
      title: "Pending",
      value: data.summary.pendingAlumni,
      icon: <UserX size={22} />,
      color: "var(--color-error)",
    },
    {
      title: "Inactive",
      value: data.summary.inactiveAlumni,
      icon: <UserX size={22} />,
      color: "var(--color-text-secondary)",
    },
    {
      title: "New This Year",
      value: data.summary.newAlumniThisYear,
      icon: <UserPlus size={22} />,
      color: "var(--color-chart-cyan)",
    },
    {
      title: "Events",
      value: data.summary.totalEvents,
      icon: <CalendarDays size={22} />,
      color: "var(--color-chart-pink)",
    },
  ];

  const upcomingEvents = data.upcomingEvents ?? [];
  const recentNotices = data.recentNotices ?? [];

  return (
    <Box>
      <CommonPageHeader
        title={`Welcome back, ${user?.displayName || "Administrator"}`}
        subtitle={`Alumni community of ${appConfig.institutionName}.`}
      />

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 6, md: 4, lg: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <DashboardCharts data={data} />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* ------------------ Recent Alumni ------------------ */}
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
                      background:
                        "linear-gradient(180deg, var(--color-chart-indigo), var(--color-chart-purple))",
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
                  sx={{ color: "var(--color-chart-indigo)", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {data.recentAlumni.length === 0 ? (
                <CommonEmptyState title="No recent alumni" />
              ) : (
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
                            src={alum?.profilePhoto}
                            alt={alum?.fullName}
                            sx={{
                              background:
                                "linear-gradient(135deg, var(--color-chart-indigo) 0%, var(--color-chart-pink) 100%)",
                              fontWeight: 700,
                            }}
                          >
                            {!alum?.profilePhoto && alum?.fullName?.[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {alum?.fullName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {alum.departmentName || "—"} • Added{" "}
                              {fromNow(alum.createdAt ?? undefined)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {i < data.recentAlumni.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ------------------ Upcoming Events ------------------ */}
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
                      background:
                        "linear-gradient(180deg, var(--color-chart-pink), var(--color-chart-pink-light))",
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
                  onClick={() => navigate("/alumni/explore/events")}
                  sx={{ color: "var(--color-chart-pink)", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {upcomingEvents.length === 0 ? (
                <CommonEmptyState title="No upcoming events" />
              ) : (
                <List>
                  {upcomingEvents.map((evt, i) => (
                    <Box key={evt.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/alumni/explore/events/${evt.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(var(--rgb-chart-pink), 0.1)",
                              color: "var(--color-chart-pink)",
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
                      {i < upcomingEvents.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ------------------ Recent Notices ------------------ */}
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
                      background:
                        "linear-gradient(180deg, var(--color-warning), var(--color-warning-light))",
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
                <Button
                  size="small"
                  onClick={() => navigate("/alumni/explore/notices")}
                  sx={{ color: "var(--color-warning)", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {recentNotices.length === 0 ? (
                <CommonEmptyState title="No notices" />
              ) : (
                <List>
                  {recentNotices.map((notice, i) => (
                    <Box key={notice.id}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 1,
                          "&:hover": { bgcolor: "action.hover" },
                          borderRadius: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/alumni/explore/notices/${notice.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(var(--rgb-warning), 0.1)",
                              color: "var(--color-warning)",
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
                      {i < recentNotices.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ------------------ Pending Verification ------------------ */}
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
                      background:
                        "linear-gradient(180deg, var(--color-error), var(--color-error-light))",
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
                <Button
                  size="small"
                  onClick={() =>
                    navigate("/alumni/configuration/verify-member")
                  }
                  sx={{ color: "var(--color-error)", fontWeight: 600 }}
                >
                  View All
                </Button>
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
                        secondaryAction={
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Tooltip title="View profile">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/alumni/${alum.id}`)}
                                sx={{ color: "text.secondary" }}
                              >
                                <Eye size={16} />
                              </IconButton>
                            </Tooltip>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<BadgeCheck size={14} />}
                              onClick={() =>
                                setConfirmVerify({
                                  id: alum.id,
                                  name: alum.fullName,
                                })
                              }
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "var(--color-error)",
                                color: "var(--color-error)",
                                "&:hover": {
                                  borderColor: "var(--color-error)",
                                  bgcolor: "rgba(var(--rgb-error), 0.06)",
                                },
                              }}
                            >
                              Verify
                            </Button>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={alum?.profilePhoto}
                            alt={alum?.fullName}
                            sx={{
                              bgcolor: "rgba(var(--rgb-error), 0.1)",
                              color: "var(--color-error)",
                              fontWeight: 700,
                            }}
                          >
                            {!alum?.profilePhoto && alum?.fullName?.[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {alum?.fullName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {alum?.email}
                            </Typography>
                          }
                        />
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

      <Box>
        <Footer />
      </Box>

      {/* ---------- Confirm verify dialog ---------- */}
      <CommonConfirmDialog
        open={!!confirmVerify}
        title="Verify Alumni"
        message={`Are you sure you want to verify "${confirmVerify?.name}"?`}
        confirmLabel="Verify"
        onConfirm={handleVerify}
        onCancel={() => setConfirmVerify(null)}
        loading={verifying}
        color="primary"
      />
    </Box>
  );
}
