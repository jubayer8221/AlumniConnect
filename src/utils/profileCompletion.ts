import type { Alumni } from "@/types/alumni";

const REQUIRED_PROFILE_FIELDS: (keyof Alumni)[] = [
  "firstName",
  "lastName",
  "profilePhoto",
  "email",
  "phone",
  "programName",
  "departmentName",
  "graduationYear",
  "companyName",
  "designation",
  "bio",
];

const FIELD_LABELS: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
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

export function calculateProfileCompletion(alumni: Alumni): number {
  let completed = 0;
  for (const field of REQUIRED_PROFILE_FIELDS) {
    const value = alumni[field];
    if (value !== undefined && value !== null && value !== "") {
      completed++;
    }
  }
  return Math.round((completed / REQUIRED_PROFILE_FIELDS.length) * 100);
}

export function getMissingProfileFields(alumni: Alumni): string[] {
  const missing: string[] = [];
  for (const field of REQUIRED_PROFILE_FIELDS) {
    const value = alumni[field];
    if (value === undefined || value === null || value === "") {
      missing.push(FIELD_LABELS[field] || field);
    }
  }
  return missing;
}
