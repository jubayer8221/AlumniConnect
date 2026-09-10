export const appConfig = {
  appName: "AlumniConnect",
  institutionName: "ABC University",
  institutionShortName: "ABCU",
  contactEmail: "info@abcuniversity.edu",
  contactPhone: "+880123-4567",
  address: "123 University Boulevard, Education City, EC 45678",
  website: "https://www.abcuniversity.edu",
  defaultPageSize: 10,
  dateFormat: "MMM dd, yyyy",
  timezone: "UTC",
  socialLinks: {
    facebook: "https://facebook.com/abcuniversity",
    twitter: "https://twitter.com/abcuniversity",
    linkedin: "https://linkedin.com/company/abcuniversity",
    instagram: "https://instagram.com/abcuniversity",
  },
} as const;

export type AppConfig = typeof appConfig;
