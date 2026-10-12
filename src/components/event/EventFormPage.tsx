import { Box } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks";
import { useEvents } from "@/hooks/useEvents";
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
  CommonFileUpload,
} from "@/components/common";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import type { CreateUpdateEventPayload } from "@/hooks/useEvents";

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

  const { selectedEvent, loading, fetchEventById, createEvent, updateEvent } =
    useEvents();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  /** Raw file kept for a future dedicated upload endpoint */
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const imagePreview = watch("image");

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
      setImageFile(null);
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

  const handleImageSelect = (dataUrl: string, file: File) => {
    // Optional: basic size check (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        showToast({
          message: "Image must be 5 MB or smaller",
          severity: "error",
        }),
      );
      return;
    }
    setValue("image", dataUrl, { shouldDirty: true });
    setImageFile(file);
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      // If you later get a real upload URL from the server, replace data.image:
      // if (imageFile) {
      //   const url = await uploadEventImage(imageFile);
      //   data = { ...data, image: url };
      // }

      const payload = formToPayload(data);

      // imageFile is available here if API switches to multipart
      void imageFile;

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

  if (loading && isEdit && !selectedEvent) return <CommonLoading />;

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

            <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
              <CommonTextArea
                name="description"
                label="Description"
                control={control}
                required
                rows={3}
              />
            </Box>

            {/* Image upload */}
            <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
              <CommonFileUpload
                label="Upload Event Banner"
                accept="image/*"
                currentFile={imagePreview || undefined}
                previewSize={320}
                onFileSelect={handleImageSelect}
              />
            </Box>

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
