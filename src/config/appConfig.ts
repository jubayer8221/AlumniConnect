export const appConfig = {
  appName: "Alumni Network",
  institutionName: "Sherpur Government Victoria Academy",
  institutionShortName: "Victoria Academy",
  contactEmail: "sherpurvictoria@gmail.com",
  contactPhone: "+8801857-181895",
  address: "Sherpur Sadar Upazila, Sherpur District, Bangladesh",
  website: "https://sgva.school.gov.bd/",
  defaultPageSize: 10,
  dateFormat: "MMM dd, yyyy",
  timezone: "UTC",
  socialLinks: {
    facebook: "https://facebook.com/sherpurzillaschool",
    twitter: "https://twitter.com/abcuniversity",
    linkedin: "https://bd.linkedin.com/company/sherpurgovtvictoriaacademy",
    instagram: "https://instagram.com/abcuniversity",
  },
} as const;

export type AppConfig = typeof appConfig;
