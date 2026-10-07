import type { AlumniProfileFullModel } from "@/types/alumni";

type CompletionField =
  | "fullName"
  | "profilePhoto"
  | "email"
  | "phone"
  | "programName"
  | "departmentName"
  | "graduationYear"
  | "companyName"
  | "designation"
  | "bio";

const FIELD_LABELS: Record<CompletionField, string> = {
  fullName: "Full Name",
  profilePhoto: "Profile Photo",
  email: "Email",
  phone: "Phone",
  programName: "Program",
  departmentName: "Department",
  graduationYear: "Graduation Year",
  companyName: "Company",
  designation: "Designation",
  bio: "Biography",
};

function readField(
  alumni: AlumniProfileFullModel,
  field: CompletionField,
): unknown {
  const p = alumni.personalInformation;
  const c = alumni.contactInformation;
  const e = alumni.academicInformation[0];
  const j = alumni.jobExperience[0];

  switch (field) {
    case "fullName":
      return p.fullName;
    case "profilePhoto":
      return p.profilePhoto;
    case "bio":
      return p.bio;
    case "email":
      return c.email;
    case "phone":
      return c.phone;
    case "programName":
      return e?.programName;
    case "departmentName":
      return e?.departmentName;
    case "graduationYear":
      return e?.graduationYear;
    case "companyName":
      return j?.companyname;
    case "designation":
      return j?.designation;
  }
}

export function calculateProfileCompletion(
  alumni: AlumniProfileFullModel,
): number {
  const fields = Object.keys(FIELD_LABELS) as CompletionField[];
  let completed = 0;
  for (const field of fields) {
    const value = readField(alumni, field);
    if (value !== undefined && value !== null && value !== "") completed++;
  }
  return Math.round((completed / fields.length) * 100);
}

export function getMissingProfileFields(
  alumni: AlumniProfileFullModel,
): string[] {
  const missing: string[] = [];
  for (const field of Object.keys(FIELD_LABELS) as CompletionField[]) {
    const value = readField(alumni, field);
    if (value === undefined || value === null || value === "") {
      missing.push(FIELD_LABELS[field]);
    }
  }
  return missing;
}
