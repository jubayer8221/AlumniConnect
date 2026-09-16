import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchEventByIdAsync,
  registerForEventAsync,
  cancelEventRegistrationAsync,
  fetchEventRegistrationsAsync,
  deleteEventAsync,
} from "@/Slice/eventSlice";
import { showToast } from "@/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonLoading,
  CommonEmptyState,
  CommonStatusBadge,
  CommonButton,
  CommonConfirmDialog,
} from "@/components/common";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { isUpcoming } from "@/utils/dateUtils";

export default function EventDetailsPage({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedEvent, registrations, loading } = useAppSelector(
    (s) => s.events,
  );
  const { user } = useAppSelector((s) => s.auth);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventByIdAsync(id));
      dispatch(fetchEventRegistrationsAsync(id));
    }
  }, [dispatch, id]);

  if (loading && !selectedEvent) return <CommonLoading />;
  if (!selectedEvent) return <CommonEmptyState title="Event not found" />;

  const evt = selectedEvent;
  const myAlumniId = user?.alumniId || "";
  const isRegistered = registrations.some(
    (r) => r.alumniId === myAlumniId && r.status === "REGISTERED",
  );
  const activeRegs = registrations.filter((r) => r.status === "REGISTERED");
  const seatsLeft = evt.capacity - activeRegs.length;
  const canRegister = isUpcoming(evt.date) && seatsLeft > 0 && !isRegistered;
  const basePath = isAdmin ? "/events" : "/alumni/events";

  const handleRegister = async () => {
    const res = await dispatch(
      registerForEventAsync({ eventId: evt.id, alumniId: myAlumniId }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({ message: "Registered successfully!", severity: "success" }),
      );
      dispatch(fetchEventRegistrationsAsync(evt.id));
    } else {
      dispatch(
        showToast({ message: "Registration failed", severity: "error" }),
      );
    }
  };

  const handleCancel = async () => {
    const res = await dispatch(
      cancelEventRegistrationAsync({ eventId: evt.id, alumniId: myAlumniId }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({ message: "Registration cancelled", severity: "info" }),
      );
      dispatch(fetchEventRegistrationsAsync(evt.id));
    }
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteEventAsync(evt.id));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({
          message: "Event deleted successfully",
          severity: "success",
        }),
      );
      navigate(basePath);
    }
    setConfirmDelete(false);
  };

  return (
    <Box>
      <CommonPageHeader
        title={evt.title}
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Events", path: basePath },
          { label: evt.eventId },
        ]}
        actions={
          <CommonButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(basePath)}
          >
            Back
          </CommonButton>
        }
      />

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
        }}
      >
        {evt.image && (
          <Box
            component="img"
            src={evt.image}
            alt={evt.title}
            onError={(event) => {
              event.currentTarget.src = "/image/favicon.png";
            }}
            sx={{ width: "100%", height: 300, objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
            <Chip label={evt.eventType} color="primary" />
            <CommonStatusBadge status={evt.status} />
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            {evt.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarDays size={18} className="text-blue-600" />{" "}
                  <strong>Date:</strong> {formatDate(evt.date)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Clock size={18} className="text-blue-600" />{" "}
                  <strong>Time:</strong> {formatTime(evt.startTime)} -{" "}
                  {formatTime(evt.endTime)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <MapPin size={18} className="text-blue-600" />{" "}
                  <strong>Venue:</strong> {evt.venue}, {evt.location}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Users size={18} className="text-blue-600" />{" "}
                  <strong>Organizer:</strong> {evt.organizer}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Registration Info
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Capacity
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {evt.capacity}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Registered
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {activeRegs.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Seats Left
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: seatsLeft > 0 ? "success.main" : "error.main",
                    }}
                  >
                    {seatsLeft}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Deadline
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(evt.registrationDeadline)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {!isAdmin &&
              (isRegistered ? (
                <>
                  <Alert
                    severity="success"
                    icon={<CheckCircle size={20} />}
                    sx={{ flexGrow: 1 }}
                  >
                    You are registered for this event!
                  </Alert>
                  <CommonButton
                    variant="outlined"
                    color="error"
                    startIcon={<XCircle size={18} />}
                    onClick={handleCancel}
                  >
                    Cancel Registration
                  </CommonButton>
                </>
              ) : canRegister ? (
                <CommonButton
                  variant="contained"
                  onClick={handleRegister}
                  startIcon={<CheckCircle size={18} />}
                >
                  Register Now
                </CommonButton>
              ) : !isUpcoming(evt.date) ? (
                <Alert severity="info" sx={{ flexGrow: 1 }}>
                  Registration closed for this event.
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ flexGrow: 1 }}>
                  Event is at full capacity.
                </Alert>
              ))}
            {isAdmin && (
              <>
                <CommonButton
                  variant="outlined"
                  startIcon={<Pencil size={18} />}
                  onClick={() => navigate(`/events/${evt.id}/edit`)}
                >
                  Edit Event
                </CommonButton>
                <CommonButton
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={18} />}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </CommonButton>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <CommonConfirmDialog
        open={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${evt.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Box>
  );
}
