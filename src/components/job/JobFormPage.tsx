import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useJobs } from "@/hooks/useJobs";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonDropDown,
  CommonDatePicker,
  CommonTextArea,
  CommonCheckbox,
  CommonFileUpload,
  CommonButton,
  CommonLoading,
} from "@/components/common";
import { getApiErrorMessage } from "@/utils/apiError";
import { uploadImage } from "@/services/api/uploadService";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  type CreateUpdateJobRequest,
  type JobItem,
} from "@/types/job";

/* ---------- validation ---------- */
const jobSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  company: yup.string().trim().required("Company is required"),
  location: yup.string().default(""),
  employmentType: yup.string().default(""),
  experienceLevel: yup.string().default(""),
  salaryRange: yup.string().default(""),
  description: yup.string().default(""),
  applyURL: yup.string().default(""),
  contactEmail: yup
    .string()
    .default("")
    .test(
      "email-or-empty",
      "Enter a valid email",
      (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    ),
  deadline: yup.string().default(""),
  image: yup.string().default(""),
  isFeatured: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
});

type JobFormValues = yup.InferType<typeof jobSchema>;

const employmentOptions = EMPLOYMENT_TYPES.map((v) => ({ label: v, value: v }));
const experienceOptions = EXPERIENCE_LEVELS.map((v) => ({
  label: v,
  value: v,
}));

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

export default function JobFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { fetchJobById, createUpdateJob, loading } = useJobs();

  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState } =
    useForm<JobFormValues>({
      resolver: yupResolver(jobSchema) as never,
      defaultValues: {
        title: "",
        company: "",
        location: "",
        employmentType: "",
        experienceLevel: "",
        salaryRange: "",
        description: "",
        applyURL: "",
        contactEmail: "",
        deadline: "",
        image: "",
        isFeatured: false,
        isActive: true,
      } as never,
    });

  useEffect(() => {
    if (!isEdit || !id) return;
    void (async () => {
      try {
        const job = (await fetchJobById(id)) as JobItem | undefined;
        if (!job) return;
        reset({
          title: job.title,
          company: job.company,
          location: job.location ?? "",
          employmentType: job.employmentType ?? "",
          experienceLevel: job.experienceLevel ?? "",
          salaryRange: job.salaryRange ?? "",
          description: job.description ?? "",
          applyURL: job.applyURL ?? "",
          contactEmail: job.contactEmail ?? "",
          deadline: job.deadline ? job.deadline.slice(0, 10) : "",
          image: job.image ?? "",
          isFeatured: job.isFeatured,
          isActive: job.isActive,
        } as never);
      } catch {
        /* error already surfaced via hook */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  const onSubmit = async (data: JobFormValues) => {
    setSaving(true);
    try {
      const payload: CreateUpdateJobRequest = {
        jobID: isEdit ? (id ?? null) : null,
        title: data.title.trim(),
        company: data.company.trim(),
        location: data.location?.trim() || null,
        employmentType: data.employmentType || null,
        experienceLevel: data.experienceLevel || null,
        salaryRange: data.salaryRange?.trim() || null,
        description: data.description?.trim() || null,
        applyURL: data.applyURL?.trim() || null,
        contactEmail: data.contactEmail?.trim() || null,
        deadline: data.deadline || null,
        image: data.image?.trim() || null,
        isFeatured: Boolean(data.isFeatured),
        isActive: Boolean(data.isActive),
      };
      await createUpdateJob(payload);
      dispatch(
        showToast({
          message: isEdit ? "Job updated." : "Job created.",
          severity: "success",
        }),
      );
      navigate("/alumni/job-board");
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save job"),
          severity: "error",
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEdit && !formState.isDirty) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Job" : "Post New Job"}
        subtitle={
          isEdit
            ? "Update the job posting details"
            : "Fill out the information below to publish a job"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Job Board", path: "/alumni/job-board" },
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
        <Section title="Job Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="title"
                label="Job Title"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="company"
                label="Company"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="location"
                label="Location"
                control={control}
                placeholder="e.g. Dhaka, Bangladesh or Remote"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="salaryRange"
                label="Salary Range"
                control={control}
                placeholder="e.g. 40,000 - 60,000 BDT"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="employmentType"
                label="Employment Type"
                control={control}
                menuItems={employmentOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDropDown
                name="experienceLevel"
                label="Experience Level"
                control={control}
                menuItems={experienceOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="description"
                label="Job Description"
                control={control}
                rows={6}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Application Details">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="applyURL"
                label="Apply URL"
                control={control}
                placeholder="https://..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="contactEmail"
                label="Contact Email"
                control={control}
                type="email"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonDatePicker
                name="deadline"
                label="Application Deadline"
                control={control}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Image">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                variant="cover"
                label="Job Banner (optional)"
                currentFile={watch("image") || undefined}
                onFileSelect={async (preview, file) => {
                  setValue("image" as never, preview as never);
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
                    setValue("image" as never, "" as never);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Visibility">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonCheckbox
                name="isFeatured"
                label="Feature on landing page"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonCheckbox
                name="isActive"
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
            loading={formState.isSubmitting || saving}
            startIcon={<Save size={18} />}
          >
            {isEdit ? "Update Job" : "Post Job"}
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
