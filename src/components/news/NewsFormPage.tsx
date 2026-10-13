import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useNews } from "@/hooks/useNews";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonDropDown,
  CommonTextArea,
  CommonCheckbox,
  CommonFileUpload,
  CommonButton,
} from "@/components/common";
import { getApiErrorMessage } from "@/utils/apiError";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { uploadImage } from "@/services/api/uploadService";

/* ============================================================
   Validation
   ============================================================ */
const newsSchema = yup.object({
  Title: yup.string().trim().required("Title is required"),
  Summary: yup.string().trim().required("Summary is required"),
  Content: yup.string().required("Content is required"),
  CategoryID: yup.string().default("0002"),
  Tags: yup.string().default(""),
  Image: yup.string().default(""),
  Status: yup
    .string()
    .oneOf(["Draft", "Published", "Unpublished"])
    .default("Draft"),
  IsFeatured: yup.boolean().default(false),
  IsBreakingNews: yup.boolean().default(false),
  MetaDescription: yup.string().default(""),
  IsActive: yup.boolean().default(true),
});

type NewsFormValues = yup.InferType<typeof newsSchema>;

/* ============================================================
   Constants
   ============================================================ */
const CATEGORY_OPTIONS = [
  { value: "0001", label: "Event & Homecoming" },
  { value: "0002", label: "Announcement" },
  { value: "0003", label: "Awards & Recognition" },
];

const STATUS_OPTIONS = [
  { value: "Draft", label: "Draft" },
  { value: "Published", label: "Published" },
  { value: "Unpublished", label: "Unpublished" },
];

/* ============================================================
   Section wrapper
   ============================================================ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card
    sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

/* ============================================================
   Page
   ============================================================ */
export default function NewsFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);

  const { selectedNews, fetchNewsById, createUpdateNews } = useNews();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const [tagsInput, setTagsInput] = useState("");

  const { control, handleSubmit, reset, watch, setValue, formState } =
    useForm<NewsFormValues>({
      resolver: yupResolver(newsSchema) as never,
      defaultValues: {
        Title: "",
        Summary: "",
        Content: "",
        CategoryID: "0002",
        Tags: "",
        Image: "",
        Status: "Draft",
        IsFeatured: false,
        IsBreakingNews: false,
        MetaDescription: "",
        IsActive: true,
      } as never,
    });

  /* ---------- load for edit ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;
    void fetchNewsById(id).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  useEffect(() => {
    if (!isEdit || !selectedNews) return;
    reset({
      Title: selectedNews.Title ?? "",
      Summary: selectedNews.Summary ?? "",
      Content: selectedNews.Content ?? "",
      CategoryID: selectedNews.CategoryID ?? "0002",
      Tags: (selectedNews.Tags ?? []).join(", "),
      Image: selectedNews.Image ?? "",
      Status: (selectedNews.Status as NewsFormValues["Status"]) ?? "Draft",
      IsFeatured: selectedNews.IsFeatured ?? false,
      IsBreakingNews: selectedNews.IsBreakingNews ?? false,
      MetaDescription: selectedNews.MetaDescription ?? "",
      IsActive: selectedNews.IsActive ?? true,
    } as never);
    setTagsInput((selectedNews.Tags ?? []).join(", "));
  }, [isEdit, selectedNews, reset]);

  /* ---------- dynamic breadcrumb ---------- */
  useEffect(() => {
    if (!isEdit || !selectedNews) return;
    setBreadcrumbLabel(location.pathname, selectedNews.Title);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    isEdit,
    location.pathname,
    selectedNews,
    setBreadcrumbLabel,
  ]);

  /* ---------- submit ---------- */
  const onSubmit = async (data: NewsFormValues) => {
    try {
      const payload = {
        NewsID: isEdit ? id : null,
        Title: data.Title.trim(),
        Summary: data.Summary.trim(),
        Content: data.Content,
        CategoryID: data.CategoryID,
        Tags: (data.Tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        Image: data.Image?.trim() || undefined,
        Status: data.Status as "Draft" | "Published" | "Unpublished",
        IsFeatured: Boolean(data.IsFeatured),
        IsBreakingNews: Boolean(data.IsBreakingNews),
        MetaDescription: data.MetaDescription?.trim() || undefined,
        IsActive: Boolean(data.IsActive),
        PublishedAt:
          data.Status === "Published"
            ? (selectedNews?.PublishedAt ?? new Date().toISOString())
            : (selectedNews?.PublishedAt ?? null),
      };

      await createUpdateNews(payload);

      dispatch(
        showToast({
          message: isEdit ? "Article updated." : "Article created.",
          severity: "success",
        }),
      );

      navigate("/alumni/news");
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save news article"),
          severity: "error",
        }),
      );
    }
  };

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit News Article" : "Create News Article"}
        subtitle={
          isEdit
            ? "Update the details of this news article"
            : "Fill out the information below to create a news article"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "News", path: "/alumni/news" },
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
        <Section title="Article Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonInputField
                name="Title"
                label="Article Title"
                control={control}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="Summary"
                label="Summary / Excerpt"
                control={control}
                rows={2}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="Content"
                label="Content"
                control={control}
                rows={6}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="CategoryID"
                label="Category"
                control={control}
                menuItems={CATEGORY_OPTIONS}
                placeholder="Select a category"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="Status"
                label="Status"
                control={control}
                menuItems={STATUS_OPTIONS}
                placeholder="Select status"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="Tags"
                label="Tags (comma separated)"
                control={control}
                placeholder="Meeting, Announcement, Members"
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonInputField
                name="MetaDescription"
                label="Meta Description (SEO)"
                control={control}
                placeholder="Short description for search engines"
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Article Image">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                label="Featured Image"
                currentFile={watch("Image") || undefined}
                onFileSelect={async (preview, file) => {
                  // Show the preview immediately
                  setValue("Image" as never, preview as never);

                  // Upload in the background and swap in the real URL
                  try {
                    const url = await uploadImage(file);
                    setValue("Image" as never, url as never);
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
                    // Roll back the preview on failure
                    setValue("Image" as never, "" as never);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Publishing Options">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CommonCheckbox
                name="IsFeatured"
                label="Featured Article"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CommonCheckbox
                name="IsBreakingNews"
                label="Breaking News"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CommonCheckbox
                name="IsActive"
                label="Active (visible publicly)"
                control={control}
              />
            </Grid>
          </Grid>
        </Section>

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 3 }}
        >
          <CommonButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Cancel
          </CommonButton>
          <CommonButton
            type="submit"
            loading={formState.isSubmitting}
            startIcon={<Save size={18} />}
          >
            {isEdit ? "Update Article" : "Create Article"}
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
