import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
  Share2,
  Tag,
  User,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import { CommonEmptyState } from "@/components/common";
import { useJobs } from "@/hooks/useJobs";
import type { JobItem } from "@/types/job";
import { formatDate } from "@/utils/dateUtils";
import { appConfig } from "@/config/appConfig";

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

/* ---------- Quick Links (sidebar) ---------- */
const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "About the Academy", path: "/about" },
  { label: "All Jobs", path: "/jobs" },
  { label: "Upcoming Events", path: "/events" },
  { label: "News & Updates", path: "/news" },
  { label: "All Activities", path: "/activities" },
  { label: "Mentorship", path: "/mentorship" },
  { label: "Alumni Directory", path: "/alumni/network/directory" },
];

/* ---------- Social icons ---------- */
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);
const WhatsappIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.237a9.96 9.96 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2zm5.827 14.19c-.244.688-1.432 1.313-1.986 1.388-.507.069-1.162.1-3.359-.806-2.812-1.162-4.622-4.012-4.763-4.202-.14-.19-1.144-1.523-1.144-2.905 0-1.382.723-2.062.98-2.343.257-.282.562-.352.75-.352.187 0 .375.003.538.01.175.008.411-.066.643.492.244.587.828 2.02.9 2.167.072.147.12.32.023.514-.097.193-.146.314-.29.488-.144.175-.303.391-.433.525-.144.148-.295.31-.127.6.168.29.749 1.237 1.607 2.001 1.103.982 2.033 1.286 2.323 1.432.29.147.46.123.63-.073.17-.197.728-.847.922-1.139.193-.292.387-.244.646-.147.258.098 1.64.773 1.921.914.281.142.468.21.538.328.07.118.07.684-.174 1.372z" />
  </svg>
);

/* ============================================================
   Sidebar widget shell
   ============================================================ */
