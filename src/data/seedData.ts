import type { CredentialRecord } from "@/types/auth";
import type { Alumni, AlumniPrivacy } from "@/types/alumni";
import type { EventItem, EventRegistration } from "@/types/event";
import type { Notice } from "@/types/notice";
import { AlumniRows } from "@/data/AlumniData";

const defaultPrivacy: AlumniPrivacy = {
  showEmail: true,
  showPhone: true,
  showAddress: false,
  showCompany: true,
  showSocialLinks: true,
  profileVisibility: "PUBLIC",
};

function isoDate(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day).toISOString();
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ────────────────────────────── Alumni ──────────────────────────────────────

type AlumniSeed = Omit<
  Alumni,
  | "fullName"
  | "firstName"
  | "middleName"
  | "lastName"
  | "createdAt"
  | "updatedAt"
  | "privacy"
  | "verificationStatus"
> & {
  fullName: string;
  createdAt?: string;
  updatedAt?: string;
};

const importedAlumniSeeds: AlumniSeed[] = AlumniRows.map((row) => ({
  id: row.id,
  alumniId: row.alumniId || row.id,
  userId: row.userId || `cred-alm-${row.id}`,
  username: row.username || row.email || `alumni${row.id}`,
  fullName: row.fullName,
  profilePhoto: row.profilePhoto || undefined,
  gender:
    row.gender === "Male" || row.gender === "Female" || row.gender === "Other"
      ? row.gender
      : undefined,
  dateOfBirth: row.dateOfBirth || undefined,
  bloodGroup: row.bloodGroup || undefined,
  email: row.email || `alumni${row.id}@ssc98.local`,
  phone: row.phone || "",
  presentAddress: row.presentAddress || undefined,
  permanentAddress: row.permanentAddress || undefined,
  city: row.city || undefined,
  country: row.country || "Bangladesh",
  studentId: row.studentId || undefined,
  registrationNumber: row.registrationNumber || undefined,
  programId: row.programId || undefined,
  programName: row.programName || "SSC",
  departmentId: row.departmentId || undefined,
  departmentName: row.departmentName || undefined,
  facultyId: row.facultyId || undefined,
  facultyName: row.facultyName || undefined,
  admissionYear: row.admissionYear || undefined,
  graduationYear: row.graduationYear || 1998,
  graduationSemester: row.graduationSemester || undefined,
  batch: row.batch || "1998",
  rollNumber: row.rollNumber || undefined,
  currentOccupation: row.currentOccupation || undefined,
  designation: row.designation || row.currentOccupation || undefined,
  companyName: row.companyName || undefined,
  industry: row.industry || undefined,
  workLocation: row.workLocation || undefined,
  skills: row.skills || [],
  linkedinUrl: row.linkedinUrl || undefined,
  facebookUrl: row.facebookUrl || undefined,
  websiteUrl: row.websiteUrl || undefined,
  bio: row.bio || undefined,
  isMentor: row.isMentor ?? false,
  willingToMentor: row.willingToMentor,
  isVerified: row.isVerified,
  status:
    row.status === "ACTIVE" ||
    row.status === "INACTIVE" ||
    row.status === "PENDING"
      ? row.status
      : "ACTIVE",
  secondarySchoolName: row.secondarySchoolName || undefined,
  hobby: row.hobby || undefined,
  tShirtSize: row.tShirtSize || undefined,
  SerialNumber: row.SerialNumber,
}));

export const seedAlumni: Alumni[] = [...importedAlumniSeeds].map((a, i) => ({
  ...a,
  username: a.username,
  privacy: { ...defaultPrivacy },
  verificationStatus: a.isVerified ? "VERIFIED" : "PENDING",
  createdAt: isoDaysFromNow(-(i + 1) * 3),
  updatedAt: isoDaysFromNow(-(i + 1) * 2),
}));

// ─── Credentials ───────────────────────────────────────────────────────────

export const seedCredentials: CredentialRecord[] = [
  {
    id: "admin-user",
    username: "admin",
    password: "123456",
    role: "ADMIN",
    displayName: "Administrator",
  },
  ...seedAlumni.map((alumni) => ({
    id: alumni.userId,
    username: alumni.username,
    password: "123456",
    role: "ALUMNI" as const,
    alumniId: alumni.alumniId,
    email: alumni.email,
    phone: alumni.phone,
    displayName: alumni.fullName,
  })),
];

// ─── Events ─────────────────────────────────────────────────────────────────

