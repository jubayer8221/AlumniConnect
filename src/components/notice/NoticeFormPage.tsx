import { Box } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { useNotices } from "@/hooks/useNotices";
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
} from "@/components/common";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";

/* ============================================================
   Form validation — inline Yup
   ============================================================ */
const noticeSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  content: yup.string().trim().required("Content is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  publishDate: yup.string().required("Publish date is required"),
  image: yup.string().optional(),
});

type NoticeFormValues = yup.InferType<typeof noticeSchema>;

const categoryOptions = [
  "Announcement",
  "News",
  "Event",
  "Achievement",
  "Career",
  "General",
].map((v) => ({ label: v, value: v }));

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function NoticeFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const { selectedNotice, loading, fetchNoticeById, createNotice, updateNotice } = useNotices();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const { control, handleSubmit, reset, formState } = useForm<NoticeFormValues>(
    {
      resolver: yupResolver(noticeSchema) as never,
      defaultValues: {
        title: "",
        content: "",
        publishDate: "",
        category: "" as never,
        status: "DRAFT" as never,
      },
    },
  );

  // ★ Fetch existing only if empty / different record
  useEffect(() => {
    if (isEdit && id && (!selectedNotice || selectedNotice.id !== id)) {
      void fetchNoticeById(id).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedNotice) {
      reset({
        title: selectedNotice.title,
        content: selectedNotice.content,
        publishDate: selectedNotice.publishDate,
        category: selectedNotice.category as never,
        status: selectedNotice.status as never,
      });
    }
  }, [isEdit, selectedNotice, reset]);

  useEffect(() => {
    if (!isEdit || !selectedNotice) return;
    setBreadcrumbLabel(location.pathname, selectedNotice.title);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    isEdit,
    location.pathname,
    selectedNotice,
    setBreadcrumbLabel,
  ]);

  const onSubmit = async (data: NoticeFormValues) => {
    if (isEdit && id) {
      try {
        await updateNotice(id, { ...data, id } as never);
        // refetch list to reflect the update
        dispatch(
          showToast({
            message: "Notice updated successfully",
            severity: "success",
          }),
        );
        navigate(`/alumni/explore/notices/${id}`);
      } catch (error) {
        dispatch(showToast({
          message: typeof error === "string" ? error : error instanceof Error ? error.message : "Unable to update notice",
          severity: "error",
        }));
      }
    } else {
      try {
        await createNotice(data as never);
        dispatch(
          showToast({
            message: "Notice created successfully",
            severity: "success",
          }),
        );
        navigate("/alumni/explore/notices");
      } catch (error) {
        dispatch(showToast({
          message: typeof error === "string" ? error : error instanceof Error ? error.message : "Unable to create notice",
          severity: "error",
        }));
      }
    }
  };

  if (loading && isEdit && !selectedNotice) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Notice" : "Create Notice"}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Notices", path: "/alumni/explore/notices" },
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CommonInputField
              name="title"
              label="Title"
              control={control}
              required
            />
            <CommonTextArea
              name="content"
              label="Content"
              control={control}
              required
              rows={6}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <CommonDropDown
                name="category"
                label="Category"
                control={control}
                menuItems={categoryOptions}
                required
                placeholder="Select"
              />
              <CommonDropDown
                name="status"
                label="Status"
                control={control}
                menuItems={statusOptions}
                required
              />
              <CommonDatePicker
                name="publishDate"
                label="Publish Date"
                control={control}
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <CommonButton variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </CommonButton>
              <CommonButton
                type="submit"
                loading={formState.isSubmitting}
                startIcon={<Save size={18} />}
              >
                {isEdit ? "Update Notice" : "Create Notice"}
              </CommonButton>
            </Box>
          </Box>
        </CommonCard>
      </form>
    </Box>
  );
}
