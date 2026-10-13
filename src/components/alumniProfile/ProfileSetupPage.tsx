import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  GraduationCap,
  Briefcase,
  User,
  Phone,
  Globe,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
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
  CommonButton,
  CommonEmptyState,
  CommonAvatar,
  CommonFileUpload,
} from "@/components/common";
import AlumniProfileSkeleton from "@/components/alumniProfile/AlumniProfileSkeleton";
import type {
  CreateUpdateAlumniRequest,
  FamilyMember,
  EducationEntry,
  JobExperience,
} from "@/types/alumni";
import { generateUUID } from "@/utils/generateId";
import { getApiErrorMessage } from "@/utils/apiError";
import { uploadImage } from "@/services/api/uploadService";

/* ============================================================
   Form validation — inline Yup
   ============================================================ */
const familyMemberSchema = yup.object({
  id: yup.string().optional(),
  name: yup.string().default(""),
  relation: yup.string().default(""),
  occupation: yup.string().default(""),
  phone: yup.string().default(""),
});

const alumniProfileEditSchema = yup.object({
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
  familyMembers: yup.array().of(familyMemberSchema).default([]),
});

type AlumniFormValues = yup.InferType<typeof alumniProfileEditSchema>;

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
const relationOptions = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Guardian",
  "Other",
].map((v) => ({ label: v, value: v }));

const addressFieldMap = {
  address: "presentAddress",
  villageArea: "presentVillageArea",
  country: "presentCountry",
  division: "presentDivision",
  district: "presentDistrict",
  thana: "presentThana",
  union: "presentUnion",
} as const;

const createFamilyMember = (): FamilyMember => ({
  id: generateUUID(),
  name: "",
  relation: "",
  occupation: "",
  phone: "",
});

const createJobExperience = (): JobExperience => ({
  id: generateUUID(),
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
  isCurrent: false,
});

const sectionCardSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  mb: 3,
} as const;

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1.5,
          bgcolor: "rgba(var(--rgb-chart-indigo), 0.1)",
          color: "var(--color-chart-indigo)",
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
  );
}

/* ============================================================
   Payload builder
   ============================================================ */
