import {
  Box,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Container,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { formatTime } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";
import EventDetailsDialog from "./EventDetailsDialog";

/* ---------- per-type color palette ---------- */
const typeColors: Record<string, string> = {
  Reunion: "#0f766e",
  Workshop: "#c2410c",
  Seminar: "#0ea5e9",
  Networking: "#7c3aed",
  Sports: "#16a34a",
  Cultural: "#db2777",
  Career: "#0891b2",
  Webinar: "#9333ea",
  Other: "#475569",
};

const getColor = (type?: string) => (type && typeColors[type]) || "#0f766e";

const getDayMonth = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "--", month: "---" };
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
};

export default function EventsSection() {
  const navigate = useNavigate();
  const { items, loading, error, fetchEvents } = useEvents();
  const [selected, setSelected] = useState<EventItem | null>(null);

  // Fetch the first 3 upcoming events once on mount
  useEffect(() => {
    void fetchEvents({ pageNumber: 1, pageSize: 3 });
  }, [fetchEvents]);

  // Guard against extra items (belt-and-braces — API already limits to 3)
  const events = (items ?? []).slice(0, 3);

  return (
    <Box id="events" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f6faf9" }}>
      <Container maxWidth="lg">
        {/* ---------- Header ---------- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-end" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 6,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1.5,
              }}
            >
              Upcoming Events
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Mark Your Calendar
            </Typography>
            <Typography
              sx={{ color: "text.secondary", maxWidth: 520, lineHeight: 1.7 }}
            >
              Stay connected with everything happening in the alumni community.
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate("/events")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            View All Events
          </Button>
        </Box>

        {/* ---------- Loading skeletons ---------- */}
        {loading && events.length === 0 && (
          <Grid container spacing={3} sx={{ p: 1 }}>
            {[0, 1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                  }}
                >
                  <Box sx={{ display: "flex", p: 3, gap: 2.5 }}>
                    <Skeleton variant="rounded" width={72} height={72} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton width="40%" height={20} />
                      <Skeleton width="90%" height={24} sx={{ mt: 1 }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="70%" height={16} sx={{ mt: 0.5 }} />
                    <Skeleton variant="rounded" height={40} sx={{ mt: 2.5 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ---------- Empty / error ---------- */}
        {!loading && (error || events.length === 0) && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              color: "text.secondary",
            }}
          >
            <CalendarDays size={40} style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              No upcoming events
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Check back soon — new events are added regularly.
            </Typography>
          </Box>
        )}

        {/* ---------- Cards ---------- */}
        {events.length > 0 && (
          <Grid container spacing={3}>
            {events.map((event) => {
              const color = getColor(event.eventType);
              const { day, month } = getDayMonth(event.date);

              return (
                <Grid key={event.id} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
                      bgcolor: "background.paper",
                      overflow: "hidden",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelected(event)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <Box sx={{ display: "flex", p: 3, gap: 2.5 }}>
                        {/* Date badge */}
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: 72,
                            height: 72,
                            borderRadius: 2.5,
                            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 8px 20px ${color}40`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.5rem",
                              fontWeight: 800,
                              lineHeight: 1,
                            }}
                          >
                            {day}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              mt: 0.25,
                            }}
                          >
                            {month}
                          </Typography>
                        </Box>

                        {/* Title + tag */}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          {event.eventType && event.eventType !== "Other" && (
                            <Chip
                              label={event.eventType}
                              size="small"
                              sx={{
                                bgcolor: color + "15",
                                color: color,
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                mb: 1,
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              mb: 1.5,
                              lineHeight: 1.35,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {event.title}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ pt: 0, px: 3, pb: 3, width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            pt: 2,
                            borderTop: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Clock size={14} color="#6b7280" />
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                              }}
                            >
                              {formatTime(event.startTime)} –{" "}
                              {formatTime(event.endTime)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <MapPin size={14} color="#6b7280" />
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {event.venue}
                              {event.location ? `, ${event.location}` : ""}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Button-look row (whole card is clickable) */}
                        <Box
                          sx={{
                            mt: 2.5,
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "text.primary",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          View Details <ArrowRight size={16} />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* ---------- Detail dialog ---------- */}
      <EventDetailsDialog
        open={!!selected}
        event={selected}
        onClose={() => setSelected(null)}
        onLoginClick={() => navigate("/login")}
      />
    </Box>
  );
}
