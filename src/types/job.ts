export interface JobItem {
  jobID: string;
  title: string;
  company: string;
  location?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryRange?: string | null;
  description?: string | null;
  applyURL?: string | null;
  contactEmail?: string | null;
  deadline?: string | null;
  image?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  postedBy?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateUpdateJobRequest {
  jobID?: string | null;
  title: string;
  company: string;
  location?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryRange?: string | null;
  description?: string | null;
  applyURL?: string | null;
  contactEmail?: string | null;
  deadline?: string | null;
  image?: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

export interface JobQuery {
  search?: string;
  employmentType?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Remote",
  "Contract",
  "Freelance",
] as const;

export const EXPERIENCE_LEVELS = [
  "Entry",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Executive",
] as const;
