export interface DashboardSummary {
  totalAlumni: number;
  activeAlumni: number;
  inactiveAlumni: number;
  pendingAlumni: number;
  verifiedAlumni: number;
  mentors: number;
  newAlumniThisYear: number;
  totalEvents: number;
  upcomingEvents: number;
  maleAlumni: number;
  femaleAlumni: number;
  otherAlumni: number;
}

export interface ChartDataItem {
  label: string;
  value: number;
}

export interface AlumniGrowthItem {
  year: string;
  count: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  alumniByGraduationYear: ChartDataItem[];
  alumniByDepartment: ChartDataItem[];
  alumniByProgram: ChartDataItem[];
  alumniByLocation: ChartDataItem[];
  alumniByIndustry: ChartDataItem[];
  alumniGrowth: AlumniGrowthItem[];
  mentorAvailability: {
    mentors: number;
    willing: number;
    total: number;
  };
  recentAlumni: Array<{
    id: number;
    alumniCode: string;
    fullName: string;
    profilePhoto?: string;
    departmentName?: string;
    createdAt?: string;
  }>;
  pendingVerification: Array<{
    id: number;
    alumniCode: string;
    fullName: string;
    profilePhoto?: string;
    email?: string;
  }>;
  // Optional — filled by event/notice calls if needed
  upcomingEvents?: Array<{
    id: string;
    eventId: string;
    title: string;
    date: string;
    location: string;
    eventType: string;
  }>;
  recentNotices?: Array<{
    id: string;
    title: string;
    category: string;
    publishDate: string;
  }>;
}
