import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonButton } from "@/components/common";
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

const PAGE_SIZE_OPTIONS = [9, 18, 36] as const;

export default function PublicJobsListPage() {
  const navigate = useNavigate();
  const { featuredJobs, loading, fetchFeaturedJobs } = useJobs();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(9);

  useEffect(() => {
    // Public endpoint — 100 covers most small-to-medium deployments.
    void fetchFeaturedJobs(100).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allJobs: JobItem[] = useMemo(
    () => (featuredJobs ?? []).filter((j) => j.isActive !== false),
    [featuredJobs],
  );

  /* ---------- Search ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allJobs;
    return allJobs.filter(
      (j) =>
        (j.title ?? "").toLowerCase().includes(q) ||
        (j.company ?? "").toLowerCase().includes(q) ||
        (j.location ?? "").toLowerCase().includes(q) ||
        (j.employmentType ?? "").toLowerCase().includes(q) ||
        (j.experienceLevel ?? "").toLowerCase().includes(q) ||
        (j.description ?? "").toLowerCase().includes(q),
    );
  }, [allJobs, search]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paged = useMemo(
    () => filtered.slice(startIdx, endIdx),
    [filtered, startIdx, endIdx],
  );

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    nextPage: number,
  ) => {
    setPage(nextPage);
    document
      .getElementById("jobs-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const bannerStats = [
    {
      icon: <Briefcase size={22} />,
      value: `${allJobs.length}`,
      label: "Open Positions",
    },
    {
      icon: <Users size={22} />,
      value: "Alumni",
      label: "Shared Network",
    },
    {
      icon: <TrendingUp size={22} />,
      value: "Live",
      label: "Job Board",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="Career Opportunities"
        title="Discover Jobs from"
        highlightText="Our Network"
        subtitle="Openings shared by alumni and partner organizations across industries and locations."
        stats={bannerStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ---------- Header + search + back ---------- */}
          <Box
            id="jobs-grid"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "flex-end" },
              gap: 3,
              mb: 4,
              scrollMarginTop: 100,
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
                All Jobs
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Career Opportunities
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  maxWidth: 560,
                }}
              >
                {filtered.length}{" "}
                {filtered.length === 1 ? "opening" : "openings"} available
                {search ? ` for "${search}"` : ""}.
              </Typography>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "auto" },
                flexShrink: 0,
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <TextField
                size="small"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: { xs: "100%", md: 300 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} style={{ opacity: 0.6 }} />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                        >
                          <X size={14} />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
              <CommonButton
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Back
              </CommonButton>
            </Box>
          </Box>

          {/* ---------- Loading ---------- */}
          {loading && allJobs.length === 0 && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={360}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ---------- Empty ---------- */}
          {!loading && filtered.length === 0 && (
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
              <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                {search ? "No matching jobs" : "No open positions right now"}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                {search
                  ? "Try a different search term or clear the search."
                  : "Check back soon — new openings are added regularly."}
              </Typography>
              {search && (
                <Button
                  onClick={() => setSearch("")}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  Clear search
                </Button>
              )}
            </Box>
          )}

          {/* ---------- Cards ---------- */}
          {filtered.length > 0 && (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {paged.map((job) => {
                const badgeColor = getTypeColor(job.employmentType);
                return (
                  <Grid key={job.jobID} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          transform: "translateY(-4px)",
                          boxShadow: (t) => t.shadows[6],
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

                      <CardActionArea
                        component={Link}
                        to={`/jobs/${job.jobID}`}
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 3,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            "&:last-child": { pb: 3 },
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
                            sx={{
                              fontWeight: 800,
                              fontSize: "1.05rem",
                              lineHeight: 1.35,
                              mb: 1,
                              color: "text.primary",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "2.8rem",
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
                            }}
                          >
                            <Building2
                              size={15}
                              style={{
                                flexShrink: 0,
                                color: "var(--color-primary)",
                              }}
                            />
                            <Typography
                              component="span"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "primary.main",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {job.company}
                            </Typography>
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
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                  {job.location}
                                </Typography>
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
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                  {job.experienceLevel} level
                                </Typography>
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
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                  Apply by {formatDate(job.deadline)}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>

                      <Box sx={{ px: 3, pb: 3 }}>
                        <Button
                          component={Link}
                          to={`/jobs/${job.jobID}`}
                          fullWidth
                          variant="outlined"
                          endIcon={<ArrowRight size={16} />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            borderRadius: 2.5,
                            py: 1,
                            color: "primary.main",
                            borderColor: "divider",
                            "&:hover": {
                              borderColor: "primary.main",
                              bgcolor: "rgba(var(--rgb-primary), 0.04)",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* ---------- Bottom bar — info + size + pagination ---------- */}
          {filtered.length > 0 && (
            <Box
              sx={{
                mt: 6,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >
                  Showing{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {totalCount === 0 ? 0 : startIdx + 1}–{endIdx}
                  </Box>{" "}
                  of{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {totalCount}
                  </Box>{" "}
                  {totalCount === 1 ? "opening" : "openings"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Typography
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Per page:
                  </Typography>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{
                      minWidth: 80,
                      "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontWeight: 600,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
