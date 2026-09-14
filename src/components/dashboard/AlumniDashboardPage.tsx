import { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
} from "@mui/material";
import {
  UserCircle,
  GraduationCap,
  Building2,
  Calendar,
  Pencil,
  Users,
  CalendarDays,
  ArrowRight,
  Award,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAlumniByIdAsync } from "@/Slice/alumniSlice";
import { fetchEventsAsync } from "@/Slice/eventSlice";
import { fetchNoticesAsync } from "@/Slice/noticeSlice";
import {
  CommonLoading,
  CommonPageHeader,
  CommonCard,
  CommonAvatar,
  CommonEmptyState,
} from "@/components/common";
import {
  calculateProfileCompletion,
  getMissingProfileFields,
} from "@/utils/profileCompletion";
import { formatDate } from "@/utils/dateUtils";

const cardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
} as const;

export default function AlumniDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);
  const events = useAppSelector((s) => s.events.items);
  const notices = useAppSelector((s) => s.notices.items);

  useEffect(() => {
    if (user?.alumniId) dispatch(fetchAlumniByIdAsync(user.alumniId));
    dispatch(fetchEventsAsync({ pageNumber: 1, pageSize: 5 } as never));
    dispatch(fetchNoticesAsync({ pageNumber: 1, pageSize: 5 } as never));
  }, [dispatch, user]);

  if (loading && !selectedAlumni) return <CommonLoading />;
  if (!selectedAlumni) return <CommonEmptyState title="Profile not found" />;

  const completion = calculateProfileCompletion(selectedAlumni);
  const missing = getMissingProfileFields(selectedAlumni);
  const firstName = selectedAlumni.firstName;

  const quickActions = [
    {
      label: "View Profile",
      icon: <UserCircle size={20} />,
      path: `/alumni/${selectedAlumni.id}`,
      color: "#6366f1",
    },
    {
      label: "Edit Profile",
      icon: <Pencil size={20} />,
      path: `/alumni/${selectedAlumni.id}/edit`,
      color: "#ec4899",
    },
    {
      label: "Alumni Directory",
      icon: <Users size={20} />,
      path: "/alumni/directory",
      color: "#0ea5e9",
    },
    {
      label: "Upcoming Events",
      icon: <CalendarDays size={20} />,
      path: "/alumni/events",
      color: "#10b981",
    },
  ];

  const infoCards = [
    {
      label: "My Profile",
      value: selectedAlumni.fullName,
      icon: <UserCircle size={22} />,
      color: "#6366f1",
    },
    {
      label: "My Batch",
      value: selectedAlumni.batch || "—",
      icon: <Calendar size={22} />,
      color: "#10b981",
    },
    {
      label: "My Department",
      value: selectedAlumni.departmentName || "—",
      icon: <Building2 size={22} />,
      color: "#f59e0b",
    },
    {
      label: "Graduation Year",
      value: selectedAlumni.graduationYear?.toString() || "—",
      icon: <GraduationCap size={22} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title={`Welcome back, ${firstName}!`}
        subtitle="Here's an overview of your alumni profile and community."
      />

      {/* Profile Completion Banner */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <CardContent sx={{ p: { xs: 2, md: 3 }, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
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
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Profile Completion
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {completion}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(99,102,241,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              },
            }}
          />
          {missing.length > 0 && (
            <Typography
              variant="caption"
              sx={{ mt: 1.5, display: "block", color: "text.secondary" }}
            >
              Complete your profile to help other alumni find you. Missing:{" "}
              {missing.join(", ")}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 3 }}>
        {infoCards.map((card) => (
          <Grid key={card.label} size={{ xs: 6, sm: 3 }}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 100%)`,
                      color: "white",
                      boxShadow: `0 4px 12px ${card.color}30`,
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "1rem" },
                        fontWeight: 700,
                        color: "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions + Events */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
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
                    background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Quick Actions
                </Typography>
              </Box>
              <List>
                {quickActions.map((action, i) => (
                  <Box key={action.label}>
                    <ListItem
                      sx={{
                        px: 1,
                        py: 1,
                        cursor: "pointer",
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: action.color + "08" },
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <ListItemIcon sx={{ color: action.color, minWidth: 40 }}>
                        {action.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={action.label}
                        slotProps={{
                          primary: {
                            sx: { fontWeight: 600, fontSize: "0.9rem" },
                          },
                        }}
                      />
                      <ArrowRight size={18} color="#cbd5e1" />
                    </ListItem>
                    {i < quickActions.length - 1 && <Divider />}
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Upcoming Events
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/alumni/events")}
                  sx={{ color: "#ec4899", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {events.filter((e) => e.status === "UPCOMING").length === 0 ? (
                <CommonEmptyState title="No upcoming events" />
              ) : (
                <List>
                  {events
                    .filter((e) => e.status === "UPCOMING")
                    .slice(0, 3)
                    .map((evt, i) => (
                      <Box key={evt.id}>
                        <ListItem
                          sx={{
                            px: 1,
                            py: 1,
                            cursor: "pointer",
                            borderRadius: 2,
                            "&:hover": { bgcolor: "rgba(236,72,153,0.05)" },
                          }}
                          onClick={() => navigate(`/alumni/events/${evt.id}`)}
                        >
                          <ListItemIcon sx={{ color: "#ec4899", minWidth: 40 }}>
                            <CalendarDays size={20} />
                          </ListItemIcon>
                          <ListItemText
                            primary={evt.title}
                            secondary={`${formatDate(evt.date)} • ${evt.location}`}
                            slotProps={{
                              primary: {
                                sx: { fontWeight: 600, fontSize: "0.875rem" },
                              },
                              secondary: { sx: { fontSize: "0.75rem" } },
                            }}
                          />
                        </ListItem>
                        {i < 2 && <Divider />}
                      </Box>
                    ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
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
                      background: "linear-gradient(180deg, #f59e0b, #fbbf24)",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Recent Notices
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/alumni/notices")}
                  sx={{ color: "#f59e0b", fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              {notices.length === 0 ? (
                <CommonEmptyState title="No notices available" />
              ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {notices
                    .filter((n) => n.status === "PUBLISHED")
                    .slice(0, 3)
                    .map((notice) => (
                      <Grid key={notice.id} size={{ xs: 12, md: 6 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2.5,
                            p: 2,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "#6366f1",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                            },
                          }}
                          onClick={() =>
                            navigate(`/alumni/notices/${notice.id}`)
                          }
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 1,
                            }}
                          >
                            <Bell size={14} color="#f59e0b" />
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                color: "#f59e0b",
                              }}
                            >
                              {notice.category}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {notice.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ display: "block", color: "text.secondary" }}
                          >
                            {formatDate(notice.publishDate)}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
