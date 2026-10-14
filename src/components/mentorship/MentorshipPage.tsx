import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Typography,
  alpha,
} from "@mui/material";
import { BadgeCheck, Briefcase, MapPin, Search, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommonAvatar,
  CommonButton,
  CommonEmptyState,
  CommonPageHeader,
  CommonSearchField,
} from "@/components/common";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { useMentors } from "@/hooks/useMentors";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";

export default function MentorshipPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authUser: user } = useAuth();
  const { selectedAlumni, fetchAlumniById } = useAlumni();
  const {
    mentors,
    loading: mentorsLoading,
    fetchMentors,
    updateMentorFlags,
  } = useMentors();

  const [becomeMentorOpen, setBecomeMentorOpen] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------- Load mentors on mount ---------- */
  useEffect(() => {
    void fetchMentors({ pageNumber: 1, pageSize: 24 }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Load own profile for prefill ---------- */
  useEffect(() => {
    if (!user?.alumniId) return;
    if (!selectedAlumni || String(selectedAlumni.alumniID) !== user.alumniId) {
      void fetchAlumniById(user.alumniId).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.alumniId]);

  useEffect(() => {
    if (!selectedAlumni) return;
    // Consider them a mentor if either flag is set
    setIsMentor(selectedAlumni.isMentor || selectedAlumni.willingToMentor);
  }, [selectedAlumni]);

  const filteredMentors = useMemo(() => {
    if (!search.trim()) return mentors;
    const q = search.toLowerCase();
    return mentors.filter(
      (m) =>
        (m.fullName ?? "").toLowerCase().includes(q) ||
        (m.designation ?? "").toLowerCase().includes(q) ||
        (m.companyName ?? "").toLowerCase().includes(q) ||
        (m.departmentName ?? "").toLowerCase().includes(q) ||
        (m.industry ?? "").toLowerCase().includes(q),
    );
  }, [mentors, search]);

  const myMentorStatus = selectedAlumni
    ? selectedAlumni.isMentor || selectedAlumni.willingToMentor
    : false;

  const handleSave = async () => {
    setSaving(true);
    try {
      // One toggle → set both flags together
      await updateMentorFlags(isMentor, isMentor);
      await fetchMentors({ pageNumber: 1, pageSize: 24 });
      if (user?.alumniId) {
        await fetchAlumniById(user.alumniId).catch(() => undefined);
      }
      dispatch(
        showToast({
          message: isMentor
            ? "You are now listed as a mentor."
            : "You have been removed from the mentor list.",
          severity: "success",
        }),
      );
      setBecomeMentorOpen(false);
    } catch {
      dispatch(
        showToast({
          message: "Unable to update mentor settings.",
          severity: "error",
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  const openBecomeDialog = () => {
    setIsMentor(
      selectedAlumni
        ? selectedAlumni.isMentor || selectedAlumni.willingToMentor
        : false,
    );
    setBecomeMentorOpen(true);
  };

  return (
    <Box>
      <CommonPageHeader
        title="Mentorship"
        subtitle={
          myMentorStatus
            ? "You are listed as a mentor."
            : "Connect with experienced alumni for guidance and career advice."
        }
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Mentorship" },
        ]}
        actions={
          <Stack direction="row" spacing={1.5}>
            <CommonButton
              variant="outlined"
              startIcon={<Search size={18} />}
              onClick={() => {
                document
                  .getElementById("mentor-search")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Find a Mentor
            </CommonButton>
            <CommonButton
              startIcon={<Users size={18} />}
              onClick={openBecomeDialog}
            >
              {myMentorStatus ? "Mentor Settings" : "Become a Mentor"}
            </CommonButton>
          </Stack>
        }
      />

      {/* ---------- Search + count ---------- */}
      <Box
        id="mentor-search"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 260, maxWidth: 420 }}>
          <CommonSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search mentors by name, company, or industry..."
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {filteredMentors.length} mentor
          {filteredMentors.length === 1 ? "" : "s"}
        </Typography>
        {myMentorStatus && (
          <Chip
            icon={<BadgeCheck size={14} />}
            label="You are a mentor"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      {/* ---------- Loading ---------- */}
      {mentorsLoading && mentors.length === 0 && (
        <Grid container spacing={2.5}>
          {[0, 1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={260} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ---------- Empty ---------- */}
      {!mentorsLoading && filteredMentors.length === 0 && (
        <CommonEmptyState
          title={search ? "No mentors found" : "No mentors available yet"}
          message={
            search ? "Try a different search term." : "Be the first mentor!"
          }
          //   actionLabel={search ? undefined : "Become a Mentor"}
          //   onAction={search ? undefined : openBecomeDialog}
        />
      )}

      {/* ---------- Mentor cards ---------- */}
      {filteredMentors.length > 0 && (
        <Grid container spacing={2.5}>
          {filteredMentors.map((m) => {
            const isSelf = Boolean(
              user?.alumniId && String(m.alumniID) === user.alumniId,
            );
            return (
              <Grid key={m.alumniID} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 16px 32px rgba(var(--rgb-black), 0.08)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <CommonAvatar
                        src={m.profilePhoto ?? undefined}
                        name={m.fullName ?? "Mentor"}
                        size={56}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {m.fullName}
                          </Typography>
                          {isSelf && (
                            <Chip
                              label="You"
                              size="small"
                              color="primary"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          )}
                        </Box>
                        {m.designation && (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {m.designation}
                            {m.companyName ? ` · ${m.companyName}` : ""}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.75 }}
                    >
                      {m.departmentName && (
                        <Chip
                          label={m.departmentName}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {m.industry && (
                        <Chip label={m.industry} size="small" color="primary" />
                      )}
                    </Stack>

                    {m.bio && (
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: "text.secondary",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1.5,
                        }}
                      >
                        {m.bio}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        mb: 2,
                      }}
                    >
                      {m.presentDistrict && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <MapPin size={12} />
                          {m.presentDistrict}
                        </Box>
                      )}
                      {m.companyName && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Briefcase size={12} />
                          {m.companyName}
                        </Box>
                      )}
                    </Stack>

                    <Box sx={{ mt: "auto" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/alumni/${m.alumniID}`)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ---------- Mentor Settings Dialog (single toggle) ---------- */}
      <Dialog
        open={becomeMentorOpen}
        onClose={() => !saving && setBecomeMentorOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Mentor Settings
          <IconButton
            size="small"
            onClick={() => !saving && setBecomeMentorOpen(false)}
            disabled={saving}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isMentor ? "primary.main" : "divider",
                bgcolor: isMentor
                  ? (theme) => alpha(theme.palette.primary.main, 0.06)
                  : (theme) => alpha(theme.palette.action.hover, 0.03),
                transition: "all 0.2s ease",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isMentor}
                    onChange={(e) => setIsMentor(e.target.checked)}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    I want to be a mentor
                  </Typography>
                }
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5, ml: 6 }}
              >
                {isMentor
                  ? "You will appear in the mentor directory."
                  : "Toggle on to appear in the mentor directory."}
              </Typography>
            </Box>

            <Divider />

            <Typography variant="caption" color="text.secondary">
              Logged in as{" "}
              <strong>{user?.fullName ?? user?.username ?? "user"}</strong>
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBecomeMentorOpen(false)}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <CommonButton
            onClick={() => void handleSave()}
            loading={saving}
            sx={{ textTransform: "none" }}
          >
            Save
          </CommonButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