export const seedEvents: EventItem[] = [
  {
    id: "evt-uuid-001",
    eventId: "EVT-00001",
    title: "Grand Alumni Reunion 2026",
    description:
      "Join us for the biggest alumni gathering of the year! Reconnect with old friends, network with fellow alumni, and enjoy an evening of nostalgia, dinner, and entertainment.",
    eventType: "Reunion",
    date: isoDaysFromNow(30),
    startTime: "18:00",
    endTime: "22:00",
    location: "ABC University Main Campus",
    venue: "Grand Auditorium",
    organizer: "Alumni Association",
    registrationDeadline: isoDaysFromNow(25),
    capacity: 500,
    status: "UPCOMING",
    image:
      "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
    createdAt: isoDaysFromNow(-10),
    updatedAt: isoDaysFromNow(-10),
  },
  {
    id: "evt-uuid-002",
    eventId: "EVT-00002",
    title: "Career Fair: Tech & Innovation",
    description:
      "Connect with top tech companies hiring for software engineering, data science, and product management roles. Open to all alumni.",
    eventType: "Career",
    date: isoDaysFromNow(15),
    startTime: "10:00",
    endTime: "17:00",
    location: "ABC University Main Campus",
    venue: "Conference Hall B",
    organizer: "Career Services Office",
    registrationDeadline: isoDaysFromNow(12),
    capacity: 300,
    status: "UPCOMING",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    createdAt: isoDaysFromNow(-10),
    updatedAt: isoDaysFromNow(-10),
  },
  {
    id: "evt-uuid-003",
    eventId: "EVT-00003",
    title: "Workshop: AI & Machine Learning",
    description:
      "Hands-on workshop covering the latest in AI and ML. Learn from industry experts and alumni working at Google, Meta, and more.",
    eventType: "Workshop",
    date: isoDaysFromNow(45),
    startTime: "09:00",
    endTime: "16:00",
    location: "Online",
    venue: "Zoom Webinar",
    organizer: "Department of Computer Science",
    registrationDeadline: isoDaysFromNow(40),
    capacity: 200,
    status: "UPCOMING",
    image:
      "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800",
    createdAt: isoDaysFromNow(-5),
    updatedAt: isoDaysFromNow(-5),
  },
  {
    id: "evt-uuid-004",
    eventId: "EVT-00004",
    title: "Annual Sports Day",
    description:
      "A day of friendly competition among alumni teams. Cricket, football, and indoor games. Family-friendly event!",
    eventType: "Sports",
    date: isoDaysFromNow(-60),
    startTime: "08:00",
    endTime: "18:00",
    location: "ABC University Sports Complex",
    venue: "Main Sports Ground",
    organizer: "Sports Committee",
    registrationDeadline: isoDaysFromNow(-65),
    capacity: 150,
    status: "COMPLETED",
    image:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-ball-46798.jpeg?auto=compress&cs=tinysrgb&w=800",
    createdAt: isoDaysFromNow(-90),
    updatedAt: isoDaysFromNow(-60),
  },
  {
    id: "evt-uuid-005",
    eventId: "EVT-00005",
    title: "Networking Mixer: Finance Professionals",
    description:
      "An exclusive networking event for alumni working in finance, banking, and investment. Connect with industry leaders and explore opportunities.",
    eventType: "Networking",
    date: isoDaysFromNow(20),
    startTime: "19:00",
    endTime: "21:30",
    location: "Pan Pacific Sonargaon",
    venue: "Ballroom A",
    organizer: "Alumni Association - Finance Chapter",
    registrationDeadline: isoDaysFromNow(17),
    capacity: 100,
    status: "UPCOMING",
    image:
      "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
    createdAt: isoDaysFromNow(-3),
    updatedAt: isoDaysFromNow(-3),
  },
];

// ─── Event Registrations ────────────────────────────────────────────────────

export const seedRegistrations: EventRegistration[] = [
  {
    id: "reg-uuid-001",
    registrationId: "REG-000001",
    eventId: "evt-uuid-001",
    alumniId: "000001",
    registrationDate: isoDaysFromNow(-5),
    status: "REGISTERED",
  },
  {
    id: "reg-uuid-002",
    registrationId: "REG-000002",
    eventId: "evt-uuid-001",
    alumniId: "000002",
    registrationDate: isoDaysFromNow(-4),
    status: "REGISTERED",
  },
  {
    id: "reg-uuid-003",
    registrationId: "REG-000003",
    eventId: "evt-uuid-002",
    alumniId: "000001",
    registrationDate: isoDaysFromNow(-3),
    status: "REGISTERED",
  },
  {
    id: "reg-uuid-004",
    registrationId: "REG-000004",
    eventId: "evt-uuid-002",
    alumniId: "000005",
    registrationDate: isoDaysFromNow(-2),
    status: "REGISTERED",
  },
  {
    id: "reg-uuid-005",
    registrationId: "REG-000005",
    eventId: "evt-uuid-005",
    alumniId: "000015",
    registrationDate: isoDaysFromNow(-1),
    status: "REGISTERED",
  },
  {
    id: "reg-uuid-006",
    registrationId: "REG-000006",
    eventId: "evt-uuid-001",
    alumniId: "000003",
    registrationDate: isoDaysFromNow(-6),
    status: "REGISTERED",
  },
];

// ─── Notices ─────────────────────────────────────────────────────────────────

