import * as yup from "yup";

export const eventSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  eventType: yup
    .string()
    .oneOf(
      ["Reunion", "Seminar", "Workshop", "Networking", "Sports", "Cultural", "Career", "Webinar", "Other"],
      "Invalid event type"
    )
    .required("Event type is required"),
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  location: yup.string().required("Location is required"),
  venue: yup.string().required("Venue is required"),
  organizer: yup.string().required("Organizer is required"),
  registrationDeadline: yup.string().required("Registration deadline is required"),
  capacity: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .integer("Must be a whole number")
    .required("Capacity is required"),
  status: yup
    .string()
    .oneOf(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"])
    .required("Status is required"),
});

export type EventFormValues = yup.InferType<typeof eventSchema>;
