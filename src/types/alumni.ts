// src/types/alumni.ts

/* ============================================================
   Raw API shapes — match the backend exactly.
   ============================================================ */

export interface PersonalInformation {
  fullName: string;
  nativeName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  maritalStatusID: string | null;
  profilePhoto: string | null;
  bio: string | null;
  hobby: string | null;
  tShirtSize: string | null;
}

export interface ContactInformation {
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  presentCountry: string | null;
  presentDivision: string | null;
  presentDistrict: string | null;
  presentThana: string | null;
  presentUnion: string | null;
  presentVillageArea: string | null;
  fullpresentAddress: string | null;
  isSameAsPresentAddress: boolean;
  permanentCountry: string | null;
  permanentDivision: string | null;
  permanentDistrict: string | null;
  permanentThana: string | null;
  permanentUnion: string | null;
  permanentVillageArea: string | null;
  fullPermanentAddress: string | null;
}

export interface FamilyMemberAPI {
  familyMemberID: number;
  familyMemberName: string;
  relation: string;
  occupation: string | null;
  phone: string | null;
  isVisible: boolean;
}

export interface AcademicInformation {
  alumniEducationID: number;
  studentID: string | null;
  registrationNumber: string | null;
  rollNumber: string | null;
  programID: number | null;
  programName: string | null;
  departmentID: number | null;
  departmentName: string | null;
  facultyID: number | null;
  facultyName: string | null;
  admissionYear: number | null;
  graduationYear: number | null;
  graduationSemester: string | null;
  batch: string | null;
  secondarySchoolName: string | null;
  isVisible: boolean;
}

export interface JobExperienceAPI {
  jobExperienceID: number;
  companyID: string | null;
  companyname: string | null;
  designation: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  isCurrent: boolean;
  isVisible: boolean;
}

export interface SocialInformation {
  facebookLink: string | null;
  instagramLink: string | null;
  twitterLink: string | null;
  linkedInLink: string | null;
  gitHubLink: string | null;
}

export interface PrivacyFlags {
  isSocialMediaVisible: boolean;
  isFamilyInformationVisible: boolean;
  isJobExperienceVisible: boolean;
  isContactInformationVisible: boolean;
  isAcademicInformationVisible: boolean;
}

export interface AlumniProfileFullModel {
  alumniID: number;
  alumniCode: string;
  userID: number;
  userCode: string;
  username: string;
  status: string;
  isVerified: boolean;
  isMentor: boolean;
  willingToMentor: boolean;
  isProfilePublic: boolean;
  personalInformation: PersonalInformation;
  contactInformation: ContactInformation;
  familyInformation: FamilyMemberAPI[];
  academicInformation: AcademicInformation[];
  jobExperience: JobExperienceAPI[];
  socialInformation: SocialInformation;
  privacy: PrivacyFlags;
}

export type PrivacyLevel = "PUBLIC" | "ALUMNI_ONLY" | "PRIVATE";

export interface AlumniPrivacySettings {
  alumniID: number;
  isProfilePublic: boolean;
  personalInfoVisibility: PrivacyLevel;
  contactInfoVisibility: PrivacyLevel;
  academicInfoVisibility: PrivacyLevel;
  jobExperienceVisibility: PrivacyLevel;
  socialInfoVisibility: PrivacyLevel;
  familyInfoVisibility: PrivacyLevel;
  biographyVisibility: PrivacyLevel;
  displayEmail: boolean;
  displayPhone: boolean;
  displayAddress: boolean;
  displayCompany: boolean;
  displaySocialMedia: boolean;
}

/* ============================================================
   Request shapes — POST /api/Alumni/CreateUpdateAlumni
   ============================================================ */

export interface CreateUpdateAlumniRequest {
  alumniID?: number | null;
  userCode?: string | null;
  alumniCode?: string | null;
  username?: string | null;
  password?: string | null;
  status?: string | null;
  isVerified?: boolean;
  isMentor: boolean;
  willingToMentor: boolean;
  isProfilePublic: boolean;
  personalInformation: PersonalInformation;
  contactInformation: ContactInformation;
  familyInformation: FamilyMemberAPI[];
  academicInformation: AcademicInformation[];
  jobExperience: JobExperienceAPI[];
  socialInformation: SocialInformation;
  privacy: PrivacyFlags;
  createdBy?: number | null;
}

export interface AlumniListQuery {
  search?: string;
  status?: string;
  programId?: number;
  graduationYear?: number;
  pageNumber?: number;
  pageSize?: number;
}

/* ============================================================
   UI-side shapes — form helpers, not sent to API directly
   ============================================================ */

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
