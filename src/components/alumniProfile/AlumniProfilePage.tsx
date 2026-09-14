import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";
import { Lock, Eye, Mail, Phone, MapPin, Briefcase, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CommonAvatar,
  CommonStatusBadge,
} from "@/components/common";
import type { AlumniPrivacy } from "@/types/alumni";

export default function AlumniProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { selectedAlumni, loading } = useAppSelector((s) => s.alumni);
  const [privacy, setPrivacy] = useState<AlumniPrivacy | null>(null);

  useEffect(() => {
    if (user?.alumniId) dispatch(fetchAlumniByIdAsync(user.alumniId));
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedAlumni?.privacy) setPrivacy(selectedAlumni.privacy);
  }, [selectedAlumni]);

  if (loading && !selectedAlumni) return <CommonLoading />;
  if (!selectedAlumni) return <CommonEmptyState title="Profile not found" />;

  const handlePrivacyChange = async (
    key: keyof AlumniPrivacy,
    value: boolean | "PUBLIC" | "PRIVATE",
  ) => {
    if (!privacy) return;
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    const res = await dispatch(
      updateAlumniPrivacyAsync({ id: selectedAlumni.id, privacy: updated }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({ message: "Privacy settings updated", severity: "success" }),
      );
    }
  };

  const a = selectedAlumni;

  return (
    <Box>
      <CommonPageHeader
        title="Alumni Profile"
        subtitle="View and manage your alumni profile"
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Alumni Profile" },
        ]}
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
            height: 100,
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          }}
        />
        <CardContent sx={{ p: 3, pt: 0, mt: -5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: { sm: "flex-end" },
            }}
          >
            <CommonAvatar
              src={a.profilePhoto}
              name={a.fullName}
              size={100}
              sx={{ border: "4px solid white" }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {a.fullName}
                </Typography>
                <CommonStatusBadge status={a.status} />
                {a.isVerified && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    Verified
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {a.alumniId} • {a.designation || "—"}{" "}
                {a.companyName ? `at ${a.companyName}` : ""}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate(`/alumni/profile-setup`)}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
                Personal & Academic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Gender
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.gender || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Program
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.programName || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Department
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.departmentName || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Batch
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.batch || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Graduation Year
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.graduationYear || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    City
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.city || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Country
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {a.country || "—"}
                  </Typography>
                </Grid>
              </Grid>
              {a.bio && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Biography
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {a.bio}
                  </Typography>
                </>
              )}
              {a.skills && a.skills.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {a.skills.map((s) => (
                      <Box
                        key={s}
                        component="span"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: "primary.50",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "primary.main",
                          mr: 0.5,
                          mb: 0.5,
                        }}
                      >
                        {s}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Lock size={20} className="text-blue-600" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Privacy Settings
                </Typography>
              </Box>
              {privacy && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.showEmail}
                        onChange={(e) =>
                          handlePrivacyChange("showEmail", e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <Mail size={14} /> Show Email
                      </span>
                    }
                    sx={{ display: "flex", mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.showPhone}
                        onChange={(e) =>
                          handlePrivacyChange("showPhone", e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <Phone size={14} /> Show Phone
                      </span>
                    }
                    sx={{ display: "flex", mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.showAddress}
                        onChange={(e) =>
                          handlePrivacyChange("showAddress", e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin size={14} /> Show Address
                      </span>
                    }
                    sx={{ display: "flex", mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.showCompany}
                        onChange={(e) =>
                          handlePrivacyChange("showCompany", e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <Briefcase size={14} /> Show Company
                      </span>
                    }
                    sx={{ display: "flex", mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.showSocialLinks}
                        onChange={(e) =>
                          handlePrivacyChange(
                            "showSocialLinks",
                            e.target.checked,
                          )
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <Globe size={14} /> Show Social Links
                      </span>
                    }
                    sx={{ display: "flex", mb: 2 }}
                  />
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Profile Visibility
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.profileVisibility === "PUBLIC"}
                        onChange={(e) =>
                          handlePrivacyChange(
                            "profileVisibility",
                            e.target.checked ? "PUBLIC" : "PRIVATE",
                          )
                        }
                        size="small"
                      />
                    }
                    label={
                      <span className="flex items-center gap-1 text-sm">
                        <Eye size={14} /> Public to alumni
                      </span>
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
