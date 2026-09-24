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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniByIdAsync,
  createAlumniAsync,
  updateAlumniAsync,
} from "@/Slice/alumniSlice";
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
  CommonFileUpload,
  CommonButton,
  CommonLoading,
} from "@/components/common";
import type { CreateAlumniRequest, EducationEntry } from "@/types/alumni";
import { generateUUID } from "@/utils/generateId";
import { theme } from "@/store/theme";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";

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

export default function AlumniFormPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);
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
    resolver: yupResolver(alumniSchema) as never,
    context: { isEdit },
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
    if (isEdit && id) dispatch(fetchAlumniByIdAsync(id));
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedAlumni) {
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
        educationEntries: selectedAlumni.educationEntries || [],
        familyMembers: selectedAlumni.familyMembers || [],
        ...Object.fromEntries(
          (selectedAlumni.educationEntries || []).flatMap((entry) => [
            [`educationDegree_${entry.id}`, entry.degree],
            [`educationInstitution_${entry.id}`, entry.institution],
            [`educationField_${entry.id}`, entry.fieldOfStudy || ""],
            [`educationStart_${entry.id}`, entry.startYear || ""],
            [`educationEnd_${entry.id}`, entry.endYear || ""],
            [`educationResult_${entry.id}`, entry.result || ""],
          ]),
        ),
      } as never);
      setSkillsInput((selectedAlumni.skills || []).join(", "));
      setEducationEntries(selectedAlumni.educationEntries || []);
    }
  }, [isEdit, selectedAlumni, reset]);

  useEffect(() => {
    if (!isEdit || !selectedAlumni) return;
    setBreadcrumbLabel(location.pathname, selectedAlumni.fullName);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    isEdit,
    location.pathname,
    selectedAlumni,
    setBreadcrumbLabel,
  ]);

  const onSubmit = async (data: AlumniFormValues) => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload: CreateAlumniRequest = {
      ...data,
      skills,
      admissionYear: Number(data.admissionYear) || undefined,
      graduationYear: Number(data.graduationYear) || undefined,
      educationEntries,
    } as CreateAlumniRequest;

    if (isEdit && id) {
      const res = await dispatch(
        updateAlumniAsync({ id, data: { ...payload, id } }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(
          showToast({
            message: "Alumni information updated successfully",
            severity: "success",
          }),
        );
        navigate(`/alumni/${id}`);
      } else {
        dispatch(
          showToast({
            message: "Unable to save alumni information",
            severity: "error",
          }),
        );
      }
    } else {
      const res = await dispatch(createAlumniAsync(payload));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(
          showToast({
            message: "Alumni created successfully",
            severity: "success",
          }),
        );
        navigate("/alumni");
      } else {
        dispatch(
          showToast({
            message: "Unable to save alumni information",
            severity: "error",
          }),
        );
      }
    }
  };

  const addEducation = () =>
    setEducationEntries((previous) => [
      ...previous,
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
    setEducationEntries((previous) =>
      previous.filter((entry) => entry.id !== id),
    );

  const updateEducation = (
    id: string,
    field: keyof EducationEntry,
    value: string | number,
  ) =>
    setEducationEntries((previous) =>
      previous.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );

  if (loading && isEdit && !selectedAlumni) return <CommonLoading />;

  return (
    <Box>
      <CommonPageHeader
        title={isEdit ? "Edit Alumni" : "Add New Alumni"}
        subtitle={
          isEdit ? "Update alumni information" : "Create a new alumni record"
        }
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Manage Alumni", path: "/alumni" },
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

      <form onSubmit={handleSubmit(onSubmit) as never}>
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
                onFileSelect={(url) =>
                  setValue("profilePhoto" as never, url as never)
                }
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
            <Grid size={{ xs: 12, sm: 12 }}>
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
        </Section>

        <Section title="Academic Information">
          <Grid container spacing={2}>
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
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <CommonInputField
                name="rollNumber"
                label="Roll Number"
                control={control}
              />
            </Grid> */}
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
                >
                  {/* Remove */}
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationDegree_${entry.id}` as never}
                    label="Degree"
                    control={control}
                    onChange={(event) =>
                      updateEducation(entry.id, "degree", event.target.value)
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationInstitution_${entry.id}` as never}
                    label="Institution"
                    control={control}
                    onChange={(event) =>
                      updateEducation(
                        entry.id,
                        "institution",
                        event.target.value,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CommonInputField
                    name={`educationField_${entry.id}` as never}
                    label="Field of Study"
                    control={control}
                    onChange={(event) =>
                      updateEducation(
                        entry.id,
                        "fieldOfStudy",
                        event.target.value,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <CommonInputField
                    name={`educationStart_${entry.id}` as never}
                    label="Start Year"
                    control={control}
                    type="number"
                    onChange={(event) =>
                      updateEducation(
                        entry.id,
                        "startYear",
                        Number(event.target.value) || 0,
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
                    onChange={(event) =>
                      updateEducation(
                        entry.id,
                        "endYear",
                        Number(event.target.value) || 0,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CommonInputField
                    name={`educationResult_${entry.id}` as never}
                    label="Result"
                    control={control}
                    onChange={(event) =>
                      updateEducation(entry.id, "result", event.target.value)
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
                    nameNative: "",
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
              {/* Form Item Header */}
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

              {/* Inputs Grid */}
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
                      name={`familyMembers.${index}.nameNative` as never}
                      label="Name (Native)"
                      control={control}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.relation` as never}
                      label="Relation"
                      control={control}
                      required
                      placeholder="e.g. Father, Spouse"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <CommonInputField
                      name={`familyMembers.${index}.occupation` as never}
                      label="Occupation"
                      control={control}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

          {/* Bottom Action Button */}
          {familyFields.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Plus size={18} />}
              onClick={() =>
                appendFamily({
                  name: "",
                  nameNative: "",
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

        {/* <Section title="Alumni Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="username"
                label="Username"
                control={control}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonInputField
                name="password"
                label={
                  isEdit ? "New Password (leave blank to keep)" : "Password"
                }
                control={control}
                type="password"
                required={!isEdit}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonSelectField
                name="status"
                label="Status"
                control={control}
                options={statusOptions}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonCheckbox
                name="isVerified"
                label="Verified Alumni"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonCheckbox
                name="isMentor"
                label="Is Mentor"
                control={control}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CommonCheckbox
                name="willingToMentor"
                label="Willing to Mentor"
                control={control}
              />
            </Grid>
          </Grid>
        </Section> */}

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
