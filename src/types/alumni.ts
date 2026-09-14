export type AlumniStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type Gender = "Male" | "Female" | "Other";
export type MaritalStatus =
  | "Single"
  | "Married"
  | "Divorced"
  | "Widowed"
  | "Separated";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Alumni {
  id: string;
  alumniId: string;
  userId: string;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName: string;
  nativeName?: string;
  profilePhoto?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  maritalStatus?: MaritalStatus;
  email: string;
  phone: string;
  alternatePhone?: string;
  presentAddress?: string;
  presentVillageArea?: string;
  presentCountry?: string;
  presentDivision?: string;
  presentDistrict?: string;
  presentThana?: string;
  presentUnion?: string;
  permanentAddress?: string;
  permanentVillageArea?: string;
  permanentCountry?: string;
  permanentDivision?: string;
  permanentDistrict?: string;
  permanentThana?: string;
  permanentUnion?: string;
  city?: string;
  country?: string;
  studentId?: string;
  registrationNumber?: string;
  programId?: string;
  programName?: string;
  departmentId?: string;
  departmentName?: string;
  facultyId?: string;
  facultyName?: string;
  admissionYear?: number;
  graduationYear?: number;
  graduationSemester?: string;
  batch?: string;
  rollNumber?: string;
  currentOccupation?: string;
  designation?: string;
  companyName?: string;
  industry?: string;
  workLocation?: string;
  skills?: string[];
  linkedinUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  bio?: string;
  isMentor?: boolean;
  willingToMentor?: boolean;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  status: AlumniStatus;
  privacy?: AlumniPrivacy;
  achievements?: AlumniAchievement[];
  familyMembers?: FamilyMember[];
  educationEntries?: EducationEntry[];
  jobExperiences?: JobExperience[];
  sectionPrivacy?: SectionPrivacy;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniPrivacy {
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showCompany: boolean;
  showSocialLinks: boolean;
  profileVisibility: "PUBLIC" | "PRIVATE";
}

export interface SectionPrivacy {
  personalInfo: PrivacyLevel;
  contactInfo: PrivacyLevel;
  academicInfo: PrivacyLevel;
  jobExperience: PrivacyLevel;
  socialInfo: PrivacyLevel;
  familyInfo: PrivacyLevel;
  biography: PrivacyLevel;
}

export interface AlumniAchievement {
  id: string;
  type:
    | "Award"
    | "Achievement"
    | "Publication"
    | "Entrepreneurship"
    | "Career Milestone"
    | "Community Contribution";
  title: string;
  description?: string;
  date?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  occupation?: string;
  phone?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  result?: string;
}

export interface JobExperience {
  id: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  isCurrent?: boolean;
}

export type PrivacyLevel = "PUBLIC" | "ALUMNI_ONLY" | "PRIVATE";

export interface AlumniFilters {
  search?: string;
  programId?: string;
  departmentId?: string;
  facultyId?: string;
  admissionYear?: number;
  graduationYear?: number;
  batch?: string;
  gender?: Gender;
  city?: string;
  country?: string;
  industry?: string;
  companyName?: string;
  status?: AlumniStatus;
  isVerified?: boolean;
  willingToMentor?: boolean;
}

export interface CreateAlumniRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  nativeName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  maritalStatus?: MaritalStatus;
  email: string;
  phone: string;
  alternatePhone?: string;
  presentAddress?: string;
  presentVillageArea?: string;
  presentCountry?: string;
  presentDivision?: string;
  presentDistrict?: string;
  presentThana?: string;
  presentUnion?: string;
  permanentAddress?: string;
  permanentVillageArea?: string;
  permanentCountry?: string;
  permanentDivision?: string;
  permanentDistrict?: string;
  permanentThana?: string;
  permanentUnion?: string;
  city?: string;
  country?: string;
  studentId?: string;
  registrationNumber?: string;
  programId?: string;
  programName?: string;
  departmentId?: string;
  departmentName?: string;
  facultyId?: string;
  facultyName?: string;
  admissionYear?: number;
  graduationYear?: number;
  graduationSemester?: string;
  batch?: string;
  rollNumber?: string;
  currentOccupation?: string;
  designation?: string;
  companyName?: string;
  industry?: string;
  workLocation?: string;
  skills?: string[];
  linkedinUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  bio?: string;
  profilePhoto?: string;
  isMentor?: boolean;
  willingToMentor?: boolean;
  username: string;
  password?: string;
  status: AlumniStatus;
  isVerified?: boolean;
  familyMembers?: FamilyMember[];
  educationEntries?: EducationEntry[];
  jobExperiences?: JobExperience[];
  sectionPrivacy?: SectionPrivacy;
}

export type UpdateAlumniRequest = Partial<CreateAlumniRequest> & { id: string };

export interface AlumniQueryParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filters?: AlumniFilters;
}
