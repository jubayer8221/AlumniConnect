import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { formatDate, formatTime, isUpcoming } from "@/utils/dateUtils";
import LandingFooter from "../LandingFooter";
import LandingHeader from "../LandingHeader";

export default function PublicEventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedEvent: evt, loading, error, fetchEventById } = useEvents();

  useEffect(() => {
    if (!id) return;
    if (!evt || evt.id !== id) {
      void fetchEventById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const back = () => navigate(-1);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          {/* Back button */}
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={back}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              mb: 3,
            }}
          >
            Back to Events
          </Button>

          {/* Loading */}
          {loading && !evt && (
            <Typography sx={{ color: "text.secondary" }}>
              Loading event…
            </Typography>
          )}

          {/* Error */}
          {!loading && (error || !evt) && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Event not found
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 3 }}>
                This event may have been removed or the link is incorrect.
              </Typography>
              <Button variant="contained" onClick={back}>
                Browse events
              </Button>
            </Card>
          )}

          {/* Event content */}
          {evt && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              {evt.image && (
                <Box
                  component="img"
                  src={evt.image}
                  alt={evt.title}
                  onError={(e) => {
                    e.currentTarget.src = "/image/logo-small.png";
                  }}
                  sx={{
                    width: "100%",
                    height: { xs: 220, md: 320 },
                    objectFit: "cover",
                  }}
                />
              )}

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}
                >
                  <Chip label={evt.eventType} color="primary" />
                  {isUpcoming(evt.date) ? (
                    <Chip
                      label="Upcoming"
                      sx={{
                        bgcolor: "success.main",
                        color: "var(--color-white)",
                        fontWeight: 600,
                      }}
                    />
                  ) : (
                    <Chip label={evt.status} variant="outlined" />
                  )}
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {evt.title}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  {evt.description}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarDays size={18} color="var(--color-primary)" />
                      <Typography variant="body2">
                        <strong>Date:</strong> {formatDate(evt.date)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Clock size={18} color="var(--color-primary)" />
                      <Typography variant="body2">
                        <strong>Time:</strong> {formatTime(evt.startTime)} –{" "}
                        {formatTime(evt.endTime)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MapPin size={18} color="var(--color-primary)" />
                      <Typography variant="body2">
                        <strong>Venue:</strong> {evt.venue}, {evt.location}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Users size={18} color="var(--color-primary)" />
                      <Typography variant="body2">
                        <strong>Organizer:</strong> {evt.organizer}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* CTA — login to register */}
                {isUpcoming(evt.date) && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                      >
                        Interested? Sign in to register for this event.
                      </Typography>
                      <Button
                        component={Link}
                        to="/login"
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Login to Register
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