function buildPayload(
  data: AlumniFormValues,
  current: CreateUpdateAlumniRequest,
  family: FamilyMember[],
  education: EducationEntry[],
  jobs: JobExperience[],
): CreateUpdateAlumniRequest {
  return {
    ...current,
    isMentor: Boolean(data.isMentor),
    willingToMentor: Boolean(data.willingToMentor),
    personalInformation: {
      ...current.personalInformation,
      fullName: data.fullName,
      nativeName: data.nativeName || null,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      bloodGroup: data.bloodGroup || null,
      profilePhoto: data.profilePhoto || null,
      bio: data.bio || null,
    },
    contactInformation: {
      ...current.contactInformation,
      email: data.email,
      phone: data.phone,
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
    familyInformation: family
      .filter((m) => m.name.trim() && m.relation.trim())
      .map((m, i) => ({
        familyMemberID: current.familyInformation[i]?.familyMemberID ?? 0,
        familyMemberName: m.name,
        relation: m.relation,
        occupation: m.occupation || null,
        phone: m.phone || null,
        isVisible: current.familyInformation[i]?.isVisible ?? true,
      })),
    academicInformation: education.length
      ? education.map((e, i) => ({
          alumniEducationID:
            current.academicInformation[i]?.alumniEducationID ?? 0,
          studentID: i === 0 ? data.studentId || null : null,
          registrationNumber: i === 0 ? data.registrationNumber || null : null,
          rollNumber: i === 0 ? data.rollNumber || null : null,
          programID: current.academicInformation[i]?.programID ?? null,
          programName: e.degree || (i === 0 ? data.programName : "") || null,
          departmentID: current.academicInformation[i]?.departmentID ?? null,
          departmentName:
            e.fieldOfStudy || (i === 0 ? data.departmentName : "") || null,
          facultyID: current.academicInformation[i]?.facultyID ?? null,
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
      : current.academicInformation.length
        ? current.academicInformation.map((existing, i) => ({
            ...existing,
            studentID: i === 0 ? data.studentId || null : existing.studentID,
            registrationNumber:
              i === 0
                ? data.registrationNumber || null
                : existing.registrationNumber,
            programName:
              i === 0
                ? data.programName || existing.programName
                : existing.programName,
            departmentName:
              i === 0
                ? data.departmentName || existing.departmentName
                : existing.departmentName,
            admissionYear:
              i === 0
                ? Number(data.admissionYear) || existing.admissionYear
                : existing.admissionYear,
            graduationYear:
              i === 0
                ? Number(data.graduationYear) || existing.graduationYear
                : existing.graduationYear,
            batch: i === 0 ? data.batch || existing.batch : existing.batch,
          }))
        : [
            {
              alumniEducationID: 0,
              studentID: data.studentId || null,
              registrationNumber: data.registrationNumber || null,
              rollNumber: null,
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
    jobExperience: jobs
      .filter(
        (j) =>
          j.company ||
          j.position ||
          j.startDate ||
          j.endDate ||
          j.location ||
          j.description,
      )
      .map((j, i) => ({
        jobExperienceID: current.jobExperience[i]?.jobExperienceID ?? 0,
        companyID: current.jobExperience[i]?.companyID ?? null,
        companyname: j.company || null,
        designation: j.position || null,
        startDate: j.startDate || null,
        endDate: j.endDate || null,
        location: j.location || null,
        city: current.jobExperience[i]?.city ?? null,
        country: current.jobExperience[i]?.country ?? null,
        description: j.description || null,
        isCurrent: Boolean(j.isCurrent),
        isVisible: current.jobExperience[i]?.isVisible ?? true,
      })),
    socialInformation: {
      ...current.socialInformation,
      linkedInLink: data.linkedinUrl || null,
      facebookLink: data.facebookUrl || null,
      gitHubLink: data.websiteUrl || null,
    },
  };
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authUser: user } = useAuth();
  const { selectedAlumni, loading, fetchAlumniById, createUpdateAlumni } =
    useAlumni();

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    createFamilyMember(),
  ]);
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    [],
  );
  const [jobExperiences, setJobExperiences] = useState<JobExperience[]>([
    createJobExperience(),
  ]);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState,
  } = useForm<AlumniFormValues>({
    resolver: yupResolver(alumniProfileEditSchema) as never,
    defaultValues: {} as never,
  });

  const sameAsPresentAddress = watch("sameAsPresentAddress");
  const profilePhoto = watch("profilePhoto");

  // Fetch profile only if not already loaded
  useEffect(() => {
    if (!user?.alumniId) return;
    if (!selectedAlumni || String(selectedAlumni.alumniID) !== user.alumniId) {
      void fetchAlumniById(user.alumniId).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.alumniId]);

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

  useEffect(() => {
    if (!selectedAlumni) return;
    const p = selectedAlumni.personalInformation;
    const c = selectedAlumni.contactInformation;
    const e = selectedAlumni.academicInformation[0];

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
      currentOccupation: "",
      designation: "",
      companyName: "",
      industry: "",
      workLocation: "",
      skills: [],
      linkedinUrl: selectedAlumni.socialInformation.linkedInLink ?? "",
      facebookUrl: selectedAlumni.socialInformation.facebookLink ?? "",
      websiteUrl: selectedAlumni.socialInformation.gitHubLink ?? "",
      bio: p.bio ?? "",
      isMentor: selectedAlumni.isMentor,
      willingToMentor: selectedAlumni.willingToMentor,
      familyMembers: [],
    } as never);

    setFamilyMembers(
      selectedAlumni.familyInformation.length
        ? selectedAlumni.familyInformation.map((m) => ({
            id: String(m.familyMemberID),
            name: m.familyMemberName,
            relation: m.relation,
            occupation: m.occupation ?? "",
            phone: m.phone ?? "",
          }))
        : [createFamilyMember()],
    );
    setEducationEntries([]);
    setJobExperiences(
      selectedAlumni.jobExperience.length
        ? selectedAlumni.jobExperience.map((j) => ({
            id: String(j.jobExperienceID),
            company: j.companyname ?? "",
            position: j.designation ?? "",
            startDate: j.startDate ?? "",
            endDate: j.endDate ?? "",
            location: j.location ?? "",
            description: j.description ?? "",
            isCurrent: j.isCurrent,
          }))
        : [createJobExperience()],
    );
  }, [selectedAlumni, reset]);

  const addFamilyMember = () =>
    setFamilyMembers((p) => [...p, createFamilyMember()]);
  const removeFamilyMember = (fid: string) =>
    setFamilyMembers((p) => p.filter((m) => m.id !== fid));
  const updateFamilyMember = (
    fid: string,
    field: keyof FamilyMember,
    value: string,
  ) =>
    setFamilyMembers((p) =>
      p.map((m) => (m.id === fid ? { ...m, [field]: value } : m)),
    );

  const addEducation = () =>
    setEducationEntries((p) => [
      ...p,
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
  const removeEducation = (eid: string) =>
    setEducationEntries((p) => p.filter((e) => e.id !== eid));
  const updateEducation = (
    eid: string,
    field: keyof EducationEntry,
    value: string | number,
  ) =>
    setEducationEntries((p) =>
      p.map((e) => (e.id === eid ? { ...e, [field]: value } : e)),
    );

  const addJob = () => setJobExperiences((p) => [...p, createJobExperience()]);
  const removeJob = (jid: string) =>
    setJobExperiences((p) => p.filter((j) => j.id !== jid));
  const updateJob = (
    jid: string,
    field: keyof JobExperience,
    value: string | boolean,
  ) =>
    setJobExperiences((p) =>
      p.map((j) => (j.id === jid ? { ...j, [field]: value } : j)),
    );

  // ============================================================
  // Photo upload handler
  // ============================================================
  const handlePhotoSelect = async (preview: string, file: File) => {
    // Show the base64 preview immediately
    setValue("profilePhoto" as never, preview as never);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("profilePhoto" as never, url as never);
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Failed to upload image"),
          severity: "error",
        }),
      );
      // Roll back to the previous value on failure
      setValue(
        "profilePhoto" as never,
        (selectedAlumni?.personalInformation.profilePhoto ?? "") as never,
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: AlumniFormValues) => {
    if (!selectedAlumni) return;
    if (uploading) {
      dispatch(
        showToast({
          message: "Please wait for the photo upload to finish.",
          severity: "warning",
        }),
      );
      return;
    }
    try {
      const base: CreateUpdateAlumniRequest = {
        alumniID: selectedAlumni.alumniID,
        isMentor: selectedAlumni.isMentor,
        willingToMentor: selectedAlumni.willingToMentor,
        isProfilePublic: selectedAlumni.isProfilePublic,
        personalInformation: selectedAlumni.personalInformation,
        contactInformation: selectedAlumni.contactInformation,
        familyInformation: selectedAlumni.familyInformation,
        academicInformation: selectedAlumni.academicInformation,
        jobExperience: selectedAlumni.jobExperience,
        socialInformation: selectedAlumni.socialInformation,
        privacy: selectedAlumni.privacy,
      };
      const payload = buildPayload(
        data,
        base,
        familyMembers,
        educationEntries,
        jobExperiences,
      );
      await createUpdateAlumni(payload);
      dispatch(
        showToast({
          message: "Profile updated successfully",
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save profile"),
          severity: "error",
        }),
      );
    }
  };

  if (loading && !selectedAlumni) return <AlumniProfileSkeleton />;
  if (!selectedAlumni) return <CommonEmptyState title="Profile not found" />;

  const a = selectedAlumni;

  return (
    <Box>
      <CommonPageHeader
        title="Profile Setup"
        subtitle="Complete your profile with personal, academic, and professional details"
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Profile", path: "/alumni/profile" },
          { label: "Profile Setup" },
        ]}
        actions={
          <CommonButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/alumni/profile")}
          >
            Back
          </CommonButton>
        }
      />

      {/* Banner */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 80,
            background:
              "linear-gradient(135deg, var(--color-chart-indigo) 0%, var(--color-chart-purple) 50%, var(--color-chart-pink) 100%)",
          }}
        />
        <CardContent sx={{ p: 2.5, pt: 0, mt: -4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { sm: "flex-end" },
            }}
          >
            <CommonAvatar
              src={
                profilePhoto || a.personalInformation.profilePhoto || undefined
              }
              name={a.personalInformation.fullName}
              size={72}
              sx={{ border: "3px solid white" }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {a.personalInformation.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {a.alumniCode}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ============ Personal Information ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <SectionHeader
              icon={<User size={18} />}
              title="Personal Information"
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="fullName"
                  label="Full Name"
                  control={control}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="nativeName"
                  label="Native Name"
                  control={control}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonSelectField
                  name="gender"
                  label="Gender"
                  control={control}
                  options={genderOptions}
                  placeholder="Select"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonDatePicker
                  name="dateOfBirth"
                  label="Date of Birth"
                  control={control}
                  maxDate={new Date()}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonSelectField
                  name="bloodGroup"
                  label="Blood Group"
                  control={control}
                  options={bloodOptions}
                  placeholder="Select"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                  label={uploading ? "Uploading..." : "Profile Photo"}
                  currentFile={profilePhoto || undefined}
                  onFileSelect={handlePhotoSelect}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ============ Contact Information ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <SectionHeader
              icon={<Phone size={18} />}
              title="Contact Information"
            />
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
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Present Address
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12, md: 12 }}>
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
              <Grid size={{ xs: 12, md: 12 }}>
                <CommonTextArea
                  name="permanentAddress"
                  label="Address"
                  control={control}
                  rows={2}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ============ Family Information ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <SectionHeader
                icon={<Users size={18} />}
                title="Family Information"
              />
              <Button
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addFamilyMember}
                sx={{
                  color: "var(--color-chart-indigo)",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Add Member
              </Button>
            </Box>
            <Grid container spacing={2}>
              {familyMembers.map((m) => (
                <Grid size={{ xs: 12 }} key={m.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  >
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CommonInputField
                          name={`familyName_${m.id}` as never}
                          label="Name"
                          control={control}
                          placeholder="Full name"
                          onChange={(e) =>
                            updateFamilyMember(m.id, "name", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CommonSelectField
                          name={`familyRelation_${m.id}` as never}
                          label="Relation"
                          control={control}
                          options={relationOptions}
                          placeholder="Select"
                          onChange={(e) =>
                            updateFamilyMember(m.id, "relation", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CommonInputField
                          name={`familyOccupation_${m.id}` as never}
                          label="Occupation"
                          control={control}
                          placeholder="Occupation"
                          onChange={(e) =>
                            updateFamilyMember(
                              m.id,
                              "occupation",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CommonInputField
                          name={`familyPhone_${m.id}` as never}
                          label="Phone"
                          control={control}
                          placeholder="Phone"
                          onChange={(e) =>
                            updateFamilyMember(m.id, "phone", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <IconButton
                          onClick={() => removeFamilyMember(m.id)}
                          color="error"
                          size="small"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* ============ Academic Information ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <SectionHeader
                icon={<GraduationCap size={18} />}
                title="Academic Information"
              />
              <Button
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addEducation}
                sx={{
                  color: "var(--color-chart-indigo)",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Add Education
              </Button>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                mb:
                  familyMembers.length > 0 || educationEntries.length > 0
                    ? 2
                    : 0,
              }}
            >
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="admissionYear"
                  label="Admission Year"
                  control={control}
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="graduationYear"
                  label="Graduation Year"
                  control={control}
                  required
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonSelectField
                  name="graduationSemester"
                  label="Graduation Semester"
                  control={control}
                  options={semesterOptions}
                  placeholder="Select"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="batch"
                  label="Batch"
                  control={control}
                  placeholder="e.g. 2018"
                />
              </Grid>
            </Grid>
            {educationEntries.length > 0 && <Divider sx={{ mb: 2 }} />}
            {educationEntries.map((e) => (
              <Box
                key={e.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  mb: 1.5,
                }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`eduDegree_${e.id}` as never}
                      label="Degree"
                      control={control}
                      placeholder="e.g. BSc"
                      onChange={(ev) =>
                        updateEducation(e.id, "degree", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`eduInst_${e.id}` as never}
                      label="Institution"
                      control={control}
                      placeholder="Institution name"
                      onChange={(ev) =>
                        updateEducation(e.id, "institution", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`eduField_${e.id}` as never}
                      label="Field of Study"
                      control={control}
                      placeholder="Field"
                      onChange={(ev) =>
                        updateEducation(e.id, "fieldOfStudy", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <CommonInputField
                      name={`eduStart_${e.id}` as never}
                      label="Start Year"
                      control={control}
                      type="number"
                      placeholder="YYYY"
                      onChange={(ev) =>
                        updateEducation(
                          e.id,
                          "startYear",
                          Number(ev.target.value) || 0,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <CommonInputField
                      name={`eduEnd_${e.id}` as never}
                      label="End Year"
                      control={control}
                      type="number"
                      placeholder="YYYY"
                      onChange={(ev) =>
                        updateEducation(
                          e.id,
                          "endYear",
                          Number(ev.target.value) || 0,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <IconButton
                      onClick={() => removeEducation(e.id)}
                      color="error"
                      size="small"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* ============ Job Experience ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <SectionHeader
                icon={<Briefcase size={18} />}
                title="Job Experience"
              />
              <Button
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addJob}
                sx={{
                  color: "var(--color-chart-indigo)",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Add Experience
              </Button>
            </Box>
            {jobExperiences.map((j) => (
              <Box
                key={j.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  mb: 1.5,
                }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobCompany_${j.id}` as never}
                      label="Company"
                      control={control}
                      placeholder="Company name"
                      onChange={(ev) =>
                        updateJob(j.id, "company", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobPosition_${j.id}` as never}
                      label="Position"
                      control={control}
                      placeholder="Job title"
                      onChange={(ev) =>
                        updateJob(j.id, "position", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobStart_${j.id}` as never}
                      label="Start Date"
                      type="month"
                      control={control}
                      placeholder="YYYY-MM"
                      onChange={(ev) =>
                        updateJob(j.id, "startDate", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobEnd_${j.id}` as never}
                      label="End Date"
                      control={control}
                      placeholder="YYYY-MM"
                      onChange={(ev) =>
                        updateJob(j.id, "endDate", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobLocation_${j.id}` as never}
                      label="Location"
                      control={control}
                      placeholder="City, Country"
                      onChange={(ev) =>
                        updateJob(j.id, "location", ev.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CommonInputField
                      name={`jobDesc_${j.id}` as never}
                      label="Description"
                      control={control}
                      placeholder="Brief description"
                      onChange={(ev) =>
                        updateJob(j.id, "description", ev.target.value)
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  size={{ xs: 12, sm: 12 }}
                  sx={{ mt: 1, textAlign: "right" }}
                >
                  <IconButton
                    onClick={() => removeJob(j.id)}
                    color="error"
                    size="small"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* ============ Social Information ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <SectionHeader
              icon={<Globe size={18} />}
              title="Social Information"
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="linkedinUrl"
                  label="LinkedIn URL"
                  control={control}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="facebookUrl"
                  label="Facebook URL"
                  control={control}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="websiteUrl"
                  label="Website URL"
                  control={control}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ============ Biography ============ */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <SectionHeader icon={<FileText size={18} />} title="Biography" />
            <CommonTextArea
              name="bio"
              label="Bio / About"
              control={control}
              rows={4}
              placeholder="Write a short biography..."
            />
          </CardContent>
        </Card>

        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 3 }}
        >
          <Button
            onClick={() => navigate("/alumni/profile")}
            startIcon={<ArrowLeft size={18} />}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <CommonButton
            type="submit"
            loading={formState.isSubmitting || uploading}
            startIcon={<Save size={18} />}
          >
            Save Profile
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
