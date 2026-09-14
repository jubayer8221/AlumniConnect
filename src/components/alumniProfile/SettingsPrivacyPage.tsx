import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Shield,
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Globe,
  Users,
  FileText,
  Save,
  Lock,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniByIdAsync,
  updateAlumniPrivacyAsync,
} from "@/Slice/alumniSlice";
import { showToast } from "@/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonLoading,
  CommonEmptyState,
  CommonInputField,
  CommonSelectField,
  CommonCheckbox,
} from "@/components/common";
import type {
  SectionPrivacy,
  PrivacyLevel,
  AlumniPrivacy,
} from "@/types/alumni";

const defaultSectionPrivacy: SectionPrivacy = {
  personalInfo: "ALUMNI_ONLY",
  contactInfo: "ALUMNI_ONLY",
  academicInfo: "PUBLIC",
  jobExperience: "PUBLIC",
  socialInfo: "PUBLIC",
  familyInfo: "PRIVATE",
  biography: "PUBLIC",
};

const defaultLegacyPrivacy: AlumniPrivacy = {
  profileVisibility: "PUBLIC",
  showEmail: true,
  showPhone: false,
  showAddress: false,
  showCompany: true,
  showSocialLinks: true,
};

const privacyLabels: Record<PrivacyLevel, string> = {
  PUBLIC: "Everyone",
  ALUMNI_ONLY: "Alumni Only",
  PRIVATE: "Only Me",
};

// Consistent color coding so a person can scan visibility at a glance.
const privacyColors: Record<PrivacyLevel, string> = {
  PUBLIC: "#10b981",
  ALUMNI_ONLY: "#0ea5e9",
  PRIVATE: "#94a3b8",
};

const sections: {
  key: keyof SectionPrivacy;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "personalInfo",
    label: "Personal Information",
    description: "Date of birth, gender, and other identity details.",
    icon: <User size={18} />,
  },
  {
    key: "contactInfo",
    label: "Contact Information",
    description: "Email, phone number, and physical address.",
    icon: <Phone size={18} />,
  },
  {
    key: "academicInfo",
    label: "Academic Information",
    description: "Degrees, graduation years, majors, and institutions.",
    icon: <GraduationCap size={18} />,
  },
  {
    key: "jobExperience",
    label: "Job Experience",
    description: "Current workplace, titles, and professional history.",
    icon: <Briefcase size={18} />,
  },
  {
    key: "socialInfo",
    label: "Social Information",
    description: "LinkedIn, GitHub, Twitter, and portfolio links.",
    icon: <Globe size={18} />,
  },
  {
    key: "familyInfo",
    label: "Family Information",
    description: "Spouse, children, or emergency relations data.",
    icon: <Users size={18} />,
  },
  {
    key: "biography",
    label: "Biography & Summary",
    description: "Your professional bio and personal statement.",
    icon: <FileText size={18} />,
  },
];

const toggles: {
  key: keyof AlumniPrivacy;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "showEmail",
    label: "Display primary email address",
    icon: <Phone size={16} />,
  },
  {
    key: "showPhone",
    label: "Display phone number",
    icon: <Phone size={16} />,
  },
  {
    key: "showAddress",
    label: "Display residential address",
    icon: <Globe size={16} />,
  },
  {
    key: "showCompany",
    label: "Display current company / employer",
    icon: <Briefcase size={16} />,
  },
  {
    key: "showSocialLinks",
    label: "Display social media handles",
    icon: <Globe size={16} />,
  },
];

