import { Box, Card, CardContent } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchEventByIdAsync, createEventAsync, updateEventAsync } from "@/Slice/eventSlice";
import { showToast } from "@/Slice/uiSlice";
import { eventSchema, type EventFormValues } from "@/validation/eventValidation";
import {
  CommonPageHeader, CommonInputField, CommonSelectField, CommonDatePicker,
  CommonTextArea, CommonButton, CommonLoading, CommonCard,
} from "@/components/common";

const eventTypeOptions = ["Reunion", "Seminar", "Workshop", "Networking", "Sports", "Cultural", "Career", "Webinar", "Other"].map((v) => ({ label: v, value: v }));
const statusOptions = [{ label: "Upcoming", value: "UPCOMING" }, { label: "Ongoing", value: "ONGOING" }, { label: "Completed", value: "COMPLETED" }, { label: "Cancelled", value: "CANCELLED" }];

export default function EventFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const { selectedEvent, loading } = useAppSelector((s) => s.events);
  const { control, handleSubmit, reset, formState } = useForm<EventFormValues>({
    resolver: yupResolver(eventSchema) as never,
    defaultValues: {
      title: "", description: "", eventType: "" as never, date: "", startTime: "",
      endTime: "", location: "", venue: "", organizer: "", registrationDeadline: "",
      capacity: undefined as never, status: "UPCOMING" as never,
    },
  });

  useEffect(() => { if (isEdit && id) dispatch(fetchEventByIdAsync(id)); }, [dispatch, isEdit, id]);
  useEffect(() => {
    if (isEdit && selectedEvent) {
      reset({
        title: selectedEvent.title, description: selectedEvent.description,
        eventType: selectedEvent.eventType as never, date: selectedEvent.date,
        startTime: selectedEvent.startTime, endTime: selectedEvent.endTime,
        location: selectedEvent.location, venue: selectedEvent.venue,
        organizer: selectedEvent.organizer, registrationDeadline: selectedEvent.registrationDeadline,
        capacity: selectedEvent.capacity as never, status: selectedEvent.status as never,
      });
    }
  }, [isEdit, selectedEvent, reset]);

  const onSubmit = async (data: EventFormValues) => {
    if (isEdit && id) {
      const res = await dispatch(updateEventAsync({ id, data: { ...data, id } }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(showToast({ message: "Event updated successfully", severity: "success" }));
        navigate(`/events/${id}`);
      }
    } else {
      const res = await dispatch(createEventAsync(data as never));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(showToast({ message: "Event created successfully", severity: "success" }));
        navigate("/events");
      }
    }
  };

  if (loading && isEdit && !selectedEvent) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Event" : "Create Event"}
        breadcrumbs={[{ label: "Home", path: "/dashboard" }, { label: "Events", path: "/events" }, { label: isEdit ? "Edit" : "Create" }]}
        actions={<CommonButton variant="outlined" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>Back</CommonButton>}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonCard>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <CommonInputField name="title" label="Event Title" control={control} required />
            <CommonSelectField name="eventType" label="Event Type" control={control} options={eventTypeOptions} required placeholder="Select" />
            <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
              <CommonTextArea name="description" label="Description" control={control} required rows={3} />
            </Box>
            <CommonDatePicker name="date" label="Event Date" control={control} required />
            <CommonDatePicker name="registrationDeadline" label="Registration Deadline" control={control} required />
            <CommonInputField name="startTime" label="Start Time" control={control} required placeholder="e.g. 18:00" />
            <CommonInputField name="endTime" label="End Time" control={control} required placeholder="e.g. 22:00" />
            <CommonInputField name="location" label="Location" control={control} required />
            <CommonInputField name="venue" label="Venue" control={control} required />
            <CommonInputField name="organizer" label="Organizer" control={control} required />
            <CommonInputField name="capacity" label="Capacity" control={control} type="number" required />
            <CommonSelectField name="status" label="Status" control={control} options={statusOptions} required />
            <Box sx={{ gridColumn: { xs: "1", sm: "span 2" }, display: "flex", gap: 2, justifyContent: "flex-end", mt: 1 }}>
              <CommonButton variant="outlined" onClick={() => navigate(-1)}>Cancel</CommonButton>
              <CommonButton type="submit" loading={formState.isSubmitting} startIcon={<Save size={18} />}>{isEdit ? "Update Event" : "Create Event"}</CommonButton>
            </Box>
          </Box>
        </CommonCard>
      </form>
    </Box>
  );
}
