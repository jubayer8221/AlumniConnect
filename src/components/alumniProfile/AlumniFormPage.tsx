import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  alpha,
  IconButton,
  Paper,
} from "@mui/material";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonInputField,
  CommonSelectField,
  CommonDatePicker,
  CommonTextArea,
  CommonCheckbox,
  CommonFileUpload,
  CommonButton,
  CommonLoading,
} from "@/components/common";
import type { CreateUpdateAlumniRequest, EducationEntry } from "@/types/alumni";
import { generateUUID } from "@/utils/generateId";
import { getApiErrorMessage } from "@/utils/apiError";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { uploadImage } from "@/services/api/uploadService";

/* ============================================================
   Form validation — inline Yup schemas
   ============================================================ */
const familyMemberSchema = yup.object({
  id: yup.string().optional(),
  name: yup.string().default(""),
  relation: yup.string().default(""),
  occupation: yup.string().default(""),
  phone: yup.string().default(""),
});

const alumniSchema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  nativeName: yup.string().default(""),
  gender: yup.string().default(""),
  dateOfBirth: yup.string().default(""),
  bloodGroup: yup.string().default(""),
  maritalStatus: yup.string().default(""),
  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup.string().default(""),
  alternatePhone: yup.string().default(""),
  presentAddress: yup.string().default(""),
  presentVillageArea: yup.string().default(""),
  presentCountry: yup.string().default(""),
  presentDivision: yup.string().default(""),
  presentDistrict: yup.string().default(""),
  presentThana: yup.string().default(""),
  presentUnion: yup.string().default(""),
  permanentAddress: yup.string().default(""),
  permanentVillageArea: yup.string().default(""),
  permanentCountry: yup.string().default(""),
  permanentDivision: yup.string().default(""),
  permanentDistrict: yup.string().default(""),
  permanentThana: yup.string().default(""),
  permanentUnion: yup.string().default(""),
  sameAsPresentAddress: yup.boolean().default(false),
  city: yup.string().default(""),
  country: yup.string().default(""),
  studentId: yup.string().default(""),
  registrationNumber: yup.string().default(""),
  programName: yup.string().default(""),
  departmentName: yup.string().default(""),
  facultyId: yup.string().default(""),
  facultyName: yup.string().default(""),
  profilePhoto: yup.string().default(""),
  admissionYear: yup.mixed<string | number>().optional().nullable(),
  graduationYear: yup.mixed<string | number>().optional().nullable(),
  graduationSemester: yup.string().default(""),
  batch: yup.string().default(""),
  rollNumber: yup.string().default(""),
  currentOccupation: yup.string().default(""),
  designation: yup.string().default(""),
  companyName: yup.string().default(""),
  industry: yup.string().default(""),
  workLocation: yup.string().default(""),
  skills: yup.array().of(yup.string().defined()).default([]),
  linkedinUrl: yup.string().default(""),
  facebookUrl: yup.string().default(""),
  websiteUrl: yup.string().default(""),
  bio: yup.string().default(""),
  isMentor: yup.boolean().default(false),
  willingToMentor: yup.boolean().default(false),
  username: yup.string().default(""),
  password: yup.string().default(""),
  status: yup.string().default("ACTIVE"),
  isVerified: yup.boolean().default(false),
  familyMembers: yup.array().of(familyMemberSchema).default([]),
});

