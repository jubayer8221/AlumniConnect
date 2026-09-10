import { Box } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchNoticeByIdAsync, createNoticeAsync, updateNoticeAsync } from "@/Slice/noticeSlice";
import { showToast } from "@/Slice/uiSlice";
import { noticeSchema, type NoticeFormValues } from "@/validation/noticeValidation";
import { CommonPageHeader, CommonInputField, CommonSelectField, CommonDatePicker, CommonTextArea, CommonButton, CommonLoading, CommonCard } from "@/components/common";

const categoryOptions = ["Announcement", "News", "Event", "Achievement", "Career", "General"].map((v) => ({ label: v, value: v }));
const statusOptions = [{ label: "Draft", value: "DRAFT" }, { label: "Published", value: "PUBLISHED" }, { label: "Archived", value: "ARCHIVED" }];

export default function NoticeFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const { selectedNotice, loading } = useAppSelector((s) => s.notices);
  const { control, handleSubmit, reset, formState } = useForm<NoticeFormValues>({
    resolver: yupResolver(noticeSchema) as never,
    defaultValues: { title: "", content: "", publishDate: "", category: "" as never, status: "DRAFT" as never },
  });

  useEffect(() => { if (isEdit && id) dispatch(fetchNoticeByIdAsync(id)); }, [dispatch, isEdit, id]);
  useEffect(() => {
    if (isEdit && selectedNotice) {
      reset({
        title: selectedNotice.title, content: selectedNotice.content,
        publishDate: selectedNotice.publishDate, category: selectedNotice.category as never,
        status: selectedNotice.status as never,
      });
    }
  }, [isEdit, selectedNotice, reset]);

  const onSubmit = async (data: NoticeFormValues) => {
    if (isEdit && id) {
      const res = await dispatch(updateNoticeAsync({ id, data: { ...data, id } }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(showToast({ message: "Notice updated successfully", severity: "success" }));
        navigate(`/notices/${id}`);
      }
    } else {
      const res = await dispatch(createNoticeAsync(data as never));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(showToast({ message: "Notice created successfully", severity: "success" }));
        navigate("/notices");
      }
    }
  };

  if (loading && isEdit && !selectedNotice) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Notice" : "Create Notice"}
        breadcrumbs={[{ label: "Home", path: "/dashboard" }, { label: "Notices", path: "/notices" }, { label: isEdit ? "Edit" : "Create" }]}
        actions={<CommonButton variant="outlined" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>Back</CommonButton>}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonCard>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CommonInputField name="title" label="Title" control={control} required />
            <CommonTextArea name="content" label="Content" control={control} required rows={6} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
              <CommonSelectField name="category" label="Category" control={control} options={categoryOptions} required placeholder="Select" />
              <CommonSelectField name="status" label="Status" control={control} options={statusOptions} required />
              <CommonDatePicker name="publishDate" label="Publish Date" control={control} required />
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <CommonButton variant="outlined" onClick={() => navigate(-1)}>Cancel</CommonButton>
              <CommonButton type="submit" loading={formState.isSubmitting} startIcon={<Save size={18} />}>{isEdit ? "Update Notice" : "Create Notice"}</CommonButton>
            </Box>
          </Box>
        </CommonCard>
      </form>
    </Box>
  );
}
