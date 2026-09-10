import * as yup from "yup";

export const alumniSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().optional(),
  lastName: yup.string().required("Last name is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other", ""], "Invalid gender")
    .optional(),
  dateOfBirth: yup.string().optional(),
  bloodGroup: yup.string().optional(),
  maritalStatus: yup
    .string()
    .oneOf(["Single", "Married", "Divorced", "Widowed", "Separated", ""])
    .optional(),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[+]?[\d\s\-()]{7,15}$/, "Invalid phone number"),
  alternatePhone: yup.string().optional(),
  presentAddress: yup.string().required("Address is required"),
  presentVillageArea: yup.string().required("Village/Area is required"),
  presentCountry: yup.string().required("Country is required"),
  presentDivision: yup.string().required("Division is required"),
  presentDistrict: yup.string().optional(),
  presentThana: yup.string().optional(),
  presentUnion: yup.string().optional(),
  permanentAddress: yup.string().required("Address is required"),
  permanentVillageArea: yup.string().required("Village/Area is required"),
  permanentCountry: yup.string().optional(),
  permanentDivision: yup.string().optional(),
  permanentDistrict: yup.string().optional(),
  permanentThana: yup.string().optional(),
  permanentUnion: yup.string().optional(),
  sameAsPresentAddress: yup.boolean().optional(),
  city: yup.string().optional(),
  country: yup.string().optional(),
  studentId: yup.string().optional(),
  registrationNumber: yup.string().optional(),
  programName: yup.string().required("Program is required"),
  departmentName: yup.string().optional(),
  facultyId: yup.string().optional(),
  facultyName: yup.string().optional(),
  profilePhoto: yup.string().optional(),
  admissionYear: yup
    .number()
    .typeError("Must be a valid year")
    .min(1950, "Year too old")
    .max(new Date().getFullYear() + 1, "Year too far ahead")
    .optional(),
  graduationYear: yup
    .number()
    .typeError("Must be a valid year")
    .min(1950, "Year too old")
    .max(new Date().getFullYear() + 1, "Year too far ahead")
    .required("Graduation year is required"),
  graduationSemester: yup.string().optional(),
  batch: yup.string().optional(),
  rollNumber: yup.string().optional(),
  currentOccupation: yup.string().optional(),
  designation: yup.string().optional(),
  companyName: yup.string().optional(),
  industry: yup.string().optional(),
  workLocation: yup.string().optional(),
  skills: yup.array().of(yup.string()).optional(),
  linkedinUrl: yup
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? undefined : v)),
  facebookUrl: yup
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? undefined : v)),
  websiteUrl: yup
    .string()
    .url("Invalid URL")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? undefined : v)),
  bio: yup.string().optional(),
  isMentor: yup.boolean().optional(),
  willingToMentor: yup.boolean().optional(),
  username: yup.string().required("Username is required"),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (s) =>
      s.required("Password is required").min(6, "At least 6 characters"),
    otherwise: (s) => s.optional(),
  }),
  status: yup
    .string()
    .oneOf(["ACTIVE", "INACTIVE", "PENDING"])
    .required("Status is required"),
  isVerified: yup.boolean().optional(),
  familyMembers: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Family member name is required"),
        relation: yup.string().required("Relation is required"),
        occupation: yup.string().optional(),
        phone: yup
          .string()
          .optional()
          .matches(/^[+]?[\d\s\-()]*$/, "Invalid phone number"),
      }),
    )
    .optional(),
  educationEntries: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        degree: yup.string().optional(),
        institution: yup.string().optional(),
        fieldOfStudy: yup.string().optional(),
        startYear: yup.number().optional(),
        endYear: yup.number().optional(),
        result: yup.string().optional(),
      }),
    )
    .optional(),
});

export type AlumniFormValues = yup.InferType<typeof alumniSchema>;
