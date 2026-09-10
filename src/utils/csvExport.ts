import type { Alumni } from "@/types/alumni";

export function exportAlumniToCSV(alumni: Alumni[], filename = "alumni_export.csv"): void {
  const headers = [
    "Alumni ID",
    "First Name",
    "Last Name",
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
    a.firstName,
    a.lastName,
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

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
