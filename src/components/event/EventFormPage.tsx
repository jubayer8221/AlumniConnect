import { Box, Grid } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { Controller, useForm, type Control } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { format, isValid } from "date-fns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
import type { EventStatus, EventType } from "@/types/event";
import { getApiErrorMessage } from "@/utils/apiError";
import { uploadImage } from "@/services/api/uploadService";
import { hasAdminAccess } from "@/utils/authUtils";

const eventSchema = yup
  .object({
    title: yup.string().trim().required("Title is required"),
    description: yup.string().trim().required("Description is required"),
    eventType: yup.string().required("Event type is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().required("End date is required"),
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
  })
  .test("end-after-start", function (values) {
    if (
      !values?.startDate ||
      !values.endDate ||
      !values.startTime ||
      !values.endTime
    ) {
      return true;
    }

    const startDateTime = Date.parse(`${values.startDate}T${values.startTime}`);
    const endDateTime = Date.parse(`${values.endDate}T${values.endTime}`);
    if (!Number.isFinite(startDateTime) || !Number.isFinite(endDateTime)) {
      return true;
    }

    return (
      endDateTime >= startDateTime ||
      this.createError({
        path: values.endDate < values.startDate ? "endDate" : "endTime",
        message: "End date/time cannot be before start date/time.",
      })
    );
  });

type EventFormValues = yup.InferType<typeof eventSchema>;

function EventTimeField({
  name,
  label,
  control,
}: {
  name: "startTime" | "endTime";
  label: string;
  control: Control<EventFormValues>;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TimePicker
            label={label}
            ampm
            value={
              field.value ? new Date(`2000-01-01T${field.value}:00`) : null
            }
            onChange={(time) => {
              field.onChange(
                time && isValid(time) ? format(time, "HH:mm") : "",
              );
            }}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
                size: "small",
                error: Boolean(fieldState.error),
                helperText: fieldState.error?.message ?? "",
                onBlur: field.onBlur,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}

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
  eventType: data.eventType as EventType,
  status: data.status as EventStatus,
  startDate: toIsoDateTime(data.startDate, data.startTime),
  endDate: toIsoDateTime(data.endDate, data.endTime),
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
        startDate: "",
        endDate: "",
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
      navigate("/alumni/explore/events", { replace: true });
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
        startDate: selectedEvent.date,
        endDate: selectedEvent.endDate || selectedEvent.date,
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
        navigate(`/alumni/explore/events/${id}`);
      } else {
        await createEvent(payload);
        dispatch(
          showToast({
            message: "Event created successfully",
            severity: "success",
          }),
        );
        navigate("/alumni/explore/events");
      }
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save event"),
          severity: "error",
        }),
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
          { label: "Events", path: "/alumni/explore/events" },
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
                name="startDate"
                label="Start Date"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDatePicker
                name="endDate"
                label="End Date"
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
              <EventTimeField
                name="startTime"
                label="Start Time"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <EventTimeField
                name="endTime"
                label="End Time"
                control={control}
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
                variant="cover"
                label="Upload Event Banner"
                currentFile={watch("image") || undefined}
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
