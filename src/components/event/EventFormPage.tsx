import { Box, Grid } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonDropDown,
  CommonDatePicker,
  CommonTextArea,
  CommonButton,
  CommonLoading,
  CommonCard,
  CommonFileUpload,
} from "@/components/common";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import type { CreateUpdateEventPayload } from "@/hooks/useEvents";
import { getApiErrorMessage } from "@/utils/apiError";
import { uploadImage } from "@/services/api/uploadService";
import { hasAdminAccess } from "@/utils/authUtils";

const eventSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  eventType: yup.string().required("Event type is required"),
  date: yup.string().required("Event date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  location: yup.string().trim().required("Location is required"),
  venue: yup.string().trim().required("Venue is required"),
  organizer: yup.string().trim().required("Organizer is required"),
  registrationDeadline: yup
    .string()
    .required("Registration deadline is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  status: yup.string().required("Status is required"),
  image: yup.string().optional(),
});

type EventFormValues = yup.InferType<typeof eventSchema>;

const eventTypeOptions = [
  "Reunion",
  "Seminar",
  "Workshop",
  "Networking",
  "Sports",
  "Cultural",
  "Career",
  "Webinar",
  "Other",
].map((v) => ({ label: v, value: v }));

const statusOptions = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const toIsoDateTime = (date: string, time: string) => {
  const t = time.length === 5 ? `${time}:00` : time;
  return `${date}T${t}`;
};

const formToPayload = (data: EventFormValues): CreateUpdateEventPayload => ({
  eventTitle: data.title,
  description: data.description,
  startDate: toIsoDateTime(data.date, data.startTime),
  endDate: toIsoDateTime(data.date, data.endTime),
  location: data.location,
  venue: data.venue,
  organizer: data.organizer,
  capacity: data.capacity,
  regDeadline: data.registrationDeadline,
  image: data.image || undefined,
});

export default function EventFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;

  const { authUser: user } = useAuth();
  const canManage = hasAdminAccess(user?.role);

  const { selectedEvent, loading, fetchEventById, createEvent, updateEvent } =
    useEvents();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const { control, handleSubmit, reset, setValue, watch, formState } =
    useForm<EventFormValues>({
      resolver: yupResolver(eventSchema) as never,
      defaultValues: {
        title: "",
        description: "",
        eventType: "" as never,
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        venue: "",
        organizer: "",
        registrationDeadline: "",
        capacity: undefined as never,
        status: "UPCOMING" as never,
        image: "",
      },
    });

  // Non-admin → redirect away
  useEffect(() => {
    if (user && !canManage) {
      dispatch(
        showToast({
          message: "Only admins can create or edit events",
          severity: "error",
        }),
      );
      navigate("/alumni/events", { replace: true });
    }
  }, [user, canManage, dispatch, navigate]);

  useEffect(() => {
    if (isEdit && id && (!selectedEvent || selectedEvent.id !== id)) {
      void fetchEventById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedEvent && selectedEvent.id === id) {
      reset({
        title: selectedEvent.title,
        description: selectedEvent.description,
        eventType: selectedEvent.eventType as never,
        date: selectedEvent.date,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        location: selectedEvent.location,
        venue: selectedEvent.venue,
        organizer: selectedEvent.organizer,
        registrationDeadline: selectedEvent.registrationDeadline,
        capacity: selectedEvent.capacity as never,
        status: selectedEvent.status as never,
        image: selectedEvent.image ?? "",
      });
    }
  }, [isEdit, id, selectedEvent, reset]);

  useEffect(() => {
    if (!isEdit || !selectedEvent) return;
    setBreadcrumbLabel(location.pathname, selectedEvent.title);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    isEdit,
    location.pathname,
    selectedEvent,
    setBreadcrumbLabel,
  ]);

  const onSubmit = async (data: EventFormValues) => {
    if (!canManage) {
      dispatch(
        showToast({
          message: "Only admins can create or edit events",
          severity: "error",
        }),
      );
      return;
    }

    try {
      const payload = formToPayload(data);

      if (isEdit && id) {
        await updateEvent(id, payload);
        dispatch(
          showToast({
            message: "Event updated successfully",
            severity: "success",
          }),
        );
        navigate(`/alumni/events/${id}`);
      } else {
        await createEvent(payload);
        dispatch(
          showToast({
            message: "Event created successfully",
            severity: "success",
          }),
        );
        navigate("/alumni/events");
      }
    } catch {
      dispatch(
        showToast({ message: "Unable to save event", severity: "error" }),
      );
    }
  };

  if (!canManage) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Event" : "Create Event"}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Events", path: "/alumni/events" },
          { label: isEdit ? "Edit" : "Create" },
        ]}
        actions={
          <CommonButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Back
          </CommonButton>
        }
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonCard>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="title"
                label="Event Title"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="eventType"
                label="Event Type"
                control={control}
                menuItems={eventTypeOptions}
                required
                placeholder="Select"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDatePicker
                name="date"
                label="Event Date"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDatePicker
                name="registrationDeadline"
                label="Registration Deadline"
                control={control}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="startTime"
                label="Start Time"
                control={control}
                required
                placeholder="e.g. 18:00"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="endTime"
                label="End Time"
                control={control}
                required
                placeholder="e.g. 22:00"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="location"
                label="Location"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="venue"
                label="Venue"
                control={control}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="organizer"
                label="Organizer"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="capacity"
                label="Capacity"
                control={control}
                type="number"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="status"
                label="Status"
                control={control}
                menuItems={statusOptions}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="description"
                label="Description"
                control={control}
                required
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                label="Upload Event Banner"
                currentFile={watch("image") || undefined}
                previewSize={320}
                onFileSelect={async (preview, file) => {
                  setValue("image", preview, { shouldDirty: true });
                  try {
                    const url = await uploadImage(file);
                    setValue("image", url, { shouldDirty: true });
                  } catch (err) {
                    dispatch(
                      showToast({
                        message: getApiErrorMessage(
                          err,
                          "Failed to upload image",
                        ),
                        severity: "error",
                      }),
                    );
                    setValue("image", "", { shouldDirty: true });
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <CommonButton variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </CommonButton>
                <CommonButton
                  type="submit"
                  loading={formState.isSubmitting}
                  startIcon={<Save size={18} />}
                >
                  {isEdit ? "Update Event" : "Create Event"}
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </CommonCard>
      </form>
    </Box>
  );
}
