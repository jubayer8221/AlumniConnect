import { useEffect } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useLanding } from "@/hooks/useLanding";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonTextArea,
  CommonCheckbox,
  CommonFileUpload,
  CommonButton,
  CommonLoading,
} from "@/components/common";
import { getApiErrorMessage } from "@/utils/apiError";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { uploadImage } from "@/services/api/uploadService";

/* ============================================================
   Validation
   ============================================================ */
const slideSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  subtitle: yup.string().default(""),
  badge: yup.string().default(""),
  tag: yup.string().default(""),
  image: yup.string().default(""),
  displayOrder: yup
    .number()
    .transform((v, orig) => (orig === "" ? 0 : v))
    .min(0, "Must be 0 or greater")
    .default(0),
  isActive: yup.boolean().default(true),
});

type SlideFormValues = yup.InferType<typeof slideSchema>;

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
export default function HeroSlideFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);

  const { getSlideById, createUpdateHeroSlide, fetchLandingContent, loading } =
    useLanding();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const { control, handleSubmit, reset, watch, setValue, formState } =
    useForm<SlideFormValues>({
      resolver: yupResolver(slideSchema) as never,
      defaultValues: {
        title: "",
        subtitle: "",
        badge: "",
        tag: "",
        image: "",
        displayOrder: 0,
        isActive: true,
      } as never,
    });

  /* ---------- load for edit ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;
    void (async () => {
      await fetchLandingContent();
      const slide = getSlideById(id);
      if (!slide) return;
      reset({
        title: slide.title ?? "",
        subtitle: slide.subtitle ?? "",
        badge: slide.badge ?? "",
        tag: slide.tag ?? "",
        image: slide.image ?? "",
        displayOrder: slide.displayOrder ?? 0,
        isActive: slide.isActive ?? true,
      } as never);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  /* ---------- dynamic breadcrumb ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;
    const slide = getSlideById(id);
    if (!slide) return;
    setBreadcrumbLabel(location.pathname, slide.title);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    getSlideById,
    id,
    isEdit,
    location.pathname,
    setBreadcrumbLabel,
  ]);

  /* ---------- submit ---------- */
  const onSubmit = async (data: SlideFormValues) => {
    try {
      await createUpdateHeroSlide({
        slideID: isEdit ? id : null,
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || undefined,
        badge: data.badge?.trim() || undefined,
        tag: data.tag?.trim() || undefined,
        image: data.image?.trim() || undefined,
        displayOrder: Number(data.displayOrder) || 0,
        isActive: Boolean(data.isActive),
      });

      dispatch(
        showToast({
          message: isEdit ? "Slide updated." : "Slide created.",
          severity: "success",
        }),
      );

      navigate("/alumni/configuration/landing-page");
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save hero slide"),
          severity: "error",
        }),
      );
    }
  };

  if (loading && isEdit) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Hero Slide" : "Create Hero Slide"}
        subtitle={
          isEdit
            ? "Update the details of this slide"
            : "Slides appear in the carousel on the landing page in the order you set"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Landing Content", path: "/alumni/configuration/landing-page" },
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
        <Section title="Slide Content">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonInputField
                name="title"
                label="Title"
                control={control}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="subtitle"
                label="Subtitle"
                control={control}
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="badge"
                label="Badge"
                control={control}
                placeholder="e.g. Global Network"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="tag"
                label="Tag"
                control={control}
                placeholder="e.g. Over 135 Years of Legacy"
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Slide Image">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                label="Hero Image"
                currentFile={watch("image") || undefined}
                onFileSelect={async (preview, file) => {
                  // Show the preview immediately
                  setValue("image" as never, preview as never);

                  // Upload in the background and swap in the real URL
                  try {
                    const url = await uploadImage(file);
                    setValue("image" as never, url as never);
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
                    setValue("image" as never, "" as never);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Display Settings">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="displayOrder"
                label="Display Order"
                control={control}
                type="number"
                helperText="Lower numbers appear first"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                <CommonCheckbox
                  name="isActive"
                  label="Active (visible on landing page)"
                  control={control}
                />
              </Box>
            </Grid>
          </Grid>
        </Section>

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 3 }}
        >
          <CommonButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/alumni/configuration/landing-page")}
          >
            Cancel
          </CommonButton>
          <CommonButton
            type="submit"
            loading={formState.isSubmitting}
            startIcon={<Save size={18} />}
          >
            {isEdit ? "Update" : "Save"}
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
