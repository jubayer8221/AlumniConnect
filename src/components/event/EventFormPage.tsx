import { Box } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createEventAsync,
  updateEventAsync,
  fetchEventByIdAsync,
} from "@/store/Slice/eventSlice";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonSelectField,
  CommonDatePicker,
  CommonTextArea,
  CommonButton,
  CommonLoading,
  CommonCard,
} from "@/components/common";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { getApiErrorMessage } from "@/utils/apiError";

/* ============================================================
   Form validation — inline
   ============================================================ */
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

export default function EventFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;

  const { selectedEvent, loading } = useAppSelector((s) => s.events);
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const { control, handleSubmit, reset, formState } = useForm<EventFormValues>({
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
    },
  });

  // ★ Fetch the existing event when editing, only if not already loaded
  useEffect(() => {
    if (isEdit && id && (!selectedEvent || selectedEvent.id !== id)) {
      void dispatch(fetchEventByIdAsync(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  // Populate the form once the event is in the store
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

  // ★ Real submit handler — actually dispatches the create/update thunk
  const onSubmit = async (data: EventFormValues) => {
    try {
      if (isEdit && id) {
        const res = await dispatch(
          updateEventAsync({
            id,
            data: { ...data, id } as never,
          }),
        );

        if (updateEventAsync.fulfilled.match(res)) {
          dispatch(
            showToast({
              message: "Event updated successfully",
              severity: "success",
            }),
          );
          navigate(`/events/${id}`);
        } else {
          const message =
            typeof res.payload === "string"
              ? res.payload
              : "Unable to update event";
          dispatch(showToast({ message, severity: "error" }));
        }
      } else {
        const res = await dispatch(createEventAsync(data as never));

        if (createEventAsync.fulfilled.match(res)) {
          dispatch(
            showToast({
              message: "Event created successfully",
              severity: "success",
            }),
          );
          navigate("/events");
        } else {
          const message =
            typeof res.payload === "string"
              ? res.payload
              : "Unable to create event";
          dispatch(showToast({ message, severity: "error" }));
        }
      }
    } catch (error) {
      dispatch(
        showToast({
          message: getApiErrorMessage(error, "Unable to save event"),
          severity: "error",
        }),
      );
    }
  };

  if (loading && isEdit && !selectedEvent) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Event" : "Create Event"}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Events", path: "/events" },
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CommonInputField
              name="title"
              label="Event Title"
              control={control}
              required
            />
            <CommonSelectField
              name="eventType"
              label="Event Type"
              control={control}
              options={eventTypeOptions}
              required
              placeholder="Select"
            />
            <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
              <CommonTextArea
                name="description"
                label="Description"
                control={control}
                required
                rows={3}
              />
            </Box>
            <CommonDatePicker
              name="date"
              label="Event Date"
              control={control}
              required
            />
            <CommonDatePicker
              name="registrationDeadline"
              label="Registration Deadline"
              control={control}
              required
            />
            <CommonInputField
              name="startTime"
              label="Start Time"
              control={control}
              required
              placeholder="e.g. 18:00"
            />
            <CommonInputField
              name="endTime"
              label="End Time"
              control={control}
              required
              placeholder="e.g. 22:00"
            />
            <CommonInputField
              name="location"
              label="Location"
              control={control}
              required
            />
            <CommonInputField
              name="venue"
              label="Venue"
              control={control}
              required
            />
            <CommonInputField
              name="organizer"
              label="Organizer"
              control={control}
              required
            />
            <CommonInputField
              name="capacity"
              label="Capacity"
              control={control}
              type="number"
              required
            />
            <CommonSelectField
              name="status"
              label="Status"
              control={control}
              options={statusOptions}
              required
            />
            <Box
              sx={{
                gridColumn: { xs: "1", sm: "span 2" },
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
          </Box>
        </CommonCard>
      </form>
    </Box>
  );
}
