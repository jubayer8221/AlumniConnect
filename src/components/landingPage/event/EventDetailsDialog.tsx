import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  X,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Building2,
  CalendarClock,
} from "lucide-react";
import { formatDate, formatTime, isUpcoming } from "@/utils/dateUtils";
import type { EventItem } from "@/types/event";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  event: EventItem | null;
  onClose: () => void;
  /** Called when an unauthenticated user clicks "Login to Register". */
  onLoginClick?: () => void;
  /** Called when an authenticated user clicks "Register Now". */
  onRegisterClick?: (event: EventItem) => void;
}

/* ------------------------------------------------------------------
   Returns true when `dateStr` is today or in the future.
   Compares dates only — time of day is ignored, so a deadline of
   "today at 00:00" still counts as open.
   ------------------------------------------------------------------ */
function isTodayOrFuture(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  return d.getTime() >= today.getTime();
}

export default function EventDetailsDialog({
  open,
  event,
  onClose,
  onLoginClick,
  onRegisterClick,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useAuth();

  if (!event) return null;

  const evt = event;
  const upcoming = isUpcoming(evt.date);

  /* Registration is open only when the deadline is today or in the future.
     If no deadline is set, fall back to "event is upcoming". */
  const registrationOpen = evt.registrationDeadline
    ? isTodayOrFuture(evt.registrationDeadline)
    : upcoming;

  /* Deadline has passed but the event itself hasn't happened yet. */
  const registrationClosedButEventUpcoming =
    !registrationOpen && upcoming && !!evt.registrationDeadline;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
            position: "relative",
            maxHeight: { xs: "100%", sm: "90vh" },
          },
        },
      }}
    >
      {/* Close button — always reachable, even after scrolling */}
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: "rgba(var(--rgb-black), 0.5)",
          color: "var(--color-white)",
          "&:hover": { bgcolor: "rgba(var(--rgb-black), 0.7)" },
        }}
      >
        <X size={20} />
      </IconButton>

      {/* ============================================================
          Single scrollable region
         ============================================================ */}
      <DialogContent
        sx={{
          p: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          "&.MuiDialogContent-root": { p: 0 },
        }}
      >
        {/* ---------- Banner ---------- */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 180, sm: 260 },
            bgcolor: "action.hover",
            backgroundImage: evt.image ? `url(${evt.image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%)",
              pointerEvents: "none",
            }}
          />
        </Box>

        {/* ---------- Title block ---------- */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 2.5, pb: 1 }}>
          <Box sx={{ display: "flex", gap: 0.5, mb: 1.5, flexWrap: "wrap" }}>
            {evt.eventType && (
              <Chip label={evt.eventType} size="small" color="primary" />
            )}
            {upcoming ? (
              <Chip
                label="Upcoming"
                size="small"
                sx={{
                  bgcolor: "success.main",
                  color: "var(--color-white)",
                  fontWeight: 600,
                }}
              />
            ) : (
              evt.status && (
                <Chip label={evt.status} size="small" variant="outlined" />
              )
            )}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              fontSize: { xs: "1.15rem", sm: "1.4rem" },
            }}
          >
            {evt.title}
          </Typography>
        </Box>

        {/* ---------- Description + details ---------- */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 2, pb: 3 }}>
          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.7,
              mb: 3,
              whiteSpace: "pre-line",
            }}
          >
            {evt.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<CalendarDays size={18} color="var(--color-primary)" />}
                label="Date"
                value={formatDate(evt.date)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<Clock size={18} color="var(--color-primary)" />}
                label="Time"
                value={`${formatTime(evt.startTime)} – ${formatTime(evt.endTime)}`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<MapPin size={18} color="var(--color-primary)" />}
                label="Venue"
                value={`${evt.venue}${evt.location ? `, ${evt.location}` : ""}`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<Users size={18} color="var(--color-primary)" />}
                label="Organizer"
                value={evt.organizer}
              />
            </Grid>
            {evt.registrationDeadline && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailRow
                  icon={
                    <CalendarClock size={18} color="var(--color-primary)" />
                  }
                  label="Registration Deadline"
                  value={formatDate(evt.registrationDeadline)}
                />
              </Grid>
            )}
            {evt.capacity > 0 && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailRow
                  icon={<Building2 size={18} color="var(--color-primary)" />}
                  label="Capacity"
                  value={`${evt.capacity} seats`}
                />
              </Grid>
            )}
          </Grid>

          {/* ============================================================
              CTA — driven by the registration deadline.
             ============================================================ */}
          {registrationOpen ? (
            <>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {isAuthenticated ? (
                  <>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                    >
                      Reserve your spot — seats are limited.
                    </Typography>
                    {onRegisterClick && (
                      <Button
                        variant="contained"
                        onClick={() => onRegisterClick(evt)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Register Now
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                    >
                      Interested? Sign in to register for this event.
                    </Typography>
                    {onLoginClick && (
                      <Button
                        variant="contained"
                        onClick={onLoginClick}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Login to Register
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </>
          ) : registrationClosedButEventUpcoming ? (
            <>
              <Divider sx={{ my: 3 }} />
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Registration for this event has closed.
              </Alert>
            </>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
      <Box sx={{ mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, mt: 0.25 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
