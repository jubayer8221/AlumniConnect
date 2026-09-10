import * as yup from "yup";

export const noticeSchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  publishDate: yup.string().required("Publish date is required"),
  category: yup
    .string()
    .oneOf(["Announcement", "News", "Event", "Achievement", "Career", "General"])
    .required("Category is required"),
  status: yup
    .string()
    .oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .required("Status is required"),
});

export type NoticeFormValues = yup.InferType<typeof noticeSchema>;
