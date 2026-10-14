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
  Reunion: "var(--color-primary)",
  Workshop: "var(--color-category-orange)",
  Seminar: "var(--color-info)",
  Networking: "var(--color-chart-purple-dark)",
  Sports: "var(--color-success)",
  Cultural: "var(--color-chart-pink-dark)",
  Career: "var(--color-chart-cyan-dark)",
  Webinar: "var(--color-chart-purple-deep)",
  Other: "var(--color-chart-slate)",
};

const getColor = (type?: string) =>
  (type && typeColors[type]) || "var(--color-primary)";

const getDayMonth = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "--", month: "---" };
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
};

const EVENTS_PER_ROW = 4;

export default function EventsSection() {
  const navigate = useNavigate();
  const { items, loading, error, fetchEvents } = useEvents();
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    void fetchEvents({
      pageNumber: 1,
      pageSize: EVENTS_PER_ROW,
      upcomingOnly: true,
    });
  }, [fetchEvents]);

  const events = (items ?? []).slice(0, EVENTS_PER_ROW);

  return (
    <Box
      sx={{
        py: 6,
        bgcolor: "var(--color-light-surface-green)",
      }}
    >
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
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                mb: 1,
                textAlign: "center",
              }}
            >
              Upcoming Events
            </Typography>
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
              Events
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate("/events")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
              py: 1,
            }}
          >
            View All
          </Button>
        </Box>

        {loading && events.length === 0 && (
          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {[0, 1, 2, 3].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton
                  variant="rounded"
                  height={340}
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
          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            sx={{ alignItems: "stretch" }}
          >
            {events.map((event) => {
              const color = getColor(event.eventType);
              const { day, month } = getDayMonth(event.date);

              return (
                <Grid key={event.id} size={{ xs: 12, sm: 6, md: 3 }}>
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
                        boxShadow: "0 20px 40px rgba(var(--rgb-black), 0.08)",
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
                          height: 150,
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="img"
                          src={event.image || "/image/logo-small.png"}
                          alt={event.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = "/image/logo-small.png";
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
                            left: 12,
                            bottom: -18,
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 80%, transparent) 100%)`,
                            color: "var(--color-white)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 8px 20px color-mix(in srgb, ${color} 25%, transparent)`,
                            border: "3px solid var(--color-white)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: 800,
                              lineHeight: 1,
                            }}
                          >
                            {day}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.6rem",
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
                          pt: 3.5,
                          px: 2.25,
                          pb: 2.25,
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
                              fontSize: "0.65rem",
                              height: 22,
                              mb: 1,
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            mb: 1.25,
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.6rem",
                          }}
                        >
                          {event.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                            mb: 1.75,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <Clock size={13} color="var(--color-gray500)" />
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
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
                              gap: 0.75,
                            }}
                          >
                            <MapPin size={13} color="var(--color-gray500)" />
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
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
                            py: 0.85,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        >
                          View Details <ArrowRight size={14} />
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
