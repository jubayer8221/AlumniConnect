import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
} from "@mui/material";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Linkedin,
  Facebook,
  Globe,
  Award,
  Github,
  Instagram,
  Shield,
  Printer,
  IdCard,
  MoreVertical,
  Twitter,
  X,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { hasAdminAccess } from "@/utils/authUtils";
import { useAlumni } from "@/hooks/useAlumni";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonEmptyState,
  CommonAvatar,
  CommonButton,
  CommonConfirmDialog,
} from "@/components/common";
import AlumniProfileSkeleton from "@/components/alumniProfile/AlumniProfileSkeleton";
import {
  calculateProfileCompletion,
  getMissingProfileFields,
} from "@/utils/profileCompletion";
import { formatDate } from "@/utils/dateUtils";
import { getApiErrorMessage } from "@/utils/apiError";
import { appConfig } from "@/config/appConfig";
import AlumniProfileCard from "@/components/alumniProfile/AlumniProfileCard";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import ConnectButton from "@/components/network/ConnectButton";

const formatAddress = (...parts: (string | undefined | null)[]) => {
  const joined = parts.filter(Boolean).join(", ");
  return joined || undefined;
};

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "text.secondary",
        flexShrink: 0,
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "right" }}>
      {value || "—"}
    </Typography>
  </Box>
);

const InfoGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      columnGap: 4,
    }}
  >
    {children}
  </Box>
);

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card
    sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