const alumniCreateSchema = alumniSchema.shape({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type AlumniFormValues = yup.InferType<typeof alumniSchema>;

/* ============================================================
   Constants
   ============================================================ */
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const maritalStatusOptions = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
].map((v) => ({ label: v, value: v }));
const countryOptions = [
  "Bangladesh",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
].map((v) => ({ label: v, value: v }));
const divisionOptions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
].map((v) => ({ label: v, value: v }));
const districtOptions = [
  "Dhaka",
  "Gazipur",
  "Chattogram",
  "Comilla",
  "Rajshahi",
  "Khulna",
  "Sylhet",
].map((v) => ({ label: v, value: v }));
const thanaOptions = [
  "Kotwali",
  "Dhanmondi",
  "Gulshan",
  "Uttara",
  "Panchlaish",
].map((v) => ({ label: v, value: v }));
const unionOptions = ["", "Ward 1", "Ward 2", "Ward 3", "Other"].map((v) => ({
  label: v || "Select union",
  value: v,
}));
const bloodOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
  (v) => ({ label: v, value: v }),
);
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value: "PENDING" },
];
const semesterOptions = [
  { label: "Spring", value: "Spring" },
  { label: "Summer", value: "Summer" },
  { label: "Fall", value: "Fall" },
];
const departmentOptions = [
  "Computer Science",
  "Electrical Engineering",
  "Business Administration",
  "Civil Engineering",
  "Architecture",
  "Mechanical Engineering",
  "Pharmacy",
  "English",
  "Biotechnology",
  "Environmental Science",
  "Psychology",
  "Law",
  "Information Systems",
  "Agriculture",
  "Statistics",
  "Finance",
  "Marketing",
].map((d) => ({ label: d, value: d }));
const programOptions = [
  "BSc in Computer Science",
  "BSc in Electrical Engineering",
  "Bachelor of Business Administration",
  "BSc in Civil Engineering",
  "Bachelor of Architecture",
  "BSc in Mechanical Engineering",
  "Bachelor of Pharmacy",
  "BA in English Literature",
  "BSc in Biotechnology",
  "BSc in Environmental Science",
  "BA in Psychology",
  "LLB in Law",
  "BSc in Information Systems",
  "BSc in Agriculture",
  "BSc in Statistics",
  "BBA in Finance",
  "BBA in Marketing",
].map((p) => ({ label: p, value: p }));
const facultyOptions = [
  { label: "Faculty of Engineering", value: "fac-eng" },
  { label: "Faculty of Business", value: "fac-bus" },
  { label: "Faculty of Science", value: "fac-sci" },
  { label: "Faculty of Arts", value: "fac-arts" },
  { label: "Faculty of Architecture", value: "fac-arch" },
  { label: "Faculty of Law", value: "fac-law" },
];
const industryOptions = [
  "Information Technology",
  "Finance",
  "Healthcare",
  "Construction",
  "Education",
  "Media",
  "Legal",
  "Telecommunications",
  "Manufacturing",
  "Energy",
  "Consulting",
  "Environmental",
  "Agriculture",
  "Human Resources",
  "FMCG",
].map((i) => ({ label: i, value: i }));

const addressFieldMap = {
  address: "presentAddress",
  villageArea: "presentVillageArea",
  country: "presentCountry",
  division: "presentDivision",
  district: "presentDistrict",
  thana: "presentThana",
  union: "presentUnion",
} as const;

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
   Payload builder
   ============================================================ */
