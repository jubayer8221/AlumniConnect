import type { Alumni } from "@/types/alumni";

export function exportAlumniToCSV(
  alumni: Alumni[],
  filename = "alumni_export.csv",
): void {
  const headers = [
    "Alumni id",
    "Full Name",
    "Email",
    "Phone",
    "Gender",
    "Program",
    "Department",
    "Faculty",
    "Batch",
    "Admission Year",
    "Graduation Year",
    "Company",
    "Designation",
    "Industry",
    "City",
    "Country",
    "Status",
    "Verified",
    "Mentor",
  ];

  const rows = alumni.map((a) => [
    a.alumniId,
    a.fullName,
    a.email,
    a.phone,
    a.gender || "",
    a.programName || "",
    a.departmentName || "",
    a.facultyName || "",
    a.batch || "",
    a.admissionYear?.toString() || "",
    a.graduationYear?.toString() || "",
    a.companyName || "",
    a.designation || "",
    a.industry || "",
    a.city || "",
    a.country || "",
    a.status,
    a.isVerified ? "Yes" : "No",
    a.isMentor ? "Yes" : "No",
  ]);

  const encodeCell = (cell: unknown) => {
    const value = cell == null ? "" : String(cell);
    const safeValue = /^[\u0000-\u0020]*[=+\-@]/.test(value)
      ? `'${value}`
      : value;
    return `"${safeValue.replace(/"/g, '""')}"`;
  };
  const csvContent =
    "\uFEFF" +
    [headers, ...rows].map((row) => row.map(encodeCell).join(",")).join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
