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
import { Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonAvatar } from "@/components/common";
import { useMentors } from "@/hooks/useMentors";

export default function PublicMentorshipPage() {
  const { mentors, loading, fetchMentors } = useMentors();

  useEffect(() => {
    void fetchMentors({ pageNumber: 1, pageSize: 24 }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          {!loading && mentors.length === 0 && (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                color: "text.secondary",
              }}
            >
              <Typography>No mentors available right now.</Typography>
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