function SidebarWidget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1rem",
          mb: 2,
          pb: 1.5,
          borderBottom: "2px solid",
          borderColor: "primary.main",
          display: "inline-block",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export default function PublicJobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchJobById, fetchFeaturedJobs, featuredJobs } = useJobs();

  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ---------- Load job by id ---------- */
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = (await fetchJobById(id)) as JobItem | undefined;
        if (!cancelled) setJob(data ?? null);
      } catch {
        if (!cancelled) setJob(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------- Load all jobs for prev/next ---------- */
  useEffect(() => {
    if (!featuredJobs || featuredJobs.length === 0) {
      void fetchFeaturedJobs(100).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Prev / Next ---------- */
  const { prevJob, nextJob } = useMemo<{
    prevJob: JobItem | null;
    nextJob: JobItem | null;
  }>(() => {
    const list = (featuredJobs ?? []).filter((j) => j.isActive !== false);
    if (!id || list.length === 0) return { prevJob: null, nextJob: null };
    const index = list.findIndex((j) => j.jobID === id);
    if (index === -1) return { prevJob: null, nextJob: null };
    return {
      prevJob: index > 0 ? list[index - 1] : null,
      nextJob: index < list.length - 1 ? list[index + 1] : null,
    };
  }, [featuredJobs, id]);

  /* ---------- Share ---------- */
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = job?.title ?? "Job Opening";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch {
        /* cancelled */
      }
    } else {
      await handleCopy();
    }
  };

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareTitle,
    )}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl,
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareTitle} ${shareUrl}`,
    )}`,
  };

  /* ============================================================
     LOADING
     ============================================================ */
  if (loading && !job) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <LandingHeader />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Skeleton
            variant="rounded"
            height={340}
            sx={{ borderRadius: 4, mb: 4 }}
          />
          <Skeleton variant="text" height={48} width="70%" />
          <Skeleton variant="text" height={24} width="40%" sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
        </Container>
        <LandingFooter />
      </Box>
    );
  }

  /* ============================================================
     NOT FOUND
     ============================================================ */
  if (!job) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <LandingHeader />
        <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 } }}>
          <CommonEmptyState
            title="Job not found"
            message="This job may have been removed or the link is incorrect."
            actionLabel="Back to Jobs"
            onAction={() => navigate("/jobs")}
          />
        </Container>
        <LandingFooter />
      </Box>
    );
  }

  const badgeColor = getTypeColor(job.employmentType);

  return (
    <Box
      sx={{
        bgcolor: "grey.50",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LandingHeader />

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ---------- Back row ---------- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              }}
            >
              Back
            </Button>
            <Button
              component={Link}
              to="/jobs"
              endIcon={<ArrowRight size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              All Jobs
            </Button>
          </Box>

          {/* ============================================================
              MAIN LAYOUT — [share bar] [job + sidebar]
             ============================================================ */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 4 }}
            sx={{ alignItems: "flex-start" }}
          >
            {/* ---------- Sticky share toolbar (desktop) ---------- */}
            <Box
              sx={{
                width: { md: 56 },
                flexShrink: 0,
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 96,
                alignSelf: "flex-start",
              }}
            >
              <Stack
                direction="column"
                spacing={1.5}
                sx={{
                  p: 1.5,
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textAlign: "center",
                    mb: 0.5,
                  }}
                >
                  Share
                </Typography>

                <Tooltip title="Copy Link" placement="right">
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{
                      bgcolor: copied ? "success.50" : "background.paper",
                      color: copied ? "success.main" : "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "background.paper",
                        color: "primary.main",
                      },
                    }}
                  >
                    {copied ? <Check size={16} /> : <Link2 size={16} />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share on X" placement="right">
                  <IconButton
                    size="small"
                    component="a"
                    href={shareLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "background.paper",
                        color: "black",
                      },
                    }}
                  >
                    <XIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share on LinkedIn" placement="right">
                  <IconButton
                    size="small"
                    component="a"
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "background.paper",
                        color: "var(--color-linked-in)",
                      },
                    }}
                  >
                    <LinkedinIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share on Facebook" placement="right">
                  <IconButton
                    size="small"
                    component="a"
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "background.paper",
                        color: "var(--color-facebook)",
                      },
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share on WhatsApp" placement="right">
                  <IconButton
                    size="small"
                    component="a"
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: "background.paper",
                        color: "var(--color-whatsapp)",
                      },
                    }}
                  >
                    <WhatsappIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* ---------- Job + Sidebar grid ---------- */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(0, 1fr) 300px",
                },
                gap: { xs: 4, lg: 5 },
              }}
            >
              {/* ============ JOB COLUMN ============ */}
              <Box sx={{ minWidth: 0 }}>
                {/* Header card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3.5, md: 4 },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    mb: 4,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
                  >
                    {job.isFeatured && (
                      <Chip
                        label="Featured"
                        size="small"
                        color="warning"
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1.5,
                          px: 0.5,
                        }}
                      />
                    )}
                    {job.employmentType && (
                      <Chip
                        label={job.employmentType}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                          bgcolor: `color-mix(in srgb, ${badgeColor} 15%, transparent)`,
                          color: badgeColor,
                          border: "none",
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    component="h1"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                      color: "text.primary",
                      mb: 2,
                    }}
                  >
                    {job.title}
                  </Typography>

                  {/* Company row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    <Building2 size={20} />
                    {job.company}
                  </Box>

                  {/* Meta bar */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 3 }}
                    sx={{
                      py: 2.5,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      borderBottom: "1px solid",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 44,
                          height: 44,
                          fontWeight: 700,
                        }}
                      >
                        <Briefcase size={20} />
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "text.primary",
                          }}
                        >
                          {job.company}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.825rem",
                            flexWrap: "wrap",
                            rowGap: 0.5,
                          }}
                        >
                          {job.location && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{ alignItems: "center" }}
                            >
                              <MapPin size={13} />
                              <span>{job.location}</span>
                            </Stack>
                          )}
                          {job.employmentType && (
                            <>
                              <Typography
                                component="span"
                                sx={{ opacity: 0.4 }}
                              >
                                •
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ alignItems: "center" }}
                              >
                                <Clock size={13} />
                                <span>{job.employmentType}</span>
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Tooltip title={saved ? "Saved" : "Save job"}>
                        <IconButton
                          onClick={() => setSaved(!saved)}
                          sx={{
                            color: saved ? "primary.main" : "text.secondary",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Tag size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share job">
                        <IconButton
                          onClick={handleNativeShare}
                          sx={{
                            color: "text.secondary",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Share2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>

                {/* Featured image */}
                {job.image && (
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: { xs: 320, sm: 480, md: 560 },
                      overflow: "hidden",
                      borderRadius: 4,
                      mb: 4,
                      boxShadow:
                        "0 12px 32px -8px rgba(var(--rgb-black), 0.08)",
                    }}
                  >
                    <Box
                      component="img"
                      src={job.image}
                      alt={job.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                )}

                {/* Body card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3.5, md: 4 },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  {/* Quick facts grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    {job.location && (
                      <FactItem
                        icon={<MapPin size={18} />}
                        label="Location"
                        value={job.location}
                        color="primary"
                      />
                    )}
                    {job.experienceLevel && (
                      <FactItem
                        icon={<UserCheck size={18} />}
                        label="Experience"
                        value={`${job.experienceLevel} Level`}
                        color="primary"
                      />
                    )}
                    {job.salaryRange && (
                      <FactItem
                        icon={<DollarSign size={18} />}
                        label="Salary"
                        value={job.salaryRange}
                        color="success"
                      />
                    )}
                    {job.deadline && (
                      <FactItem
                        icon={<Calendar size={18} />}
                        label="Deadline"
                        value={formatDate(job.deadline)}
                        color="warning"
                      />
                    )}
                    {job.contactEmail && (
                      <FactItem
                        icon={<Mail size={18} />}
                        label="Contact"
                        value={job.contactEmail}
                        color="primary"
                      />
                    )}
                    {job.employmentType && (
                      <FactItem
                        icon={<Clock size={18} />}
                        label="Type"
                        value={job.employmentType}
                        color="primary"
                      />
                    )}
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Description */}
                  {job.description && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        About the Role
                      </Typography>
                      {job.description.split(/\n{2,}/).map((p, i) => (
                        <Typography
                          key={i}
                          sx={{
                            fontSize: { xs: "1rem", md: "1.025rem" },
                            lineHeight: 1.8,
                            color: "text.secondary",
                            whiteSpace: "pre-line",
                            mb: 2,
                          }}
                        >
                          {p.trim()}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {/* Contact card */}
                  {job.contactEmail && (
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        border: "1px solid",
                        borderColor: (t) => alpha(t.palette.primary.main, 0.12),
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 4,
                      }}
                    >
                      <Mail
                        size={20}
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
                          href={`mailto:${job.contactEmail}`}
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            textDecoration: "none",
                            wordBreak: "break-all",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {job.contactEmail}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Apply CTA */}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/jobs")}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.4,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Back to Jobs
                    </Button>
                    {job.applyURL ? (
                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        component="a"
                        href={job.applyURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<ExternalLink size={16} />}
                        sx={{
                          borderRadius: 2.5,
                          py: 1.4,
                          textTransform: "none",
                          fontWeight: 700,
                          boxShadow:
                            "0 8px 20px rgba(var(--rgb-primary), 0.25)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow:
                              "0 12px 28px rgba(var(--rgb-primary), 0.35)",
                          },
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        Apply Now
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        component="a"
                        href={`mailto:${job.contactEmail ?? ""}`}
                        endIcon={<Mail size={16} />}
                        sx={{
                          borderRadius: 2.5,
                          py: 1.4,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Contact Employer
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Box>

              {/* ============ SIDEBAR ============ */}
              <Stack
                spacing={3}
                sx={{
                  position: { lg: "sticky" },
                  top: { lg: 96 },
                  alignSelf: "flex-start",
                }}
              >
                {/* Quick Links */}
                <SidebarWidget title="Quick Links">
                  <Stack spacing={0.25}>
                    {QUICK_LINKS.map((link) => (
                      <Box
                        key={link.path}
                        component={Link}
                        to={link.path}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.1,
                          px: 0.5,
                          color: "text.secondary",
                          textDecoration: "none",
                          borderRadius: 1.5,
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "primary.main",
                            bgcolor: "action.hover",
                            pl: 1.25,
                          },
                        }}
                      >
                        {link.label}
                        <ArrowRight size={14} />
                      </Box>
                    ))}
                  </Stack>
                </SidebarWidget>

                {/* Brochure Download */}
                <SidebarWidget title="Brochure Download">
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "grey.50",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          borderRadius: 2,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <FileText size={20} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                        >
                          Alumni Prospectus 2026
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          PDF · 4.2 MB
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      disableElevation
                      startIcon={<Download size={16} />}
                      component="a"
                      href="/files/alumni-prospectus.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1.1,
                      }}
                    >
                      Download Brochure
                    </Button>
                  </Stack>
                </SidebarWidget>

                {/* Contact Us */}
                <SidebarWidget title="Contact Us">
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 2,
                          bgcolor: "rgba(var(--rgb-primary), 0.08)",
                          color: "primary.main",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <MapPin size={18} />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                            mb: 0.35,
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "text.primary",
                            lineHeight: 1.55,
                          }}
                        >
                          {appConfig.address}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 2,
                          bgcolor: "rgba(var(--rgb-primary), 0.08)",
                          color: "primary.main",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Phone size={18} />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                            mb: 0.35,
                          }}
                        >
                          Phone
                        </Typography>
                        <Typography
                          component="a"
                          href={`tel:${appConfig.contactPhone}`}
                          sx={{
                            fontSize: "0.9rem",
                            color: "text.primary",
                            textDecoration: "none",
                            fontWeight: 600,
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {appConfig.contactPhone}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 2,
                          bgcolor: "rgba(var(--rgb-primary), 0.08)",
                          color: "primary.main",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Mail size={18} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                            mb: 0.35,
                          }}
                        >
                          Email
                        </Typography>
                        <Typography
                          component="a"
                          href={`mailto:${appConfig.contactEmail}`}
                          sx={{
                            fontSize: "0.85rem",
                            color: "text.primary",
                            textDecoration: "none",
                            fontWeight: 600,
                            wordBreak: "break-all",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {appConfig.contactEmail}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      component="a"
                      href={appConfig.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<ExternalLink size={14} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        mt: 0.5,
                      }}
                    >
                      Visit Website
                    </Button>
                  </Stack>
                </SidebarWidget>
              </Stack>
            </Box>
          </Stack>

          {/* ============================================================
              PREV / NEXT
             ============================================================ */}
          {(prevJob || nextJob) && (
            <Box
              sx={{
                mt: 6,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {prevJob ? (
                <Box
                  component={Link}
                  to={`/jobs/${prevJob.jobID}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 24px rgba(var(--rgb-black), 0.06)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "rgba(var(--rgb-primary), 0.08)",
                      color: "primary.main",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Briefcase size={22} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-category-orange)",
                        mb: 0.5,
                      }}
                    >
                      ← Previous
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {prevJob.title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box />
              )}

              {nextJob ? (
                <Box
                  component={Link}
                  to={`/jobs/${nextJob.jobID}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                    textAlign: "right",
                    flexDirection: "row-reverse",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 24px rgba(var(--rgb-black), 0.06)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "rgba(var(--rgb-primary), 0.08)",
                      color: "primary.main",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Briefcase size={22} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-category-orange)",
                        mb: 0.5,
                      }}
                    >
                      Next →
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "text.primary",
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {nextJob.title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box />
              )}
            </Box>
          )}

          {/* ---------- Bottom nav ---------- */}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/jobs"
              variant="outlined"
              startIcon={<ArrowLeft size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
              }}
            >
              All Jobs
            </Button>
          </Box>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}

/* ============================================================
   Small fact widget
   ============================================================ */
function FactItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "primary" | "success" | "warning";
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: (t) =>
          color === "success"
            ? alpha(t.palette.success.main, 0.06)
            : color === "warning"
              ? alpha(t.palette.warning.main, 0.06)
              : alpha(t.palette.primary.main, 0.06),
        border: "1px solid",
        borderColor: (t) =>
          color === "success"
            ? alpha(t.palette.success.main, 0.15)
            : color === "warning"
              ? alpha(t.palette.warning.main, 0.15)
              : alpha(t.palette.primary.main, 0.12),
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: 2,
          bgcolor: "background.paper",
          color:
            color === "success"
              ? "success.main"
              : color === "warning"
                ? "warning.main"
                : "primary.main",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "text.secondary",
            mb: 0.25,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "text.primary",
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
