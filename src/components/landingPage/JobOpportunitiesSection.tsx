import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import type { JobItem } from "@/types/job";
import { formatDate } from "@/utils/dateUtils";

const typeColor: Record<string, string> = {
  "Full-Time": "var(--color-primary)",
  "Part-Time": "var(--color-category-orange)",
  Internship: "var(--color-chart-purple)",
  Remote: "var(--color-chart-cyan)",
  Contract: "var(--color-chart-blue)",
  Freelance: "var(--color-chart-pink)",
};

export default function JobOpportunitiesSection() {
  const { featuredJobs, loading, fetchFeaturedJobs } = useJobs();

  useEffect(() => {
    void fetchFeaturedJobs(3).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      component="section"
      id="jobs"
      sx={{
        py: 6,
        bgcolor: "var(--color-light-surface-blue)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-end" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Career Opportunities
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1.5,
              }}
            >
              Featured Jobs
            </Typography>
            {/* <Typography
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                lineHeight: 1.7,
              }}
            >
              Hand-picked opportunities shared by our alumni network.
            </Typography> */}
          </Box>
          <Button
            endIcon={<ArrowRight size={18} />}
            component={Link}
            to="/jobs"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            View All
          </Button>
        </Box>

        {loading && featuredJobs.length === 0 && (
          <Grid container spacing={3}>
            {[0, 1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && featuredJobs.length === 0 && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              color: "text.secondary",
            }}
          >
            <Briefcase size={40} style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              No featured jobs right now
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Check back soon — new openings are added regularly.
            </Typography>
          </Box>
        )}

        {featuredJobs.length > 0 && (
          <Grid container spacing={3}>
            {featuredJobs.map((job) => (
              <Grid key={job.jobID} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
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
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.75 }}
                    >
                      {job.isFeatured && (
                        <Chip
                          label="Featured"
                          size="small"
                          color="warning"
                          sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                        />
                      )}
                      {job.employmentType && (
                        <Chip
                          label={job.employmentType}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            bgcolor:
                              (typeColor[job.employmentType] ??
                                "var(--color-primary)") + "15",
                            color:
                              typeColor[job.employmentType] ??
                              "var(--color-primary)",
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        lineHeight: 1.35,
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.8rem",
                      }}
                    >
                      {job.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        mb: 1.5,
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      <Building2 size={14} />
                      {job.company}
                    </Box>

                    <Stack
                      spacing={0.75}
                      sx={{ mb: 2, flex: 1, color: "text.secondary" }}
                    >
                      {job.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontSize: "0.8rem",
                          }}
                        >
                          <MapPin size={13} />
                          {job.location}
                        </Box>
                      )}
                      {job.experienceLevel && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontSize: "0.8rem",
                          }}
                        >
                          <Clock size={13} />
                          {job.experienceLevel} level
                        </Box>
                      )}
                      {job.deadline && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            fontSize: "0.8rem",
                          }}
                        >
                          <Calendar size={13} />
                          Apply by {formatDate(job.deadline)}
                        </Box>
                      )}
                    </Stack>

                    {job.description && (
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: "text.secondary",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {job.description}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={<ArrowRight size={16} />}
                      component={job.applyURL ? "a" : Link}
                      {...(job.applyURL
                        ? {
                            href: job.applyURL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : { to: `/jobs/${job.jobID}` })}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      {job.applyURL ? "Apply Now" : "View Details"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
