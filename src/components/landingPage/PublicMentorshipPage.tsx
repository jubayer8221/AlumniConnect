import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import { Briefcase, MapPin, Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonAvatar } from "@/components/common";
import { useMentors } from "@/hooks/useMentors";

export default function PublicMentorshipPage() {
  const { mentors, loading, fetchMentors } = useMentors();

  useEffect(() => {
    fetchMentors({ pageNumber: 1, pageSize: 20 });
  }, []);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="Mentorship"
        title="Learn from those who"
        highlightText="walked before you"
        subtitle="Connect with alumni mentors across industries and generations. Get guidance, ask questions, and grow."
      />

      <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {loading && mentors.length === 0 && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rounded" height={260} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ============================================================
              Empty state
             ============================================================ */}
          {!loading && mentors.length === 0 && (
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                px: { xs: 3, sm: 5, md: 8 },
                py: { xs: 6, md: 9 },
                textAlign: "center",
              }}
            >
              {/* Decorative glow behind the icon */}
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  top: -80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(var(--rgb-primary), 0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 76,
                  height: 76,
                  borderRadius: 3,
                  bgcolor: "rgba(var(--rgb-primary), 0.08)",
                  border: "1px solid",
                  borderColor: "rgba(var(--rgb-primary), 0.18)",
                  color: "primary.main",
                  mb: 3,
                }}
              >
                <Users size={34} />
              </Box>

              <Typography
                sx={{
                  position: "relative",
                  fontWeight: 800,
                  fontSize: { xs: "1.35rem", md: "1.6rem" },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 1.5,
                }}
              >
                No mentors are listed yet
              </Typography>

              <Typography
                sx={{
                  position: "relative",
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  maxWidth: 520,
                  mx: "auto",
                  mb: 4,
                }}
              >
                Our mentorship network is growing. New alumni mentors are added
                regularly — check back soon, or take the first step yourself and
                offer to guide the next generation.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ justifyContent: "center", alignItems: "stretch" }}
              >
                <Button
                  component={Link}
                  to="/alumni/network/directory"
                  variant="contained"
                  startIcon={<Users size={18} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1.25,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  Browse Alumni Directory
                </Button>
                <Button
                  component={Link}
                  to="/alumni/network/mentorship"
                  variant="outlined"
                  startIcon={<UserPlus size={18} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3,
                    py: 1.25,
                  }}
                >
                  Become a Mentor
                </Button>
              </Stack>

              <Typography
                sx={{
                  position: "relative",
                  fontSize: "0.78rem",
                  color: "text.disabled",
                  mt: 3,
                }}
              >
                Already a mentor? Your listing may still be under review.
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            {mentors.map((m) => (
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
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
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
                      <Box sx={{ minWidth: 0 }}>
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

                    <Button
                      component={Link}
                      to={`/alumni/profile-details/${m.alumniID}`}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