function buildPayload(
  data: AlumniFormValues,
  educationEntries: EducationEntry[],
  alumniId?: number,
): CreateUpdateAlumniRequest {
  return {
    alumniID: alumniId ?? null,
    username: data.username || null,
    password: data.password || null,
    status: data.status,
    isVerified: Boolean(data.isVerified),
    isMentor: Boolean(data.isMentor),
    willingToMentor: Boolean(data.willingToMentor),
    isProfilePublic: true,
    personalInformation: {
      fullName: data.fullName,
      nativeName: data.nativeName || null,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      bloodGroup: data.bloodGroup || null,
      maritalStatusID: (data.maritalStatus as string) || null,
      profilePhoto: data.profilePhoto || null,
      bio: data.bio || null,
      hobby: null,
      tShirtSize: null,
    },
    contactInformation: {
      email: data.email || null,
      phone: data.phone || null,
      alternatePhone: data.alternatePhone || null,
      presentCountry: data.presentCountry || null,
      presentDivision: data.presentDivision || null,
      presentDistrict: data.presentDistrict || null,
      presentThana: data.presentThana || null,
      presentUnion: data.presentUnion || null,
      presentVillageArea: data.presentVillageArea || null,
      fullpresentAddress: data.presentAddress || null,
      isSameAsPresentAddress: Boolean(data.sameAsPresentAddress),
      permanentCountry: data.permanentCountry || null,
      permanentDivision: data.permanentDivision || null,
      permanentDistrict: data.permanentDistrict || null,
      permanentThana: data.permanentThana || null,
      permanentUnion: data.permanentUnion || null,
      permanentVillageArea: data.permanentVillageArea || null,
      fullPermanentAddress: data.permanentAddress || null,
    },
    familyInformation: (data.familyMembers ?? []).map((m) => ({
      familyMemberID: 0,
      familyMemberName: m.name,
      relation: m.relation,
      occupation: m.occupation || null,
      phone: m.phone || null,
      isVisible: true,
    })),
    academicInformation: educationEntries.length
      ? educationEntries.map((e, i) => ({
          alumniEducationID: 0,
          studentID: i === 0 ? data.studentId || null : null,
          registrationNumber: i === 0 ? data.registrationNumber || null : null,
          rollNumber: i === 0 ? data.rollNumber || null : null,
          programID: null,
          programName: e.degree || (i === 0 ? data.programName : "") || null,
          departmentID: null,
          departmentName:
            e.fieldOfStudy || (i === 0 ? data.departmentName : "") || null,
          facultyID: null,
          facultyName: i === 0 ? data.facultyName || null : null,
          admissionYear:
            e.startYear ??
            (i === 0 ? Number(data.admissionYear) || null : null),
          graduationYear:
            e.endYear ?? (i === 0 ? Number(data.graduationYear) || null : null),
          graduationSemester: i === 0 ? data.graduationSemester || null : null,
          batch: e.result || (i === 0 ? data.batch : "") || null,
          secondarySchoolName: e.institution || null,
          isVisible: true,
        }))
      : [
          {
            alumniEducationID: 0,
            studentID: data.studentId || null,
            registrationNumber: data.registrationNumber || null,
            rollNumber: data.rollNumber || null,
            programID: null,
            programName: data.programName || null,
            departmentID: null,
            departmentName: data.departmentName || null,
            facultyID: null,
            facultyName: data.facultyName || null,
            admissionYear: Number(data.admissionYear) || null,
            graduationYear: Number(data.graduationYear) || null,
            graduationSemester: data.graduationSemester || null,
            batch: data.batch || null,
            secondarySchoolName: null,
            isVisible: true,
          },
        ],
    jobExperience:
      data.currentOccupation || data.designation || data.companyName
        ? [
            {
              jobExperienceID: 0,
              companyID: null,
              companyname: data.companyName || null,
              designation: data.designation || data.currentOccupation || null,
              startDate: null,
              endDate: null,
              location: data.workLocation || null,
              city: data.city || null,
              country: data.country || null,
              description: null,
              isCurrent: true,
              isVisible: true,
            },
          ]
        : [],
    socialInformation: {
      facebookLink: data.facebookUrl || null,
      instagramLink: null,
      twitterLink: null,
      linkedInLink: data.linkedinUrl || null,
      gitHubLink: data.websiteUrl || null,
    },
    privacy: {
      isSocialMediaVisible: true,
      isFamilyInformationVisible: true,
      isJobExperienceVisible: true,
      isContactInformationVisible: true,
      isAcademicInformationVisible: true,
    },
  };
}

