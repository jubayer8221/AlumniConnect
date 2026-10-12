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

  useEffect(() => {
    void fetchEvents({ pageNumber: 1, pageSize: 3, upcomingOnly: true });
  }, [fetchEvents]);

  const events = (items ?? []).slice(0, 3);

  return (
    <Box id="events" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f6faf9" }}>
      <Container maxWidth="lg">
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

        {loading && events.length === 0 && (
          <Grid container spacing={3}>
            {[0, 1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={360}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

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

        {events.length > 0 && (
          <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            {events.map((event) => {
              const color = getColor(event.eventType);
              const { day, month } = getDayMonth(event.date);

              return (
                <Grid key={event.id} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
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
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      {/* Image + date badge overlay */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 180,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="img"
                          src={event.image || "/image/favicon.png"}
                          alt={event.title}
                          onError={(e) => {
                            e.currentTarget.src = "/image/favicon.png";
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: 16,
                            bottom: -20,
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 8px 20px ${color}40`,
                            border: "3px solid #fff",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: 800,
                              lineHeight: 1,
                            }}
                          >
                            {day}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                            }}
                          >
                            {month}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent
                        sx={{
                          pt: 4,
                          px: 3,
                          pb: 3,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {event.eventType && event.eventType !== "Other" && (
                          <Chip
                            label={event.eventType}
                            size="small"
                            sx={{
                              alignSelf: "flex-start",
                              bgcolor: color + "15",
                              color,
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
                            minHeight: "2.7rem",
                          }}
                        >
                          {event.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mb: 2,
                            flex: 1,
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

                        <Box
                          sx={{
                            mt: "auto",
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            fontSize: "0.875rem",
                            fontWeight: 600,
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

      <EventDetailsDialog
        open={!!selected}
        event={selected}
        onClose={() => setSelected(null)}
        onLoginClick={() => navigate("/login")}
      />
    </Box>
  );
}