export default function SettingsPrivacyPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);

  const [sectionPrivacy, setSectionPrivacy] = useState<SectionPrivacy>(
    defaultSectionPrivacy,
  );
  const [legacyPrivacy, setLegacyPrivacy] =
    useState<AlumniPrivacy>(defaultLegacyPrivacy);
  const [initialSnapshot, setInitialSnapshot] = useState<{
    sectionPrivacy: SectionPrivacy;
    legacyPrivacy: AlumniPrivacy;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alumniInfoForm = useForm({
    defaultValues: {
      username: selectedAlumni?.username ?? "",
      password: "",
      status: selectedAlumni?.status ?? "ACTIVE",
      isVerified: !!selectedAlumni?.isVerified,
      isMentor: !!selectedAlumni?.isMentor,
      willingToMentor: !!selectedAlumni?.willingToMentor,
    },
  });

  useEffect(() => {
    if (user?.alumniId) {
      dispatch(fetchAlumniByIdAsync(user.alumniId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedAlumni) {
      const nextSection =
        selectedAlumni.sectionPrivacy || defaultSectionPrivacy;
      const nextLegacy = selectedAlumni.privacy || defaultLegacyPrivacy;
      setSectionPrivacy(nextSection);
      setLegacyPrivacy(nextLegacy);
      alumniInfoForm.reset({
        username: selectedAlumni.username,
        password: "",
        status: selectedAlumni.status,
        isVerified: !!selectedAlumni.isVerified,
        isMentor: !!selectedAlumni.isMentor,
        willingToMentor: !!selectedAlumni.willingToMentor,
      });
      setInitialSnapshot({
        sectionPrivacy: nextSection,
        legacyPrivacy: nextLegacy,
      });
    }
  }, [selectedAlumni, alumniInfoForm]);

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return false;
    return (
      JSON.stringify(sectionPrivacy) !==
        JSON.stringify(initialSnapshot.sectionPrivacy) ||
      JSON.stringify(legacyPrivacy) !==
        JSON.stringify(initialSnapshot.legacyPrivacy)
    );
  }, [sectionPrivacy, legacyPrivacy, initialSnapshot]);

  if (loading && !selectedAlumni) return <CommonLoading />;
  if (!selectedAlumni) return <CommonEmptyState title="Profile not found" />;

  const isGlobalPrivate = legacyPrivacy.profileVisibility === "PRIVATE";

  const handleSectionChange = (
    key: keyof SectionPrivacy,
    value: PrivacyLevel,
  ) => {
    setSectionPrivacy((current) => ({ ...current, [key]: value }));
  };

  const handleLegacyChange = (
    key: keyof AlumniPrivacy,
    value: boolean | "PUBLIC" | "PRIVATE",
  ) => {
    setLegacyPrivacy((current) => ({ ...current, [key]: value }));
  };

  const handleDiscard = () => {
    if (!initialSnapshot) return;
    setSectionPrivacy(initialSnapshot.sectionPrivacy);
    setLegacyPrivacy(initialSnapshot.legacyPrivacy);
  };

  const handleSaveAll = async () => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateAlumniPrivacyAsync({
          id: selectedAlumni.id,
          privacy: legacyPrivacy,
          sectionPrivacy,
        } as any),
      );

      if (result.meta.requestStatus === "fulfilled") {
        setInitialSnapshot({ sectionPrivacy, legacyPrivacy });
        dispatch(
          showToast({
            message: "Privacy settings updated successfully",
            severity: "success",
          }),
        );
      } else {
        dispatch(
          showToast({
            message: "Failed to update privacy settings",
            severity: "error",
          }),
        );
      }
    } catch {
      dispatch(
        showToast({
          message: "An unexpected error occurred",
          severity: "error",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ pb: isDirty ? 12 : 6 }}>
      <CommonPageHeader
        title="Settings & Privacy"
        subtitle="Manage your profile security, directory visibility, and section-level privacy rules."
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Profile", path: "/alumni/profile" },
          { label: "Settings & Privacy" },
        ]}
      />

      {/* Master Profile Status */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: isGlobalPrivate ? alpha("#f59e0b", 0.4) : "divider",
          mb: 3,
          boxShadow: "none",
          overflow: "hidden",
          transition: "border-color 0.15s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  bgcolor: alpha(isGlobalPrivate ? "#94a3b8" : "#10b981", 0.12),
                  color: isGlobalPrivate ? "#64748b" : "#10b981",
                  flexShrink: 0,
                }}
              >
                <Shield size={22} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.25,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Master Profile Status
                  </Typography>
                  <Chip
                    label={isGlobalPrivate ? "Hidden" : "Visible"}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      bgcolor: alpha(
                        isGlobalPrivate ? "#94a3b8" : "#10b981",
                        0.12,
                      ),
                      color: isGlobalPrivate ? "#64748b" : "#10b981",
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {isGlobalPrivate
                    ? "Your profile is hidden from the entire alumni network."
                    : "Your profile is visible across the alumni network."}
                </Typography>
              </Box>
            </Box>

            <ToggleButtonGroup
              exclusive
              value={legacyPrivacy.profileVisibility}
              onChange={(_, value) =>
                value && handleLegacyChange("profileVisibility", value)
              }
              sx={{
                flexShrink: 0,
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                borderRadius: 2.5,
                p: 0.5,
                gap: 0.5,
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  px: 2.5,
                  py: 0.9,
                  gap: 1,
                  border: "none",
                  borderRadius: 2,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "background.paper",
                    color: "text.primary",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "background.paper" },
                  },
                },
              }}
            >
              <ToggleButton value="PUBLIC" disableRipple>
                <Eye size={16} /> Public
              </ToggleButton>
              <ToggleButton value="PRIVATE" disableRipple>
                <EyeOff size={16} /> Private
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>

        {isGlobalPrivate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 2.5, md: 3.5 },
              py: 1.25,
              bgcolor: alpha("#f59e0b", 0.1),
              borderTop: "1px solid",
              borderColor: alpha("#f59e0b", 0.25),
            }}
          >
            <EyeOff size={15} color="#b45309" />
            <Typography
              variant="body2"
              sx={{ color: "#92400e", fontWeight: 500 }}
            >
              Section-level settings below are overridden and disabled while
              your profile is private.
            </Typography>
          </Box>
        )}
      </Card>

      {/* Granular Section Visibility */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          opacity: isGlobalPrivate ? 0.55 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 1, md: 1.5 } }}>
          <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5, pb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Section Visibility
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Choose who can see each part of your profile.
            </Typography>
          </Box>

          <List disablePadding sx={{ mt: 1 }}>
            {sections.map((section, index) => (
              <Box key={section.key}>
                {index > 0 && (
                  <Divider component="li" sx={{ mx: { xs: 1.5, md: 2 } }} />
                )}
                <ListItem
                  sx={{
                    py: 1.75,
                    px: { xs: 1.5, md: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1.5, sm: 0 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: alpha(
                          privacyColors[sectionPrivacy[section.key]],
                          0.12,
                        ),
                        color: privacyColors[sectionPrivacy[section.key]],
                      }}
                    >
                      {section.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {section.label}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                      >
                        {section.description}
                      </Typography>
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      width: { xs: "100%", sm: "auto" },
                      flexShrink: 0,
                    }}
                  >
                    <Chip
                      label={privacyLabels[sectionPrivacy[section.key]]}
                      size="small"
                      sx={{
                        display: { xs: "none", md: "flex" },
                        bgcolor: alpha(
                          privacyColors[sectionPrivacy[section.key]],
                          0.12,
                        ),
                        color: privacyColors[sectionPrivacy[section.key]],
                        fontWeight: 600,
                      }}
                    />
                    <FormControl
                      size="small"
                      sx={{ minWidth: { xs: "100%", sm: 170 } }}
                    >
                      <Select
                        value={sectionPrivacy[section.key]}
                        disabled={isGlobalPrivate}
                        onChange={(e) =>
                          handleSectionChange(
                            section.key,
                            e.target.value as PrivacyLevel,
                          )
                        }
                      >
                        {(Object.keys(privacyLabels) as PrivacyLevel[]).map(
                          (level) => (
                            <MenuItem key={level} value={level}>
                              {privacyLabels[level]}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Alumni Information */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mt: 3,
          boxShadow: "none",
          opacity: isGlobalPrivate ? 0.55 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 1, md: 1.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 1.5, md: 2 },
              pt: 1.5,
            }}
          >
            <Shield size={18} color="#6366f1" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Alumni Information
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 2, pb: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="username"
                  label="Username"
                  control={alumniInfoForm.control}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonInputField
                  name="password"
                  label="New Password (leave blank to keep)"
                  control={alumniInfoForm.control}
                  type="password"
                  placeholder="Leave blank to keep current password"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CommonSelectField
                  name="status"
                  label="Status"
                  control={alumniInfoForm.control}
                  options={[
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                    { label: "Pending", value: "PENDING" },
                  ]}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mt: 2 }}>
                  <CommonCheckbox
                    name="isVerified"
                    label="Verified Alumni"
                    control={alumniInfoForm.control}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mt: 1 }}>
                  <CommonCheckbox
                    name="isMentor"
                    label="Is Mentor"
                    control={alumniInfoForm.control}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mt: 1 }}>
                  <CommonCheckbox
                    name="willingToMentor"
                    label="Willing to Mentor"
                    control={alumniInfoForm.control}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Contact Field Filters */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mt: 3,
          boxShadow: "none",
          opacity: isGlobalPrivate ? 0.55 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 1, md: 1.5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 1.5, md: 2 },
              pt: 1.5,
            }}
          >
            <Lock size={18} color="#6366f1" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Contact Field Filters
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", px: { xs: 1.5, md: 2 }, pb: 0.5 }}
          >
            Fine-tune which contact details appear on your card and directory
            listing.
          </Typography>

          <List disablePadding sx={{ mt: 1 }}>
            {toggles.map((toggle, index) => (
              <Box key={toggle.key}>
                {index > 0 && (
                  <Divider component="li" sx={{ mx: { xs: 1.5, md: 2 } }} />
                )}
                <ListItem sx={{ py: 1.25, px: { xs: 1.5, md: 2 } }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                    {toggle.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                      >
                        {toggle.label}
                      </Typography>
                    }
                  />
                  <Switch
                    checked={legacyPrivacy[toggle.key] as boolean}
                    disabled={isGlobalPrivate}
                    onChange={(e) =>
                      handleLegacyChange(toggle.key, e.target.checked)
                    }
                    size="small"
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Sticky save bar — only appears once there are unsaved changes */}
      {isDirty && (
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mr: "auto", pl: 1 }}
          >
            You have unsaved changes
          </Typography>
          <Button
            variant="text"
            startIcon={<RotateCcw size={16} />}
            onClick={handleDiscard}
            disabled={isSubmitting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={18} />}
            onClick={handleSaveAll}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              boxShadow: "none",
              ":hover": { boxShadow: "none" },
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