export const seedNotices: Notice[] = [
  {
    id: "ntc-uuid-001",
    title: "Grand Alumni Reunion 2026 Registration Now Open!",
    content:
      "We are excited to announce that registration for the Grand Alumni Reunion 2026 is now open. This year's reunion promises to be bigger and better than ever. Register early to secure your spot!",
    publishDate: isoDaysFromNow(-5),
    category: "Event",
    status: "PUBLISHED",
    author: "Alumni Association",
    createdAt: isoDaysFromNow(-5),
    updatedAt: isoDaysFromNow(-5),
  },
  {
    id: "ntc-uuid-002",
    title: "Alumni Achievement: Dr. Tanvir Rahman Published in Nature",
    content:
      "We are proud to share that our alumnus Dr. Tanvir Rahman (Batch 2016, Computer Science) has been published in the prestigious journal Nature for his groundbreaking research in machine learning.",
    publishDate: isoDaysFromNow(-10),
    category: "Achievement",
    status: "PUBLISHED",
    author: "Office of the Vice Chancellor",
    createdAt: isoDaysFromNow(-10),
    updatedAt: isoDaysFromNow(-10),
  },
  {
    id: "ntc-uuid-003",
    title: "New Scholarship Program for Alumni Children",
    content:
      "The university has launched a new scholarship program exclusively for children of alumni. Applications for the 2026-2027 academic year are now being accepted. Visit the admissions office for details.",
    publishDate: isoDaysFromNow(-15),
    category: "Announcement",
    status: "PUBLISHED",
    author: "Admissions Office",
    createdAt: isoDaysFromNow(-15),
    updatedAt: isoDaysFromNow(-15),
  },
  {
    id: "ntc-uuid-004",
    title: "Career Opportunity: Senior Software Engineer at Google",
    content:
      "Google is hiring senior software engineers for their Singapore office. Interested alumni with 5+ years of experience can apply through the alumni portal. Referral available from Tanvir Rahman (Batch 2016).",
    publishDate: isoDaysFromNow(-3),
    category: "Career",
    status: "PUBLISHED",
    author: "Career Services Office",
    createdAt: isoDaysFromNow(-3),
    updatedAt: isoDaysFromNow(-3),
  },
  {
    id: "ntc-uuid-005",
    title: "University Ranked Top 10 in National Rankings",
    content:
      "ABC University has been ranked among the top 10 universities in the country by the National University Rankings Council. This achievement is a testament to the quality of our faculty, students, and alumni.",
    publishDate: isoDaysFromNow(-20),
    category: "News",
    status: "PUBLISHED",
    author: "Office of the Vice Chancellor",
    createdAt: isoDaysFromNow(-20),
    updatedAt: isoDaysFromNow(-20),
  },
  {
    id: "ntc-uuid-006",
    title: "Mentorship Program: Call for Mentors",
    content:
      "We are looking for experienced alumni to join our mentorship program. If you have 5+ years of professional experience and want to give back to the community, sign up as a mentor today.",
    publishDate: isoDaysFromNow(-7),
    category: "Announcement",
    status: "PUBLISHED",
    author: "Alumni Association",
    createdAt: isoDaysFromNow(-7),
    updatedAt: isoDaysFromNow(-7),
  },
  {
    id: "ntc-uuid-007",
    title: "Annual Fund 2026: Give Back to Your Alma Mater",
    content:
      "The Annual Fund 2026 campaign is now live. Your contributions help fund scholarships, research, and campus improvements. Every contribution, big or small, makes a difference.",
    publishDate: isoDaysFromNow(-1),
    category: "General",
    status: "PUBLISHED",
    author: "Development Office",
    createdAt: isoDaysFromNow(-1),
    updatedAt: isoDaysFromNow(-1),
  },
  {
    id: "ntc-uuid-008",
    title: "Alumni Sports Day Photos Now Available",
    content:
      "Photos from the recent Annual Sports Day are now available on the alumni portal. Relive the memories and download your favorites!",
    publishDate: isoDaysFromNow(-55),
    category: "News",
    status: "PUBLISHED",
    author: "Sports Committee",
    createdAt: isoDaysFromNow(-55),
    updatedAt: isoDaysFromNow(-55),
  },
  {
    id: "ntc-uuid-009",
    title: "Library Access Extended for Alumni",
    content:
      "Great news! The university library is now offering extended borrowing privileges to all registered alumni. Present your alumni id card at the library to activate your account.",
    publishDate: isoDaysFromNow(-30),
    category: "Announcement",
    status: "PUBLISHED",
    author: "Library Services",
    createdAt: isoDaysFromNow(-30),
    updatedAt: isoDaysFromNow(-30),
  },
  {
    id: "ntc-uuid-010",
    title: "Draft: Proposed Alumni Chapter in North America",
    content:
      "We are exploring the creation of an alumni chapter in North America to better serve our alumni in the US and Canada. Share your interest and suggestions.",
    publishDate: isoDaysFromNow(5),
    category: "General",
    status: "DRAFT",
    author: "Alumni Association",
    createdAt: isoDaysFromNow(-2),
    updatedAt: isoDaysFromNow(-2),
  },
];
