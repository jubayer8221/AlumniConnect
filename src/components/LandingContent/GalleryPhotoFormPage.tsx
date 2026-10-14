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
  CommonDropDown,
  CommonFileUpload,
  CommonCheckbox,
  CommonButton,
  CommonLoading,
} from "@/components/common";
import { getApiErrorMessage } from "@/utils/apiError";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { uploadImage } from "@/services/api/uploadService";

/* ---------- validation ---------- */
const photoSchema = yup.object({
  imageURL: yup.string().trim().required("Image is required"),
  caption: yup.string().default(""),
  span: yup
    .number()
    .oneOf([1, 2], "Span must be 1 (normal) or 2 (large)")
    .default(1),
  displayOrder: yup
    .number()
    .transform((v, orig) => (orig === "" ? 0 : v))
    .min(0)
    .default(0),
  isActive: yup.boolean().default(true),
});

type PhotoFormValues = yup.InferType<typeof photoSchema>;

const SPAN_OPTIONS = [
  { value: "1", label: "Normal (1×1)" },
  { value: "2", label: "Large (2×2)" },
];

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

export default function GalleryPhotoFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);

  const {
    getPhotoById,
    createUpdateGalleryPhoto,
    fetchLandingContent,
    loading,
  } = useLanding();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const { control, handleSubmit, reset, watch, setValue, formState } =
    useForm<PhotoFormValues>({
      resolver: yupResolver(photoSchema) as never,
      defaultValues: {
        imageURL: "",
        caption: "",
        span: 1,
        displayOrder: 0,
        isActive: true,
      } as never,
    });

  /* ---------- load for edit ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;
    void (async () => {
      await fetchLandingContent();
      const photo = getPhotoById(id);
      if (!photo) return;
      reset({
        imageURL: photo.imageURL,
        caption: photo.caption ?? "",
        span: photo.span as 1 | 2,
        displayOrder: photo.displayOrder,
        isActive: photo.isActive,
      } as never);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  /* ---------- dynamic breadcrumb ---------- */
  useEffect(() => {
    if (!isEdit || !id) return;
    const photo = getPhotoById(id);
    if (!photo) return;
    setBreadcrumbLabel(location.pathname, photo.caption ?? "Gallery Photo");
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    getPhotoById,
    id,
    isEdit,
    location.pathname,
    setBreadcrumbLabel,
  ]);

  /* ---------- submit ---------- */
  const onSubmit = async (data: PhotoFormValues) => {
    try {
      await createUpdateGalleryPhoto({
        photoID: isEdit ? id : null,
        imageURL: data.imageURL.trim(),
        caption: data.caption?.trim() || undefined,
        span: (Number(data.span) === 2 ? 2 : 1) as 1 | 2,
        displayOrder: Number(data.displayOrder) || 0,
        isActive: Boolean(data.isActive),
      });

      dispatch(
        showToast({
          message: isEdit ? "Photo updated." : "Photo created.",
          severity: "success",
        }),
      );

      navigate("/alumni/landing");
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save photo"),
          severity: "error",
        }),
      );
    }
  };

  if (loading && isEdit) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Gallery Photo" : "Add Gallery Photo"}
        subtitle={
          isEdit
            ? "Update the details of this photo"
            : "Photos appear in the gallery section of the landing page"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Landing Content", path: "/alumni/landing" },
          { label: isEdit ? "Edit Photo" : "New Photo" },
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
        <Section title="Photo">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                label="Gallery Image"
                currentFile={watch("imageURL") || undefined}
                onFileSelect={async (preview, file) => {
                  setValue("imageURL" as never, preview as never);
                  try {
                    const url = await uploadImage(file);
                    setValue("imageURL" as never, url as never);
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
                    setValue("imageURL" as never, "" as never);
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CommonInputField
                name="caption"
                label="Caption"
                control={control}
                placeholder="e.g. Annual Cultural Night 2025"
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Display Settings">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CommonDropDown
                name="span"
                label="Tile Size"
                control={control}
                menuItems={SPAN_OPTIONS}
                placeholder="Select tile size"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CommonInputField
                name="displayOrder"
                label="Display Order"
                control={control}
                type="number"
                helperText="Lower numbers appear first"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            onClick={() => navigate("/alumni/landing")}
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
