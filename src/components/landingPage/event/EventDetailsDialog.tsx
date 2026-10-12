import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
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

interface Props {
  open: boolean;
  event: EventItem | null;
  onClose: () => void;
  onLoginClick?: () => void;
}

export default function EventDetailsDialog({
  open,
  event,
  onClose,
  onLoginClick,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!event) return null;

  const evt = event;
  const upcoming = isUpcoming(evt.date);

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
          },
        },
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 180, sm: 260 },
          bgcolor: "action.hover",
          backgroundImage: evt.image ? `url(${evt.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Box sx={{ display: "flex", gap: 0.5, mb: 1.5, flexWrap: "wrap" }}>
          {evt.eventType && (
            <Chip label={evt.eventType} size="small" color="primary" />
          )}
          {upcoming ? (
            <Chip
              label="Upcoming"
              size="small"
              sx={{ bgcolor: "success.main", color: "#fff", fontWeight: 600 }}
            />
          ) : (
            evt.status && (
              <Chip label={evt.status} size="small" variant="outlined" />
            )
          )}
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.25 }}
        >
          {evt.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
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
              icon={<CalendarDays size={18} color="#0f766e" />}
              label="Date"
              value={formatDate(evt.date)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              icon={<Clock size={18} color="#0f766e" />}
              label="Time"
              value={`${formatTime(evt.startTime)} – ${formatTime(evt.endTime)}`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              icon={<MapPin size={18} color="#0f766e" />}
              label="Venue"
              value={`${evt.venue}${evt.location ? `, ${evt.location}` : ""}`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              icon={<Users size={18} color="#0f766e" />}
              label="Organizer"
              value={evt.organizer}
            />
          </Grid>
          {evt.registrationDeadline && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<CalendarClock size={18} color="#0f766e" />}
                label="Registration Deadline"
                value={formatDate(evt.registrationDeadline)}
              />
            </Grid>
          )}
          {evt.capacity > 0 && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailRow
                icon={<Building2 size={18} color="#0f766e" />}
                label="Capacity"
                value={`${evt.capacity} seats`}
              />
            </Grid>
          )}
        </Grid>

        {upcoming && onLoginClick && (
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
              <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                Interested? Sign in to register for this event.
              </Typography>
              <Button
                variant="contained"
                onClick={onLoginClick}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Login to Register
              </Button>
            </Box>
          </>
        )}
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
