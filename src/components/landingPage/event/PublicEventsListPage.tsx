import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  Skeleton,
  CardActionArea,
} from "@mui/material";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Calendar,
  Users,
  Globe,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { formatDate, formatTime } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";
import LandingHeader from "../LandingHeader";
import LandingFooter from "../LandingFooter";
import EventDetailsDialog from "./EventDetailsDialog";
import CommonBanner from "@/components/common/CommonBanner";

export default function PublicEventsListPage() {
  const navigate = useNavigate();
  const { items, loading, error, fetchEvents } = useEvents();
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    void fetchEvents({ pageNumber: 1, pageSize: 50 });
  }, [fetchEvents]);

  const eventCount = items?.length ?? 0;

  // Dynamic banner stats
  const eventStats = [
    {
      icon: <Calendar size={22} />,
      value: `${eventCount}+`,
      label: "Upcoming Events",
    },
    {
      icon: <Globe size={22} />,
      value: "Global",
      label: "Chapters & Meets",
    },
    {
      icon: <Users size={22} />,
      value: "Active",
      label: "Community Gatherings",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      {/* Page Banner Header */}
      <CommonBanner
        badge="Community Gatherings"
        title="Connect, Celebrate, and Relive"
        highlightText="Alumni Events"
        subtitle="Explore upcoming reunions, networking sessions, and cultural programs organized by the network across the globe."
        stats={eventStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {loading && (!items || items.length === 0) && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && (error || !items?.length) && (
            <Box
              sx={{
                py: 10,
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
                Please check back later.
              </Typography>
            </Box>
          )}

          {items && items.length > 0 && (
            <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
              {items.map((evt: EventItem) => (
                <Grid key={evt.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 16px 32px rgba(var(--rgb-black), 0.08)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelected(evt)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      {/* Always same image height */}
                      <Box
                        sx={{
                          width: "100%",
                          height: 180,
                          flexShrink: 0,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Box
                          component="img"
                          src={evt.image || "/image/logo-small.png"}
                          alt={evt.title}
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
                      </Box>

                      <CardContent
                        sx={{
                          p: 3,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {evt.eventType && evt.eventType !== "Other" && (
                          <Chip
                            label={evt.eventType}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1.5, alignSelf: "flex-start" }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            lineHeight: 1.35,
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.8rem",
                          }}
                        >
                          {evt.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                            flex: 1,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "text.secondary",
                            }}
                          >
                            <CalendarDays size={14} /> {formatDate(evt.date)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "text.secondary",
                            }}
                          >
                            <Clock size={14} /> {formatTime(evt.startTime)} –{" "}
                            {formatTime(evt.endTime)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "text.secondary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <MapPin size={14} /> {evt.venue}
                            {evt.location ? `, ${evt.location}` : ""}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            color: "primary.main",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            py: 1,
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
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <EventDetailsDialog
        open={!!selected}
        event={selected}
        onClose={() => setSelected(null)}
        onLoginClick={() => navigate("/login")}
      />

      <LandingFooter />
    </Box>
  );
}
