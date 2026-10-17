import { useState, useEffect, forwardRef, type ReactElement } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Slide,
  Typography,
  alpha,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Clock,
  X,
  ExternalLink,
  DollarSign,
  Mail,
  UserCheck,
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

const getTypeColor = (type?: string | null) =>
  (type && typeColor[type]) || "var(--color-primary)";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function JobOpportunitiesSection() {
  const { featuredJobs, loading, fetchFeaturedJobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  useEffect(() => {
    if (!featuredJobs || featuredJobs.length === 0) {
      void fetchFeaturedJobs(4).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDetails = (job: JobItem) => setSelectedJob(job);
  const handleCloseDetails = () => setSelectedJob(null);

  return (
    <Box
      component="section"
      id="jobs"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* ---------- Section header ---------- */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              width: "fit-content",
              fontWeight: 800,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "-0.02em",
              color: "primary.main",
              textTransform: "uppercase",
              textAlign: "center",
              // pb: 1.5,
              borderBottom: "3px solid",
              borderColor: "primary.main",
            }}
          >
            Career Opportunities
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Featured Opportunities
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowRight size={18} />}
            component={Link}
            to="/jobs"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
              py: 1,
            }}
          >
            View All
          </Button>
        </Box>

        {/* ---------- Loading ---------- */}
        {loading && featuredJobs.length === 0 && (
          <Grid container spacing={3}>
            {[0, 1, 2, 3].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton
                  variant="rounded"
                  height={360}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ---------- Empty ---------- */}
        {!loading && featuredJobs.length === 0 && (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 4,
              bgcolor: "background.paper",
              color: "text.secondary",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                color: "primary.main",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Briefcase size={28} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}
            >
              No featured jobs right now
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
              Check back soon — new openings from our network are added
              regularly.
            </Typography>
          </Box>
        )}

        {/* ---------- Cards ---------- */}
        {featuredJobs.length > 0 && (
          <Grid container spacing={3}>
            {featuredJobs.map((job) => {
              const badgeColor = getTypeColor(job.employmentType);

              return (
                <Grid key={job.jobID} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 4,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: (t) =>
                          `0 20px 40px ${alpha(t.palette.text.primary, 0.08)}`,
                        borderColor: "primary.main",
                        "& .job-title": { color: "primary.main" },
                      },
                    }}
                  >
                    {job.image && (
                      <CardMedia
                        component="img"
                        height="150"
                        image={job.image}
                        alt={job.title}
                        sx={{
                          objectFit: "cover",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    )}

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
                        sx={{ mb: 2, flexWrap: "wrap", gap: 0.75 }}
                      >
                        {job.isFeatured && (
                          <Chip
                            label="Featured"
                            size="small"
                            color="warning"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              height: 24,
                              borderRadius: 1.5,
                            }}
                          />
                        )}
                        {job.employmentType && (
                          <Chip
                            label={job.employmentType}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 24,
                              borderRadius: 1.5,
                              bgcolor: `color-mix(in srgb, ${badgeColor} 12%, transparent)`,
                              color: badgeColor,
                              border: "1px solid",
                              borderColor: `color-mix(in srgb, ${badgeColor} 25%, transparent)`,
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        className="job-title"
                        onClick={() => handleOpenDetails(job)}
                        sx={{
                          fontWeight: 800,
                          fontSize: "1rem",
                          lineHeight: 1.35,
                          // mb: 1,
                          color: "text.primary",
                          cursor: "pointer",
                          // display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "1.8rem",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                          color: "text.secondary",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        <Building2 size={16} style={{ flexShrink: 0 }} />
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {job.company}
                        </Typography>
                      </Box>

                      {/* <Stack
                        spacing={1}
                        sx={{ mb: 2.5, flex: 1, color: "text.secondary" }}
                      >
                        {job.location && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "0.825rem",
                            }}
                          >
                            <MapPin size={14} style={{ flexShrink: 0 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.825rem",
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {job.location}
                            </Typography>
                          </Box>
                        )}
                        {job.experienceLevel && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "0.825rem",
                            }}
                          >
                            <Clock size={14} style={{ flexShrink: 0 }} />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.825rem" }}
                            >
                              {job.experienceLevel} level
                            </Typography>
                          </Box>
                        )}
                        {job.deadline && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: "0.825rem",
                            }}
                          >
                            <Calendar size={14} style={{ flexShrink: 0 }} />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.825rem" }}
                            >
                              Apply by {formatDate(job.deadline)}
                            </Typography>
                          </Box>
                        )}
                      </Stack> */}

                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        endIcon={<ArrowRight size={16} />}
                        onClick={() => handleOpenDetails(job)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          borderRadius: 2.5,
                          py: 1.25,
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "#fff",
                          },
                          transition: "all 0.25s ease",
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* ============================================================
            Job Detail Modal
            ─ Image is now INSIDE DialogContent so it scrolls with the
              rest of the content
            ─ Taller cover (260px desktop / 200px mobile)
           ============================================================ */}
        <Dialog
          open={Boolean(selectedJob)}
          onClose={handleCloseDetails}
          slots={{ transition: Transition }}
          keepMounted
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
                backgroundImage: "none",
                position: "relative",
              },
            },
            backdrop: {
              sx: {
                bgcolor: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              },
            },
          }}
        >
          {selectedJob && (
            <>
              {/* Close button — floats over the image, stays sticky as you scroll */}
              <IconButton
                onClick={handleCloseDetails}
                aria-label="Close job details"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  bgcolor: "rgba(0, 0, 0, 0.45)",
                  color: "#fff",
                  backdropFilter: "blur(6px)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.75)" },
                }}
              >
                <X size={18} />
              </IconButton>

              <DialogContent
                sx={{
                  /* Remove default padding so the image goes edge-to-edge */
                  p: 0,
                  "&:first-of-type": { pt: 0 },
                }}
              >
                {/* ---- COVER — now scrolls with content ---- */}
                {selectedJob.image ? (
                  <Box
                    sx={{
                      height: { xs: 200, sm: 260 },
                      width: "100%",
                      backgroundImage: `url(${selectedJob.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: { xs: 140, sm: 180 },
                      width: "100%",
                      background: (t) =>
                        `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.primary.dark} 100%)`,
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* ---- Body — normal padded content below the image ---- */}
                <Box sx={{ p: { xs: 3, sm: 4 } }}>
                  {/* Badges */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {selectedJob.isFeatured && (
                      <Chip
                        label="Featured"
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                      />
                    )}
                    {selectedJob.employmentType && (
                      <Chip
                        label={selectedJob.employmentType}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          bgcolor: `color-mix(in srgb, ${getTypeColor(
                            selectedJob.employmentType,
                          )} 12%, transparent)`,
                          color: getTypeColor(selectedJob.employmentType),
                        }}
                      />
                    )}
                  </Stack>

                  {/* Title & Company */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.2,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    {selectedJob.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    <Building2 size={18} />
                    {selectedJob.company}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Attributes */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {selectedJob.location && (
                      <Grid size={{ xs: 6 }}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: (t) =>
                                alpha(t.palette.primary.main, 0.08),
                              color: "primary.main",
                              display: "flex",
                            }}
                          >
                            <MapPin size={18} />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                              }}
                            >
                              Location
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {selectedJob.location}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}

                    {selectedJob.experienceLevel && (
                      <Grid size={{ xs: 6 }}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: (t) =>
                                alpha(t.palette.primary.main, 0.08),
                              color: "primary.main",
                              display: "flex",
                            }}
                          >
                            <UserCheck size={18} />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                              }}
                            >
                              Experience
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {selectedJob.experienceLevel} Level
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}

                    {selectedJob.salaryRange && (
                      <Grid size={{ xs: 6 }}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: (t) =>
                                alpha(t.palette.success.main, 0.1),
                              color: "success.main",
                              display: "flex",
                            }}
                          >
                            <DollarSign size={18} />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                              }}
                            >
                              Salary Range
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              ৳ {selectedJob.salaryRange}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}

                    {selectedJob.deadline && (
                      <Grid size={{ xs: 6 }}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: (t) =>
                                alpha(t.palette.warning.main, 0.1),
                              color: "warning.main",
                              display: "flex",
                            }}
                          >
                            <Calendar size={18} />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                              }}
                            >
                              Deadline
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {formatDate(selectedJob.deadline)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>

                  {selectedJob.description && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
                      >
                        About the Role
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.7,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {selectedJob.description}
                      </Typography>
                    </Box>
                  )}

                  {selectedJob.contactEmail && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        border: "1px solid",
                        borderColor: (t) => alpha(t.palette.primary.main, 0.12),
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Mail
                        size={18}
                        style={{
                          color: "var(--color-primary)",
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          Direct Contact
                        </Typography>
                        <Typography
                          variant="body2"
                          component="a"
                          href={`mailto:${selectedJob.contactEmail}`}
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            textDecoration: "none",
                            wordBreak: "break-all",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {selectedJob.contactEmail}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Actions */}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleCloseDetails}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.25,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Close
                    </Button>
                    {selectedJob.applyURL ? (
                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        component="a"
                        href={selectedJob.applyURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<ExternalLink size={16} />}
                        sx={{
                          borderRadius: 2.5,
                          py: 1.25,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Apply Now
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        component={Link}
                        to={`/jobs/${selectedJob.jobID}`}
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                          borderRadius: 2.5,
                          py: 1.25,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Full Details Page
                      </Button>
                    )}
                  </Stack>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}
