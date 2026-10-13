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
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { useEvents } from "@/hooks/useEvents";
import { useNotices } from "@/hooks/useNotices";
import {
  CommonLoading,
  CommonPageHeader,
  CommonEmptyState,
} from "@/components/common";
import {
  calculateProfileCompletion,
  getMissingProfileFields,
} from "@/utils/profileCompletion";
import { formatDate } from "@/utils/dateUtils";
import Footer from "../common/Footer";

const cardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
  transition: "all 0.25s ease",
  "&:hover": { boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.06)" },
} as const;

export default function AlumniDashboardPage() {
  const navigate = useNavigate();

  const { authUser: user } = useAuth();
  const { selectedAlumni, loading, fetchAlumniById } = useAlumni();
  const { items: events, fetchEvents } = useEvents();
  const { items: notices, fetchNotices } = useNotices();

  useEffect(() => {
    if (user?.alumniId) {
      void fetchAlumniById(user.alumniId).catch(() => undefined);
    }
    void fetchEvents({ pageNumber: 1, pageSize: 5 });
    void fetchNotices({ pageNumber: 1, pageSize: 5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.alumniId]);

  if (loading && !selectedAlumni) return <CommonLoading />;
  if (!selectedAlumni) return <CommonEmptyState title="Profile not found" />;

  const p = selectedAlumni.personalInformation;
  const firstEdu = selectedAlumni.academicInformation[0];

  const completion = calculateProfileCompletion(selectedAlumni);
  const missing = getMissingProfileFields(selectedAlumni);

  const welcomeName =
    p.fullName?.trim() ||
    user?.displayName?.trim() ||
    user?.username ||
    "there";

  const quickActions = [
    {
      label: "View Profile",
      icon: <UserCircle size={20} />,
      path: `/alumni/${selectedAlumni.alumniID}`,
      color: "var(--color-chart-indigo)",
    },
    {
      label: "Edit Profile",
      icon: <Pencil size={20} />,
      path: "/alumni/profile-setup",
      color: "var(--color-chart-pink)",
    },
    {
      label: "Alumni Directory",
      icon: <Users size={20} />,
      path: "/alumni/directory",
      color: "var(--color-info)",
    },
    {
      label: "Upcoming Events",
      icon: <CalendarDays size={20} />,
      path: "/alumni/events",
      color: "var(--color-chart-emerald)",
    },
  ];

  const infoCards = [
    {
      label: "My Profile",
      value: p.fullName,
      icon: <UserCircle size={22} />,
      color: "var(--color-chart-indigo)",
    },
    {
      label: "My Batch",
      value: firstEdu?.batch || "—",
      icon: <Calendar size={22} />,
      color: "var(--color-chart-emerald)",
    },
    {
      label: "My Department",
      value: firstEdu?.departmentName || "—",
      icon: <Building2 size={22} />,
      color: "var(--color-warning)",
    },
    {
      label: "Graduation Year",
      value: firstEdu?.graduationYear?.toString() || "—",
      icon: <GraduationCap size={22} />,
      color: "var(--color-chart-purple)",
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title={`Welcome back, ${welcomeName}!`}
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
              "radial-gradient(circle, rgba(var(--rgb-chart-indigo), 0.08) 0%, transparent 70%)",
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
                  background: "linear-gradient(180deg, var(--color-chart-indigo), var(--color-chart-purple))",
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
                background: "linear-gradient(135deg, var(--color-chart-indigo), var(--color-chart-pink))",
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
              bgcolor: "rgba(var(--rgb-chart-indigo), 0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, var(--color-chart-indigo) 0%, var(--color-chart-purple) 50%, var(--color-chart-pink) 100%)",
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
                      background: `linear-gradient(135deg, ${card.color} 0%, color-mix(in srgb, ${card.color} 80%, transparent) 100%)`,
                      color: "white",
                      boxShadow: `0 4px 12px color-mix(in srgb, ${card.color} 19%, transparent)`,
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
                    background: "linear-gradient(180deg, var(--color-chart-indigo), var(--color-chart-purple))",
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
                      <ArrowRight size={18} color="var(--color-gray200)" />
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
                      background: "linear-gradient(180deg, var(--color-chart-pink), var(--color-chart-pink-light))",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Upcoming Events
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/alumni/events")}
                  sx={{ color: "var(--color-chart-pink)", fontWeight: 600 }}
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
                            "&:hover": { bgcolor: "rgba(var(--rgb-chart-pink), 0.05)" },
                          }}
                          onClick={() => navigate(`/alumni/events/${evt.id}`)}
                        >
                          <ListItemIcon sx={{ color: "var(--color-chart-pink)", minWidth: 40 }}>
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
                      background: "linear-gradient(180deg, var(--color-warning), var(--color-warning-light))",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Recent Notices
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => navigate("/alumni/notices")}
                  sx={{ color: "var(--color-warning)", fontWeight: 600 }}
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
                              borderColor: "var(--color-chart-indigo)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(var(--rgb-black), 0.06)",
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
                            <Bell size={14} color="var(--color-warning)" />
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                color: "var(--color-warning)",
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
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
