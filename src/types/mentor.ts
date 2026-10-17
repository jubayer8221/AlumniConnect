export interface MentorListItem {
  alumniID: number;
  alumniCode?: string | null;
  fullName?: string | null;
  profilePhoto?: string | null;
  bio?: string | null;
  gender?: string | null;
  presentDistrict?: string | null;
  presentCountry?: string | null;
  email?: string | null;
  programName?: string | null;
  departmentName?: string | null;
  batch?: string | null;
  graduationYear?: number | null;
  companyName?: string | null;
  designation?: string | null;
  industry?: string | null;
}

export interface MentorQuery {
  search?: string;
  programId?: number;
  pageNumber?: number;
  pageSize?: number;
}
