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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
  MapPin,
  Globe,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAlumniByIdAsync, updateAlumniAsync } from "@/Slice/alumniSlice";
import { showToast } from "@/Slice/uiSlice";
import {
  alumniSchema,
  type AlumniFormValues,
} from "@/validation/alumniValidation";
import {
  CommonPageHeader,
  CommonInputField,
  CommonSelectField,
  CommonDatePicker,
  CommonTextArea,
  CommonCheckbox,
  CommonButton,
  CommonLoading,
  CommonEmptyState,
  CommonAvatar,
} from "@/components/common";
import type {
  FamilyMember,
  EducationEntry,
  JobExperience,
} from "@/types/alumni";
import { generateUUID } from "@/utils/generateId";

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
const unionOptions = [
  "Select union",
  "Ward 1",
  "Ward 2",
  "Ward 3",
  "Other",
].map((v) => ({ label: v, value: v === "Select union" ? "" : v }));
const addressFieldMap = {
  address: "presentAddress",
  villageArea: "presentVillageArea",
  country: "presentCountry",
  division: "presentDivision",
  district: "presentDistrict",
  thana: "presentThana",
  union: "presentUnion",
} as const;
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
].map((r) => ({ label: r, value: r }));

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
          bgcolor: "rgba(99,102,241,0.1)",
          color: "#6366f1",
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

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    createFamilyMember(),
  ]);
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    [],
  );
  const [jobExperiences, setJobExperiences] = useState<JobExperience[]>([
    createJobExperience(),
  ]);
  const [skillsInput, setSkillsInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState,
  } = useForm<AlumniFormValues>({
    resolver: yupResolver(alumniSchema) as never,
    context: { isEdit: true },
    defaultValues: {} as never,
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

  useEffect(() => {
    if (user?.alumniId) dispatch(fetchAlumniByIdAsync(user.alumniId));
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedAlumni) {
      reset({
        fullName: selectedAlumni.fullName || "",
        nativeName: selectedAlumni.nativeName || "",
        gender: selectedAlumni.gender || "",
        dateOfBirth: selectedAlumni.dateOfBirth || "",
        bloodGroup: selectedAlumni.bloodGroup || "",
        maritalStatus: selectedAlumni.maritalStatus || "",
        email: selectedAlumni.email,
        phone: selectedAlumni.phone,
        alternatePhone: selectedAlumni.alternatePhone || "",
        presentAddress: selectedAlumni.presentAddress || "",
        presentVillageArea: selectedAlumni.presentVillageArea || "",
        presentCountry: selectedAlumni.presentCountry || "",
        presentDivision: selectedAlumni.presentDivision || "",
        presentDistrict: selectedAlumni.presentDistrict || "",
        presentThana: selectedAlumni.presentThana || "",
        presentUnion: selectedAlumni.presentUnion || "",
        permanentAddress: selectedAlumni.permanentAddress || "",
        permanentVillageArea: selectedAlumni.permanentVillageArea || "",
        permanentCountry: selectedAlumni.permanentCountry || "",
        permanentDivision: selectedAlumni.permanentDivision || "",
        permanentDistrict: selectedAlumni.permanentDistrict || "",
        permanentThana: selectedAlumni.permanentThana || "",
        permanentUnion: selectedAlumni.permanentUnion || "",
        city: selectedAlumni.city || "",
        country: selectedAlumni.country || "",
        studentId: selectedAlumni.studentId || "",
        registrationNumber: selectedAlumni.registrationNumber || "",
        programName: selectedAlumni.programName || "",
        departmentName: selectedAlumni.departmentName || "",
        facultyId: selectedAlumni.facultyId || "",
        facultyName: selectedAlumni.facultyName || "",
        profilePhoto: selectedAlumni.profilePhoto || "",
        admissionYear: selectedAlumni.admissionYear as never,
        graduationYear: selectedAlumni.graduationYear as never,
        graduationSemester: selectedAlumni.graduationSemester || "",
        batch: selectedAlumni.batch || "",
        rollNumber: selectedAlumni.rollNumber || "",
        currentOccupation: selectedAlumni.currentOccupation || "",
        designation: selectedAlumni.designation || "",
        companyName: selectedAlumni.companyName || "",
        industry: selectedAlumni.industry || "",
        workLocation: selectedAlumni.workLocation || "",
        skills: selectedAlumni.skills || [],
        linkedinUrl: selectedAlumni.linkedinUrl || "",
        facebookUrl: selectedAlumni.facebookUrl || "",
        websiteUrl: selectedAlumni.websiteUrl || "",
        bio: selectedAlumni.bio || "",
        isMentor: selectedAlumni.isMentor || false,
        willingToMentor: selectedAlumni.willingToMentor || false,
        username: selectedAlumni.username,
        password: "",
        status: selectedAlumni.status,
        isVerified: selectedAlumni.isVerified || false,
      } as never);
      setSkillsInput((selectedAlumni.skills || []).join(", "));
      setFamilyMembers(
        selectedAlumni.familyMembers?.length
          ? selectedAlumni.familyMembers
          : [createFamilyMember()],
      );
      setEducationEntries(selectedAlumni.educationEntries || []);
      setJobExperiences(
        selectedAlumni.jobExperiences?.length
          ? selectedAlumni.jobExperiences
          : [createJobExperience()],
      );
    }
  }, [selectedAlumni, reset]);

  const addFamilyMember = () =>
    setFamilyMembers((p) => [...p, createFamilyMember()]);
  const removeFamilyMember = (id: string) =>
    setFamilyMembers((p) => p.filter((m) => m.id !== id));
  const updateFamilyMember = (
    id: string,
    field: keyof FamilyMember,
    value: string,
  ) =>
    setFamilyMembers((p) =>
      p.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
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
  const removeEducation = (id: string) =>
    setEducationEntries((p) => p.filter((e) => e.id !== id));
  const updateEducation = (
    id: string,
    field: keyof EducationEntry,
    value: string | number,
  ) =>
    setEducationEntries((p) =>
      p.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const addJob = () => setJobExperiences((p) => [...p, createJobExperience()]);
  const removeJob = (id: string) =>
    setJobExperiences((p) => p.filter((j) => j.id !== id));
  const updateJob = (
    id: string,
    field: keyof JobExperience,
    value: string | boolean,
  ) =>
    setJobExperiences((p) =>
      p.map((j) => (j.id === id ? { ...j, [field]: value } : j)),
    );

  const onSubmit = async (data: AlumniFormValues) => {
    if (!selectedAlumni) return;
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      ...data,
      skills,
      admissionYear: Number(data.admissionYear) || undefined,
      graduationYear: Number(data.graduationYear) || undefined,
      familyMembers,
      educationEntries,
      jobExperiences,
      id: selectedAlumni.id,
    } as never;
    const res = await dispatch(
      updateAlumniAsync({ id: selectedAlumni.id, data: payload }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({
          message: "Profile updated successfully",
          severity: "success",
        }),
      );
    } else {
      dispatch(
        showToast({ message: "Unable to save profile", severity: "error" }),
      );
    }
  };

  if (loading && !selectedAlumni) return <CommonLoading />;
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

      {/* Profile banner */}
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
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
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
              src={a.profilePhoto}
              name={a.fullName}
              size={72}
              sx={{ border: "3px solid white" }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {a.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {a.alumniId}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit) as never}>
        {/* Personal Information */}
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
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information */}
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
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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

        {/* Family Members */}
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
                  color: "#6366f1",
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

        {/* Academic Information / Education Entries */}
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
                  color: "#6366f1",
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
                  label="Student id"
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
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="rollNumber"
                  label="Roll Number"
                  control={control}
                />
              </Grid> */}
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

        {/* Job Experience */}
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
                  color: "#6366f1",
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
                  <Grid size={{ xs: 12, sm: 1 }}>
                    <IconButton
                      onClick={() => removeJob(j.id)}
                      color="error"
                      size="small"
                    >
                      <Trash2 size={16} />
                    </IconButton>
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
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Social Information */}
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

        {/* Biography */}
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
            loading={formState.isSubmitting}
            startIcon={<Save size={18} />}
          >
            Save Profile
          </CommonButton>
        </Box>
      </form>
    </Box>
  );
}