export default function AlumniFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const { role } = useAuth();
  const { selectedAlumni, loading, fetchAlumniById, createUpdateAlumni } =
    useAlumni();
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  const [skillsInput, setSkillsInput] = useState("");
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState,
  } = useForm<AlumniFormValues>({
    resolver: yupResolver(isEdit ? alumniSchema : alumniCreateSchema) as never,
    defaultValues: {
      fullName: "",
      nativeName: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      maritalStatus: "",
      email: "",
      phone: "",
      alternatePhone: "",
      presentAddress: "",
      presentVillageArea: "",
      presentCountry: "",
      presentDivision: "",
      presentDistrict: "",
      presentThana: "",
      presentUnion: "",
      permanentAddress: "",
      permanentVillageArea: "",
      permanentCountry: "",
      permanentDivision: "",
      permanentDistrict: "",
      permanentThana: "",
      permanentUnion: "",
      sameAsPresentAddress: false,
      city: "",
      country: "",
      studentId: "",
      registrationNumber: "",
      programName: "",
      departmentName: "",
      facultyId: "",
      facultyName: "",
      profilePhoto: "",
      admissionYear: undefined as never,
      graduationYear: undefined as never,
      graduationSemester: "",
      batch: "",
      rollNumber: "",
      currentOccupation: "",
      designation: "",
      companyName: "",
      industry: "",
      workLocation: "",
      skills: [],
      linkedinUrl: "",
      facebookUrl: "",
      websiteUrl: "",
      bio: "",
      isMentor: false,
      willingToMentor: false,
      username: "",
      password: "",
      status: "ACTIVE",
      isVerified: false,
      familyMembers: [],
    } as never,
  });

  const sameAsPresentAddress = watch("sameAsPresentAddress");

  useEffect(() => {
    if (sameAsPresentAddress) {
      const present = getValues();
      (
        Object.keys(addressFieldMap) as Array<keyof typeof addressFieldMap>
      ).forEach((key) => {
        setValue(
          addressFieldMap[key].replace("present", "permanent") as never,
          present[addressFieldMap[key]] as never,
        );
      });
    }
  }, [sameAsPresentAddress, getValues, setValue]);

  const {
    fields: familyFields,
    append: appendFamily,
    remove: removeFamily,
  } = useFieldArray({
    control,
    name: "familyMembers" as never,
  } as never);

  useEffect(() => {
    if (!isEdit || !id) return;
    void fetchAlumniById(id).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  useEffect(() => {
    if (!isEdit || !selectedAlumni) return;
    const p = selectedAlumni.personalInformation;
    const c = selectedAlumni.contactInformation;
    const e = selectedAlumni.academicInformation[0];
    const j = selectedAlumni.jobExperience[0];

    reset({
      fullName: p.fullName,
      nativeName: p.nativeName ?? "",
      gender: p.gender ?? "",
      dateOfBirth: p.dateOfBirth ?? "",
      bloodGroup: p.bloodGroup ?? "",
      maritalStatus: (p.maritalStatusID ?? "") as never,
      email: c.email ?? "",
      phone: c.phone ?? "",
      alternatePhone: c.alternatePhone ?? "",
      presentAddress: c.fullpresentAddress ?? "",
      presentVillageArea: c.presentVillageArea ?? "",
      presentCountry: c.presentCountry ?? "",
      presentDivision: c.presentDivision ?? "",
      presentDistrict: c.presentDistrict ?? "",
      presentThana: c.presentThana ?? "",
      presentUnion: c.presentUnion ?? "",
      permanentAddress: c.fullPermanentAddress ?? "",
      permanentVillageArea: c.permanentVillageArea ?? "",
      permanentCountry: c.permanentCountry ?? "",
      permanentDivision: c.permanentDivision ?? "",
      permanentDistrict: c.permanentDistrict ?? "",
      permanentThana: c.permanentThana ?? "",
      permanentUnion: c.permanentUnion ?? "",
      sameAsPresentAddress: c.isSameAsPresentAddress,
      city: c.presentDistrict ?? "",
      country: c.presentCountry ?? "",
      studentId: e?.studentID ?? "",
      registrationNumber: e?.registrationNumber ?? "",
      programName: e?.programName ?? "",
      departmentName: e?.departmentName ?? "",
      facultyId: e?.facultyID ? String(e.facultyID) : "",
      facultyName: e?.facultyName ?? "",
      profilePhoto: p.profilePhoto ?? "",
      admissionYear: e?.admissionYear as never,
      graduationYear: e?.graduationYear as never,
      graduationSemester: e?.graduationSemester ?? "",
      batch: e?.batch ?? "",
      rollNumber: e?.rollNumber ?? "",
      currentOccupation: j?.designation ?? "",
      designation: j?.designation ?? "",
      companyName: j?.companyname ?? "",
      industry: "",
      workLocation: j?.location ?? "",
      skills: [],
      linkedinUrl: selectedAlumni.socialInformation.linkedInLink ?? "",
      facebookUrl: selectedAlumni.socialInformation.facebookLink ?? "",
      websiteUrl: selectedAlumni.socialInformation.gitHubLink ?? "",
      bio: p.bio ?? "",
      isMentor: selectedAlumni.isMentor,
      willingToMentor: selectedAlumni.willingToMentor,
      username: selectedAlumni.username,
      password: "",
      status: selectedAlumni.status,
      isVerified: selectedAlumni.isVerified,
      familyMembers: selectedAlumni.familyInformation.map((m) => ({
        id: String(m.familyMemberID),
        name: m.familyMemberName,
        relation: m.relation,
        occupation: m.occupation ?? "",
        phone: m.phone ?? "",
      })),
    } as never);
    setEducationEntries([]);
  }, [isEdit, selectedAlumni, reset]);

  useEffect(() => {
    if (!isEdit || !selectedAlumni) return;
    setBreadcrumbLabel(
      location.pathname,
      selectedAlumni.personalInformation.fullName,
    );
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    isEdit,
    location.pathname,
    selectedAlumni,
    setBreadcrumbLabel,
  ]);

  const onSubmit = async (data: AlumniFormValues) => {
    try {
      const payload = buildPayload(
        data,
        educationEntries,
        isEdit && selectedAlumni ? selectedAlumni.alumniID : undefined,
      );
      const result = await createUpdateAlumni(payload);
      dispatch(
        showToast({
          message: result?.message ?? "Saved successfully",
          severity: "success",
        }),
      );
      if (isEdit && id) navigate(`/alumni/${id}`);
      else if (result?.alumniID) navigate(`/alumni/${result.alumniID}`);
      else navigate("/alumni");
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save alumni information"),
          severity: "error",
        }),
      );
    }
  };

  const addEducation = () =>
    setEducationEntries((prev) => [
      ...prev,
      {
        id: generateUUID(),
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startYear: undefined,
        endYear: undefined,
        result: "",
      },
    ]);
  const removeEducation = (eduId: string) =>
    setEducationEntries((prev) => prev.filter((e) => e.id !== eduId));
  const updateEducation = (
    eduId: string,
    field: keyof EducationEntry,
    value: string | number,
  ) =>
    setEducationEntries((prev) =>
      prev.map((e) => (e.id === eduId ? { ...e, [field]: value } : e)),
    );

  if (loading && isEdit && !selectedAlumni) return <CommonLoading />;
  if (isEdit && role !== "ADMIN" && !selectedAlumni)
    return <Navigate to="/unauthorized" replace />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Alumni" : "Add New Alumni"}
        subtitle={
          isEdit ? "Update alumni information" : "Create a new alumni record"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Alumni", path: "/alumni" },
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
        <Section title="Personal Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="fullName"
                label="Full Name"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="nativeName"
                label="Native Name"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="gender"
                label="Gender"
                control={control}
                options={genderOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonDatePicker
                name="dateOfBirth"
                label="Date of Birth"
                control={control}
                maxDate={new Date()}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="bloodGroup"
                label="Blood Group"
                control={control}
                options={bloodOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="maritalStatus"
                label="Marital Status"
                control={control}
                options={maritalStatusOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonFileUpload
                label="Profile Photo"
                currentFile={watch("profilePhoto") || undefined}
                onFileSelect={async (preview, file) => {
                  // Show the preview immediately
                  setValue("profilePhoto" as never, preview as never);

                  // Upload in the background and swap in the real URL
                  try {
                    const url = await uploadImage(file);
                    setValue("profilePhoto" as never, url as never);
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
                    setValue("profilePhoto" as never, "" as never);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Contact Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="email"
                label="Email"
                control={control}
                required
                type="email"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="phone"
                label="Phone"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="alternatePhone"
                label="Alternate Phone"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField name="city" label="City" control={control} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2">Present Address</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="presentVillageArea"
                label="Village/Area"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="presentCountry"
                label="Country"
                control={control}
                options={countryOptions}
                required
                placeholder="Select..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="presentDivision"
                label="Division"
                control={control}
                options={divisionOptions}
                required
                placeholder="Select..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="presentDistrict"
                label="District"
                control={control}
                options={districtOptions}
                placeholder="Select..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="presentThana"
                label="Thana"
                control={control}
                options={thanaOptions}
                placeholder="Select..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="presentUnion"
                label="Union"
                control={control}
                options={unionOptions}
                placeholder="Select union"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="presentAddress"
                label="Address"
                control={control}
                rows={2}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Permanent Address
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonCheckbox
                name="sameAsPresentAddress"
                label="Same as Present Address"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="permanentVillageArea"
                label="Village/Area"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="permanentCountry"
                label="Country"
                control={control}
                options={countryOptions}
                placeholder="Select..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="permanentDivision"
                label="Division"
                control={control}
                options={divisionOptions}
                placeholder="Select division"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="permanentDistrict"
                label="District"
                control={control}
                options={districtOptions}
                placeholder="Select district"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="permanentThana"
                label="Thana"
                control={control}
                options={thanaOptions}
                placeholder="Select thana"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="permanentUnion"
                label="Union"
                control={control}
                options={unionOptions}
                placeholder="Select union"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CommonTextArea
                name="permanentAddress"
                label="Address"
                control={control}
                rows={2}
                required
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Academic Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="studentId"
                label="Student ID"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="registrationNumber"
                label="Registration Number"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonSelectField
                name="programName"
                label="Program"
                control={control}
                options={programOptions}
                required
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonSelectField
                name="departmentName"
                label="Department"
                control={control}
                options={departmentOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonSelectField
                name="facultyId"
                label="Faculty"
                control={control}
                options={facultyOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CommonInputField
                name="admissionYear"
                label="Admission Year"
                control={control}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <CommonInputField
                name="graduationYear"
                label="Graduation Year"
                control={control}
                required
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonSelectField
                name="graduationSemester"
                label="Graduation Semester"
                control={control}
                options={semesterOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="batch"
                label="Batch"
                control={control}
                placeholder="e.g. 2018"
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">
              Additional Academic Information
            </Typography>
            <Button
              type="button"
              size="small"
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={addEducation}
            >
              Add Academic Information
            </Button>
          </Box>
          {educationEntries.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Academic Record
                </Typography>
                <Button
                  type="button"
                  size="small"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                  onClick={() => removeEducation(entry.id)}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationDegree_${entry.id}` as never}
                    label="Degree"
                    control={control}
                    onChange={(e) =>
                      updateEducation(entry.id, "degree", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationInstitution_${entry.id}` as never}
                    label="Institution"
                    control={control}
                    onChange={(e) =>
                      updateEducation(entry.id, "institution", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationField_${entry.id}` as never}
                    label="Field of Study"
                    control={control}
                    onChange={(e) =>
                      updateEducation(entry.id, "fieldOfStudy", e.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <CommonInputField
                    name={`educationStart_${entry.id}` as never}
                    label="Start Year"
                    control={control}
                    type="number"
                    onChange={(e) =>
                      updateEducation(
                        entry.id,
                        "startYear",
                        Number(e.target.value) || 0,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <CommonInputField
                    name={`educationEnd_${entry.id}` as never}
                    label="End Year"
                    control={control}
                    type="number"
                    onChange={(e) =>
                      updateEducation(
                        entry.id,
                        "endYear",
                        Number(e.target.value) || 0,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CommonInputField
                    name={`educationResult_${entry.id}` as never}
                    label="Result"
                    control={control}
                    onChange={(e) =>
                      updateEducation(entry.id, "result", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Section>

        <Section title="Professional Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="currentOccupation"
                label="Current Occupation"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="designation"
                label="Designation"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="companyName"
                label="Company"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonSelectField
                name="industry"
                label="Industry"
                control={control}
                options={industryOptions}
                placeholder="Select"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="workLocation"
                label="Work Location"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="skills"
                label="Skills (comma separated)"
                control={control}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Social Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="linkedinUrl"
                label="LinkedIn URL"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="facebookUrl"
                label="Facebook URL"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="websiteUrl"
                label="Website URL"
                control={control}
              />
            </Grid>
          </Grid>
        </Section>

        <Section title="Family Information">
          {familyFields.length === 0 && (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.02),
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                No family members added yet.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={() =>
                  appendFamily({
                    name: "",
                    relation: "",
                    occupation: "",
                    phone: "",
                  } as never)
                }
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Add First Member
              </Button>
            </Box>
          )}

          {familyFields.map((field, index) => (
            <Paper
              key={field.id}
              elevation={0}
              sx={{
                mb: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                transition: "border-color 0.2s ease",
                "&:hover": {
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.4),
                },
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.action.hover, 0.03),
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.825rem",
                  }}
                >
                  Family Member #{index + 1}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeFamily(index)}
                  sx={{
                    borderRadius: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                    },
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.name` as never}
                      label="Full Name"
                      control={control}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.relation` as never}
                      label="Relation"
                      control={control}
                      required
                      placeholder="e.g. Father, Spouse"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.occupation` as never}
                      label="Occupation"
                      control={control}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.phone` as never}
                      label="Phone"
                      control={control}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))}

          {familyFields.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Plus size={18} />}
              onClick={() =>
                appendFamily({
                  name: "",
                  relation: "",
                  occupation: "",
                  phone: "",
                } as never)
              }
              sx={{
                py: 1.25,
                borderStyle: "dashed",
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderStyle: "dashed",
                  borderColor: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              Add Another Family Member
            </Button>
          )}
        </Section>

        <Section title="Biography">
          <CommonTextArea
            name="bio"
            label="Bio / About"
            control={control}
            rows={4}
            placeholder="Write a short biography..."
          />
        </Section>

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 3 }}
        >
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowLeft size={18} />}
          >
            Cancel
          </Button>
          <CommonButton
            type="submit"
            loading={formState.isSubmitting}
            startIcon={<Save size={18} />}
          >
            {isEdit ? "Update Alumni" : "Create Alumni"}
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
