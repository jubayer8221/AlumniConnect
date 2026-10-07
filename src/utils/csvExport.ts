import type { AlumniProfileFullModel } from "@/types/alumni";

export function exportAlumniToCSV(
  alumni: AlumniProfileFullModel[],
  filename = "alumni_export.csv",
): void {
  const headers = [
    "Alumni Code",
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
    "City",
    "Country",
    "Status",
    "Verified",
    "Mentor",
  ];

  const rows = alumni.map((a) => {
    const p = a.personalInformation;
    const c = a.contactInformation;
    const e = a.academicInformation[0];
    const j = a.jobExperience[0];
    return [
      a.alumniCode,
      p.fullName,
      c.email ?? "",
      c.phone ?? "",
      p.gender ?? "",
      e?.programName ?? "",
      e?.departmentName ?? "",
      e?.facultyName ?? "",
      e?.batch ?? "",
      e?.admissionYear?.toString() ?? "",
      e?.graduationYear?.toString() ?? "",
      j?.companyname ?? "",
      j?.designation ?? "",
      c.presentDistrict ?? "",
      c.presentCountry ?? "",
      a.status,
      a.isVerified ? "Yes" : "No",
      a.isMentor ? "Yes" : "No",
    ];
  });

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
