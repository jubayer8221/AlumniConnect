import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Skeleton,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import {
  Briefcase,
  FileText,
  Globe,
  GraduationCap,
  Lock,
  Phone,
  Save,
  Shield,
  User,
  Users,
} from "lucide-react";
import { CommonButton, CommonPageHeader } from "@/components/common";
// import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { showToast } from "@/store/Slice/uiSlice";
import type { AlumniPrivacySettings, PrivacyLevel } from "@/types/alumni";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAppDispatch } from "@/hooks";

const visibilityFields = [
  {
    key: "personalInfoVisibility",
    label: "Personal Information",
    description: "Personal identity and date of birth.",
    icon: <User size={18} />,
  },
  {
    key: "contactInfoVisibility",
    label: "Contact Information",
    description: "Email, phone number, and address.",
    icon: <Phone size={18} />,
  },
  {
    key: "academicInfoVisibility",
    label: "Academic Information",
    description: "Education, batch, and graduation details.",
    icon: <GraduationCap size={18} />,
  },
  {
    key: "jobExperienceVisibility",
    label: "Job Experience",
    description: "Employers, roles, and work history.",
    icon: <Briefcase size={18} />,
  },
  {
    key: "socialInfoVisibility",
    label: "Social Information",
    description: "Social media and other profile links.",
    icon: <Globe size={18} />,
  },
  {
    key: "familyInfoVisibility",
    label: "Family Information",
    description: "Family members shown on your profile.",
    icon: <Users size={18} />,
  },
  {
    key: "biographyVisibility",
    label: "Biography",
    description: "Your bio and personal summary.",
    icon: <FileText size={18} />,
  },
] as const;

const contactFields = [
  { key: "displayEmail", label: "Display email address" },
  { key: "displayPhone", label: "Display phone number" },
  { key: "displayAddress", label: "Display address" },
  { key: "displayCompany", label: "Display company name" },
  { key: "displaySocialMedia", label: "Display social media links" },
] as const;

const levels: PrivacyLevel[] = ["PUBLIC", "ALUMNI_ONLY", "PRIVATE"];

export default function SettingsPrivacyPage() {
  const dispatch = useAppDispatch();
  const { authUser: user } = useAuth();
  const { fetchPrivacy, savePrivacy } = useAlumni();
  const alumniId = user?.alumniId;

  const [settings, setSettings] = useState<AlumniPrivacySettings | null>(null);
  const [initialSettings, setInitialSettings] =
    useState<AlumniPrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    settings !== null &&
    initialSettings !== null &&
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  useEffect(() => {
    if (!alumniId) {
      setLoading(false);
      setError("Your account does not have an alumni ID.");
      return;
    }
    let active = true;
    setLoading(true);
    fetchPrivacy(alumniId)
      .then((data) => {
        if (!active) return;
        setSettings(data);
        setInitialSettings(data);
        setError(null);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Unable to load privacy settings"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumniId]);

  const updateSetting = <K extends keyof AlumniPrivacySettings>(
    key: K,
    value: AlumniPrivacySettings[K],
  ) => {
    setSettings((current) =>
      current ? { ...current, [key]: value } : current,
    );
  };

  const save = async () => {
    if (!alumniId || !settings) return;
    setSaving(true);
    try {
      await savePrivacy(settings);
      setInitialSettings(settings);
      dispatch(
        showToast({
          message: "Privacy settings saved successfully",
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to save privacy settings"),
          severity: "error",
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={240} height={44} sx={{ mb: 2 }} />
        {[0, 1, 2].map((card) => (
          <Card key={card} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Skeleton variant="text" width="35%" height={32} />
              <Skeleton variant="rounded" height={54} sx={{ my: 1 }} />
              <Skeleton variant="rounded" height={54} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error || !settings) {
    return (
      <Box>
        <CommonPageHeader
          title="Settings & Privacy"
          breadcrumbs={[
            { label: "Home", path: "/alumni/dashboard" },
            { label: "Settings & Privacy" },
          ]}
        />
        <Typography color="error">
          {error || "Privacy settings unavailable."}
        </Typography>
      </Box>
    );
  }

  const isProfilePublic = settings.isProfilePublic;

  return (
    <Box sx={{ pb: isDirty ? 10 : 4 }}>
      <CommonPageHeader
        title="Settings & Privacy"
        subtitle="Manage your profile visibility and contact field preferences."
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Profile", path: "/alumni/profile" },
          { label: "Settings & Privacy" },
        ]}
      />

      <Card sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Shield size={22} />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                Master Profile Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isProfilePublic
                  ? "Your profile is visible to the alumni network."
                  : "Your profile is hidden from the alumni network."}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip label={isProfilePublic ? "Visible" : "Hidden"} size="small" />
            <Switch
              checked={isProfilePublic}
              onChange={(e) =>
                updateSetting("isProfilePublic", e.target.checked)
              }
              aria-label="Profile visible"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Section Visibility
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Choose who can see each part of your profile.
          </Typography>
          <List disablePadding>
            {visibilityFields.map((field, index) => (
              <Box key={field.key}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    px: 0,
                    gap: 1,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {field.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 600 }}>
                        {field.label}
                      </Typography>
                    }
                    secondary={field.description}
                  />
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                      value={settings[field.key]}
                      onChange={(e) =>
                        updateSetting(field.key, e.target.value as PrivacyLevel)
                      }
                      aria-label={`${field.label} visibility`}
                    >
                      {levels.map((level) => (
                        <MenuItem value={level} key={level}>
                          {level.replace("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Lock size={18} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Contact Field Filters
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Choose which details may appear on your profile.
          </Typography>
          <List disablePadding sx={{ mt: 1 }}>
            {contactFields.map((field, index) => (
              <Box key={field.key}>
                {index > 0 && <Divider />}
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary={field.label} />
                  <Switch
                    checked={settings[field.key]}
                    onChange={(e) => updateSetting(field.key, e.target.checked)}
                    aria-label={field.label}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      {isDirty && (
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CommonButton
            onClick={() => void save()}
            loading={saving}
            startIcon={<Save size={18} />}
          >
            Save Settings
          </CommonButton>
        </Box>
      )}
    </Box>
  );
}