export default function AlumniDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authUser: user, role } = useAuth();
  const { selectedAlumni, loading, fetchAlumniById, setAlumniActive } =
    useAlumni();

  const profileId = id ?? user?.alumniId;
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [statusDialog, setStatusDialog] = useState<
    "ACTIVE" | "INACTIVE" | null
  >(null);
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  useEffect(() => {
    if (!profileId) return;

    const isStale =
      !selectedAlumni || String(selectedAlumni.alumniID) !== String(profileId);

    if (isStale) {
      fetchAlumniById(profileId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) return;
    if (selectedAlumni)
      setBreadcrumbLabel(
        location.pathname,
        selectedAlumni.personalInformation.fullName,
      );
    return () => clearBreadcrumbLabel(location.pathname);
  }, []);

  if (loading && !selectedAlumni) return <AlumniProfileSkeleton />;
  if (!selectedAlumni)
    return (
      <CommonEmptyState
        title="Alumni not found"
        message={
          !id && !user?.alumniId
            ? "Your login did not provide an alumni ID, so your profile cannot be loaded."
            : "The alumni record you're looking for doesn't exist."
        }
      />
    );

  const alumni = selectedAlumni;
  const p = alumni.personalInformation;
  const c = alumni.contactInformation;
  const firstEdu = alumni.academicInformation[0];

  const completion = calculateProfileCompletion(alumni);
  const missing = getMissingProfileFields(alumni);
  const isAdmin = hasAdminAccess(role);
  const isOwner = Boolean(
    user &&
    (user.id === String(alumni.userID) ||
      user.alumniId === String(alumni.alumniID)),
  );
  const canSeePrivate = isAdmin || isOwner;
  const profileIsPublic = alumni.isProfilePublic;

  /* ---------- Connect visibility ----------
     Show whenever it's not your own profile and there's a valid userID.
     The ConnectButton resolves the real state (Connect / Pending / Message).
  -------------------------------------------- */
  const showConnect = !isOwner && alumni.userID > 0;

  const canSeePersonal =
    canSeePrivate ||
    (profileIsPublic && alumni.privacy.isPersonalInformationVisible);
  const canSeeAcademic =
    canSeePrivate ||
    (profileIsPublic && alumni.privacy.isAcademicInformationVisible);
  const canSeeContact =
    canSeePrivate ||
    (profileIsPublic && alumni.privacy.isContactInformationVisible);
  const canSeeJobs =
    canSeePrivate || (profileIsPublic && alumni.privacy.isJobExperienceVisible);
  const canSeeFamily =
    canSeePrivate ||
    (profileIsPublic && alumni.privacy.isFamilyInformationVisible);
  const canSeeSocial =
    canSeePrivate || (profileIsPublic && alumni.privacy.isSocialMediaVisible);
  const canSeeBiography =
    canSeePrivate || (profileIsPublic && alumni.privacy.isBiographyVisible);

  const presentAddress = canSeePrivate
    ? formatAddress(
        c.fullpresentAddress,
        c.presentVillageArea,
        c.presentUnion,
        c.presentThana,
        c.presentDistrict,
        c.presentDivision,
        c.presentCountry,
      )
    : "Hidden";

  const permanentAddress = canSeePrivate
    ? formatAddress(
        c.fullPermanentAddress,
        c.permanentVillageArea,
        c.permanentUnion,
        c.permanentThana,
        c.permanentDistrict,
        c.permanentDivision,
        c.permanentCountry,
      )
    : "Hidden";

  const handleSetActive = async () => {
    if (!statusDialog) return;
    try {
      await setAlumniActive(alumni.alumniID, statusDialog === "ACTIVE");
      dispatch(
        showToast({
          message:
            statusDialog === "ACTIVE"
              ? "Alumni activated"
              : "Alumni deactivated",
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to update status"),
          severity: "error",
        }),
      );
    } finally {
      setStatusDialog(null);
    }
  };

  const printProfile = () => window.print();

  const handleImageClick = (imageUrl?: string | null) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
  };

  const socialLinks = [
    {
      href: alumni.socialInformation.linkedInLink,
      label: "LinkedIn",
      icon: <Linkedin size={18} />,
    },
    {
      href: alumni.socialInformation.facebookLink,
      label: "Facebook",
      icon: <Facebook size={18} />,
    },
    {
      href: alumni.socialInformation.instagramLink,
      label: "Instagram",
      icon: <Instagram size={18} />,
    },
    {
      href: alumni.socialInformation.twitterLink,
      label: "Twitter",
      icon: <Twitter size={18} />,
    },
    {
      href: alumni.socialInformation.gitHubLink,
      label: "GitHub / Website",
      icon: <Github size={18} />,
    },
  ].filter((item): item is typeof item & { href: string } =>
    Boolean(item.href),
  );

  return (
    <Box>
      <CommonPageHeader
        title="Alumni Profile"
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Alumni", path: "/alumni/network/directory" },
          { label: p.fullName },
        ]}
        actions={
          <>
            {showConnect && <ConnectButton otherUserID={alumni.userID} />}

            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertical size={20} />
            </IconButton>
            {(isAdmin || isOwner) && (
              <CommonButton
                variant="outlined"
                startIcon={<Pencil size={18} />}
                onClick={() =>
                  navigate(
                    isOwner && !isAdmin
                      ? "/alumni/profile-details/edit"
                      : `/alumni/profile-details/${alumni.alumniID}/edit`,
                  )
                }
              >
                Edit Profile
              </CommonButton>
            )}
            <CommonButton
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Back
            </CommonButton>

            <Menu
              anchorEl={menuAnchor}
              open={!!menuAnchor}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  printProfile();
                  setMenuAnchor(null);
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Printer size={16} /> Print Profile
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIdCardOpen(true);
                  setMenuAnchor(null);
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IdCard size={16} /> View ID Card
                </Box>
              </MenuItem>
              {isAdmin && alumni.status === "ACTIVE" && (
                <MenuItem onClick={() => setStatusDialog("INACTIVE")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Shield size={16} /> Deactivate
                  </Box>
                </MenuItem>
              )}
              {isAdmin && alumni.status !== "ACTIVE" && (
                <MenuItem onClick={() => setStatusDialog("ACTIVE")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Shield size={16} /> Activate
                  </Box>
                </MenuItem>
              )}
            </Menu>
          </>
        }
      />

      <Box
        onClick={() => handleImageClick(p.profilePhoto)}
        sx={{
          cursor: p.profilePhoto ? "pointer" : "default",
          "& img": {
            transition: "transform 0.2s ease-in-out",
          },
          "&:hover img": p.profilePhoto
            ? {
                transform: "scale(1.03)",
              }
            : {},
        }}
      >
        <AlumniProfileCard
          alumni={alumni}
          completion={completion}
          missing={missing}
          isOwner={isOwner}
          isAdmin={isAdmin}
        />
      </Box>

      <Grid container spacing={0}>
        {canSeePersonal && (
          <Grid size={{ xs: 12 }}>
            <Section
              title="Personal Information"
              icon={<GraduationCap size={20} />}
            >
              <InfoGrid>
                <InfoRow label="Full Name" value={p.fullName} />
                <InfoRow
                  label="Native Name"
                  value={p.nativeName ?? undefined}
                />
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(p.dateOfBirth ?? undefined)}
                  icon={<Calendar size={16} />}
                />
                <InfoRow label="Gender" value={p.gender ?? undefined} />
                <InfoRow
                  label="Blood Group"
                  value={p.bloodGroup ?? undefined}
                />
                <InfoRow
                  label="Marital Status"
                  value={p.maritalStatusID ?? undefined}
                />
                <InfoRow label="Hobby" value={p.hobby ?? undefined} />
                <InfoRow
                  label="T-Shirt Size"
                  value={p.tShirtSize ?? undefined}
                />
              </InfoGrid>
            </Section>
          </Grid>
        )}

        {canSeeAcademic && (
          <Grid size={{ xs: 12 }}>
            <Section
              title="Academic Information"
              icon={<GraduationCap size={20} />}
            >
              {alumni.academicInformation.length ? (
                [...alumni.academicInformation]
                  .filter((edu) => isOwner || isAdmin || edu.isVisible)
                  .sort(
                    (l, r) => (r.graduationYear ?? 0) - (l.graduationYear ?? 0),
                  )
                  .map((edu) => (
                    <Box
                      key={edu.alumniEducationID}
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        {edu.programName ?? "Education"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {[edu.departmentName, edu.facultyName]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {edu.secondarySchoolName ?? "Institution not provided"}
                        {edu.graduationYear
                          ? ` · Graduated ${edu.graduationYear}`
                          : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[edu.studentID, edu.registrationNumber, edu.batch]
                          .filter(Boolean)
                          .join(" · ")}
                      </Typography>
                    </Box>
                  ))
              ) : (
                <InfoGrid>
                  <InfoRow
                    label="Student ID"
                    value={firstEdu?.studentID ?? undefined}
                  />
                  <InfoRow
                    label="Registration Number"
                    value={firstEdu?.registrationNumber ?? undefined}
                  />
                  <InfoRow
                    label="Program"
                    value={firstEdu?.programName ?? undefined}
                  />
                  <InfoRow
                    label="Department"
                    value={firstEdu?.departmentName ?? undefined}
                  />
                  <InfoRow
                    label="Faculty"
                    value={firstEdu?.facultyName ?? undefined}
                  />
                  <InfoRow
                    label="Admission Year"
                    value={firstEdu?.admissionYear?.toString()}
                  />
                  <InfoRow
                    label="Graduation Year"
                    value={firstEdu?.graduationYear?.toString()}
                  />
                  <InfoRow
                    label="Graduation Semester"
                    value={firstEdu?.graduationSemester ?? undefined}
                  />
                  <InfoRow label="Batch" value={firstEdu?.batch ?? undefined} />
                  <InfoRow
                    label="Roll Number"
                    value={firstEdu?.rollNumber ?? undefined}
                  />
                </InfoGrid>
              )}
            </Section>
          </Grid>
        )}

        {canSeeContact && (
          <Grid size={{ xs: 12 }}>
            <Section title="Contact & Address" icon={<Mail size={20} />}>
              <InfoGrid>
                <InfoRow
                  label="Email"
                  value={c.email ?? undefined}
                  icon={<Mail size={16} />}
                />
                <InfoRow
                  label="Phone"
                  value={c.phone ?? undefined}
                  icon={<Phone size={16} />}
                />
                {c.alternatePhone && (
                  <InfoRow
                    label="Alternate Phone"
                    value={c.alternatePhone}
                    icon={<Phone size={16} />}
                  />
                )}
                <InfoRow
                  label="Current Location"
                  value={
                    c.presentDistrict
                      ? `${c.presentDistrict}${c.presentCountry ? `, ${c.presentCountry}` : ""}`
                      : undefined
                  }
                  icon={<MapPin size={16} />}
                />
              </InfoGrid>

              <Divider sx={{ my: 2 }} />

              <InfoGrid>
                <InfoRow
                  label="Present Address"
                  value={presentAddress}
                  icon={<MapPin size={16} />}
                />
                <InfoRow
                  label="Permanent Address"
                  value={permanentAddress}
                  icon={<MapPin size={16} />}
                />
              </InfoGrid>
            </Section>
          </Grid>
        )}

        {canSeeJobs && (
          <Grid size={{ xs: 12 }}>
            <Section
              title="Professional Information"
              icon={<Briefcase size={20} />}
            >
              {alumni.jobExperience.length ? (
                [...alumni.jobExperience]
                  .filter((job) => isOwner || isAdmin || job.isVisible)
                  .sort((l, r) => Number(r.isCurrent) - Number(l.isCurrent))
                  .map((job) => (
                    <Box
                      key={job.jobExperienceID}
                      sx={{
                        position: "relative",
                        pl: 3,
                        py: 1.5,
                        borderLeft: "2px solid",
                        borderColor: "primary.light",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          left: -6,
                          top: 22,
                        },
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        {job.designation ?? "Position"}
                        {job.isCurrent ? " · Current" : ""}
                      </Typography>
                      <Typography variant="body2">
                        {job.companyname ?? "Company not provided"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {[job.location, job.city, job.country]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[job.startDate, job.endDate]
                          .filter((d): d is string => Boolean(d))
                          .map((d) => formatDate(d))
                          .join(" – ") || "Dates not provided"}
                      </Typography>
                      {job.description && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {job.description}
                        </Typography>
                      )}
                    </Box>
                  ))
              ) : (
                <Typography color="text.secondary">
                  No job experience recorded.
                </Typography>
              )}
            </Section>
          </Grid>
        )}

        {canSeeFamily && alumni.familyInformation.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Section title="Family Members" icon={<Award size={20} />}>
              <Grid container spacing={2}>
                {alumni.familyInformation
                  .filter((member) => isOwner || isAdmin || member.isVisible)
                  .map((member) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={member.familyMemberID}
                    >
                      <Card variant="outlined">
                        <CardContent>
                          <Typography sx={{ fontWeight: 700 }}>
                            {member.familyMemberName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.relation}
                          </Typography>
                          {member.occupation && (
                            <Typography variant="body2">
                              {member.occupation}
                            </Typography>
                          )}
                          {member.phone && (
                            <Typography variant="body2">
                              {member.phone}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Section>
          </Grid>
        )}

        {canSeeSocial && (
          <Grid size={{ xs: 12 }}>
            <Section title="Social Links" icon={<Globe size={20} />}>
              {socialLinks.length > 0 ? (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {socialLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      underline="none"
                      aria-label={item.label}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.25,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  No social links provided
                </Typography>
              )}
            </Section>
          </Grid>
        )}

        {canSeeBiography && (
          <Grid size={{ xs: 12 }}>
            <Section title="Biography" icon={<Award size={20} />}>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
              >
                {p.bio || "No biography added yet."}
              </Typography>
            </Section>
          </Grid>
        )}
      </Grid>

      {/* ID Card Dialog */}
      <Dialog
        open={idCardOpen}
        onClose={() => setIdCardOpen(false)}
        maxWidth="xs"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>Alumni ID Card</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: 2,
              borderColor: "primary.main",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              background:
                "linear-gradient(135deg, var(--color-light-surface-blue) 0%, var(--color-surface) 100%)",
            }}
          >
            <Typography
              variant="h6"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              {appConfig.institutionName}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="caption"
              sx={{ letterSpacing: 2, color: "text.secondary" }}
            >
              ALUMNI ID CARD
            </Typography>
            <Box
              onClick={() => handleImageClick(p.profilePhoto)}
              sx={{
                my: 2,
                display: "flex",
                justifyContent: "center",
                cursor: p.profilePhoto ? "pointer" : "default",
                "& img": {
                  transition: "transform 0.2s ease-in-out",
                },
                "&:hover img": p.profilePhoto
                  ? {
                      transform: "scale(1.05)",
                    }
                  : {},
              }}
            >
              <CommonAvatar
                src={p.profilePhoto ?? undefined}
                name={p.fullName}
                size={100}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {p.fullName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {firstEdu?.departmentName ?? "—"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Batch: {firstEdu?.batch ?? firstEdu?.graduationYear ?? "—"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Chip
              label={
                alumni.isVerified ? "Valid Alumni" : "Pending Verification"
              }
              color={alumni.isVerified ? "success" : "warning"}
              size="small"
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={() => window.print()}
            sx={{ mt: 2 }}
            startIcon={<Printer size={18} />}
          >
            Print ID Card
          </Button>
        </DialogContent>
      </Dialog>

      {/* Image Preview Lightbox Modal */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "white",
              backgroundImage: "none",
              boxShadow: 24,
              borderRadius: 3,
              overflow: "visible",
              m: 2,
              position: "relative",
            },
          },
        }}
      >
        <IconButton
          onClick={() => setPreviewImage(null)}
          aria-label="Close image preview"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "var(--color-surface)",
            backgroundColor: "rgba(var(--rgb-black), 0.6)",
            border: "1px solid rgba(var(--rgb-white), 0.3)",
            "&:hover": {
              backgroundColor: "rgba(var(--rgb-white), 0.3)",
              color: "red",
            },
            zIndex: 10,
          }}
        >
          <X size={20} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            pt: 6,
          }}
        >
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt={p.fullName || "User Profile Picture"}
              sx={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
        </Box>
      </Dialog>

      <CommonConfirmDialog
        open={!!statusDialog}
        title="Change Status"
        message={`Are you sure you want to ${statusDialog === "ACTIVE" ? "activate" : "deactivate"} this alumni?`}
        confirmLabel={statusDialog === "ACTIVE" ? "Activate" : "Deactivate"}
        onConfirm={handleSetActive}
        onCancel={() => setStatusDialog(null)}
        color={statusDialog === "ACTIVE" ? "primary" : "warning"}
      />
    </Box>
  );
}
