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
  LinearProgress,
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
  BadgeCheck,
  Shield,
  Printer,
  IdCard,
  MoreVertical,
  Lock,
  Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniByIdAsync,
  verifyAlumniAsync,
  updateAlumniStatusAsync,
} from "@/Slice/alumniSlice";
import { showToast } from "@/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonLoading,
  CommonEmptyState,
  CommonStatusBadge,
  CommonAvatar,
  CommonButton,
  CommonConfirmDialog,
} from "@/components/common";
import {
  calculateProfileCompletion,
  getMissingProfileFields,
} from "@/utils/profileCompletion";
import { formatDate } from "@/utils/dateUtils";
import { appConfig } from "@/config/appConfig";
import type { Alumni } from "@/types/alumni";

// Joins whichever address fragments exist into one readable line instead of
// listing village/union/thana/district/division/country as separate rows.
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

// Two-column layout for label/value rows so shorter sections (Personal,
// Academic, Professional) read at roughly the same height instead of one
// tall single column.
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

// Small icon + text pill used in the profile header's meta line.
const MetaItem = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {children}
    </Typography>
  </Box>
);

export default function AlumniDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);
  const { role, user } = useAppSelector((s) => s.auth);
  const profileId = id || user?.alumniId;
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState<Alumni["status"] | null>(
    null,
  );

  useEffect(() => {
    if (profileId) dispatch(fetchAlumniByIdAsync(profileId));
  }, [dispatch, profileId]);

  if (loading && !selectedAlumni) return <CommonLoading />;
  if (!selectedAlumni)
    return (
      <CommonEmptyState
        title="Alumni not found"
        message="The alumni record you're looking for doesn't exist."
      />
    );

  const alumni = selectedAlumni;
  const completion = calculateProfileCompletion(alumni);
  const missing = getMissingProfileFields(alumni);
  const isAdmin = role === "ADMIN";
  const isOwner = user?.alumniId === alumni.alumniId;
  const canSeePrivate = isAdmin || isOwner;
  const canSeeAddress = canSeePrivate || alumni.privacy?.showAddress;

  const presentAddress = canSeeAddress
    ? formatAddress(
        alumni.presentAddress,
        alumni.presentVillageArea,
        alumni.presentUnion,
        alumni.presentThana,
        alumni.presentDistrict,
        alumni.presentDivision,
        alumni.presentCountry,
      )
    : "Hidden";

  const permanentAddress = canSeeAddress
    ? formatAddress(
        alumni.permanentAddress,
        alumni.permanentVillageArea,
        alumni.permanentUnion,
        alumni.permanentThana,
        alumni.permanentDistrict,
        alumni.permanentDivision,
        alumni.permanentCountry,
      )
    : "Hidden";

  const handleVerify = async () => {
    const res = await dispatch(verifyAlumniAsync(alumni.id));
    if (res.meta.requestStatus === "fulfilled")
      dispatch(showToast({ message: "Alumni verified", severity: "success" }));
    setMenuAnchor(null);
  };

  const handleStatusChange = async () => {
    if (!statusDialog) return;
    const res = await dispatch(
      updateAlumniStatusAsync({ id: alumni.id, status: statusDialog }),
    );
    if (res.meta.requestStatus === "fulfilled")
      dispatch(showToast({ message: "Status updated", severity: "success" }));
    setStatusDialog(null);
  };

  const printProfile = () => window.print();

  return (
    <Box>
      <CommonPageHeader
        title="Alumni Profile"
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Alumni", path: "/alumni" },
          { label: alumni.fullName },
        ]}
        actions={
          <>
            <CommonButton
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Back
            </CommonButton>
            {(isAdmin || isOwner) && (
              <CommonButton
                variant="outlined"
                startIcon={<Pencil size={18} />}
                onClick={() => navigate(`/alumni/${alumni.id}/edit`)}
              >
                Edit Profile
              </CommonButton>
            )}
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertical size={20} />
            </IconButton>
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
              {isAdmin && !alumni.isVerified && (
                <MenuItem onClick={handleVerify}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BadgeCheck size={16} /> Verify Alumni
                  </Box>
                </MenuItem>
              )}
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

      {/* Profile Header */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 120,
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          }}
        />
        <CardContent sx={{ p: 3, pt: 0, mt: -6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { sm: "flex-end" },
            }}
          >
            <CommonAvatar
              src={alumni.profilePhoto}
              name={alumni.fullName}
              size={120}
              sx={{
                border: "4px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {alumni.fullName}
                </Typography>
                {alumni.isVerified && (
                  <Chip
                    icon={<BadgeCheck size={14} />}
                    label="Verified"
                    size="small"
                    color="success"
                  />
                )}
                <CommonStatusBadge status={alumni.status} />
              </Box>
              {alumni.designation && (
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mt: 0.25 }}
                >
                  {alumni.designation}
                  {alumni.companyName ? ` at ${alumni.companyName}` : ""}
                </Typography>
              )}
              <Box
                sx={{ display: "flex", gap: 2.5, mt: 1.25, flexWrap: "wrap" }}
              >
                <MetaItem icon={<IdCard size={14} />}>
                  {alumni.alumniId}
                </MetaItem>
                {alumni.departmentName && (
                  <MetaItem icon={<GraduationCap size={14} />}>
                    {alumni.departmentName}
                  </MetaItem>
                )}
                {alumni.batch && (
                  <MetaItem icon={<Award size={14} />}>
                    Batch {alumni.batch}
                  </MetaItem>
                )}
                {alumni.graduationYear && (
                  <MetaItem icon={<Calendar size={14} />}>
                    Graduated {alumni.graduationYear}
                  </MetaItem>
                )}
                {alumni.city && (
                  <MetaItem icon={<MapPin size={14} />}>
                    {alumni.city}
                    {alumni.country ? `, ${alumni.country}` : ""}
                  </MetaItem>
                )}
              </Box>
            </Box>
          </Box>

          {/* Profile Completion */}
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Profile Completion
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {completion}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{ height: 8, borderRadius: 4 }}
            />
            {missing.length > 0 && (isOwner || isAdmin) && (
              <Typography
                variant="caption"
                sx={{ mt: 0.5, display: "block", color: "text.secondary" }}
              >
                Missing: {missing.join(", ")}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={0}>
        <Grid size={{ xs: 12 }}>
          <Section
            title="Personal Information"
            icon={<GraduationCap size={20} />}
          >
            <InfoGrid>
              <InfoRow label="Full Name" value={alumni.fullName} />
              <InfoRow
                label="Date of Birth"
                value={formatDate(alumni.dateOfBirth)}
                icon={<Calendar size={16} />}
              />
              <InfoRow label="Gender" value={alumni.gender} />
              <InfoRow label="Blood Group" value={alumni.bloodGroup} />
              <InfoRow label="Marital Status" value={alumni.maritalStatus} />
            </InfoGrid>
          </Section>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Section
            title="Academic Information"
            icon={<GraduationCap size={20} />}
          >
            <InfoGrid>
              <InfoRow label="Student ID" value={alumni.studentId} />
              <InfoRow
                label="Registration Number"
                value={alumni.registrationNumber}
              />
              <InfoRow label="Program" value={alumni.programName} />
              <InfoRow label="Department" value={alumni.departmentName} />
              <InfoRow label="Faculty" value={alumni.facultyName} />
              <InfoRow
                label="Admission Year"
                value={alumni.admissionYear?.toString()}
              />
              <InfoRow
                label="Graduation Year"
                value={alumni.graduationYear?.toString()}
              />
              <InfoRow
                label="Graduation Semester"
                value={alumni.graduationSemester}
              />
              <InfoRow label="Batch" value={alumni.batch} />
              <InfoRow label="Roll Number" value={alumni.rollNumber} />
            </InfoGrid>
          </Section>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Section title="Contact & Address" icon={<Mail size={20} />}>
            <InfoGrid>
              <InfoRow
                label="Email"
                value={
                  canSeePrivate || alumni.privacy?.showEmail
                    ? alumni.email
                    : "Hidden"
                }
                icon={<Mail size={16} />}
              />
              <InfoRow
                label="Phone"
                value={
                  canSeePrivate || alumni.privacy?.showPhone
                    ? alumni.phone
                    : "Hidden"
                }
                icon={<Phone size={16} />}
              />
              {alumni.alternatePhone && (
                <InfoRow
                  label="Alternate Phone"
                  value={canSeePrivate ? alumni.alternatePhone : "Hidden"}
                  icon={<Phone size={16} />}
                />
              )}
              <InfoRow
                label="Current Location"
                value={
                  alumni.city
                    ? `${alumni.city}${alumni.country ? `, ${alumni.country}` : ""}`
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

        <Grid size={{ xs: 12 }}>
          <Section
            title="Professional Information"
            icon={<Briefcase size={20} />}
          >
            <InfoGrid>
              <InfoRow
                label="Current Occupation"
                value={alumni.currentOccupation}
              />
              <InfoRow label="Designation" value={alumni.designation} />
              <InfoRow
                label="Company"
                value={
                  canSeePrivate || alumni.privacy?.showCompany
                    ? alumni.companyName
                    : "Hidden"
                }
                icon={<Building2 size={16} />}
              />
              <InfoRow label="Industry" value={alumni.industry} />
              <InfoRow label="Work Location" value={alumni.workLocation} />
            </InfoGrid>
            {alumni.skills && alumni.skills.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Skills
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {alumni.skills.map((s) => (
                    <Chip key={s} label={s} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Section>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Section title="Social Links" icon={<Globe size={20} />}>
            {canSeePrivate || alumni.privacy?.showSocialLinks ? (
              <>
                {alumni.linkedinUrl && (
                  <Box
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Link
                      href={alumni.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Linkedin size={16} /> LinkedIn Profile
                    </Link>
                  </Box>
                )}
                {alumni.facebookUrl && (
                  <Box
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Link
                      href={alumni.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Facebook size={16} /> Facebook Profile
                    </Link>
                  </Box>
                )}
                {alumni.websiteUrl && (
                  <Box sx={{ py: 1.5 }}>
                    <Link
                      href={alumni.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Globe size={16} /> Personal Website
                    </Link>
                  </Box>
                )}
                {!alumni.linkedinUrl &&
                  !alumni.facebookUrl &&
                  !alumni.websiteUrl && (
                    <Typography sx={{ color: "text.secondary" }}>
                      No social links provided
                    </Typography>
                  )}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  color: "text.secondary",
                }}
              >
                <Lock size={14} />
                <Typography sx={{ color: "text.secondary" }}>
                  Social links are private
                </Typography>
              </Box>
            )}
          </Section>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Section title="Biography" icon={<Award size={20} />}>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
            >
              {alumni.bio || "No biography added yet."}
            </Typography>
          </Section>
        </Grid>
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
              background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
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
            <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
              <CommonAvatar
                src={alumni.profilePhoto}
                name={alumni.fullName}
                size={100}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {alumni.fullName}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {alumni.alumniId}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {alumni.departmentName || "—"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Batch: {alumni.batch || alumni.graduationYear || "—"}
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

      {/* Status Change Confirm */}
      <CommonConfirmDialog
        open={!!statusDialog}
        title="Change Status"
        message={`Are you sure you want to ${statusDialog === "ACTIVE" ? "activate" : "deactivate"} this alumni?`}
        confirmLabel={statusDialog === "ACTIVE" ? "Activate" : "Deactivate"}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusDialog(null)}
        color={statusDialog === "ACTIVE" ? "primary" : "warning"}
      />
    </Box>
  );
}
