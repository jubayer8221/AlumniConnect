import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  Paper,
  Avatar,
  Fade,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  Check,
  Link2,
  Newspaper,
  Share2,
  Tag,
  User,
  Clock,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { slugify } from "@/utils/slugify";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import { CommonPageHeader } from "../common";

const CATEGORY_LABEL: Record<string, string> = {
  "0001": "Event & Homecoming",
  "0002": "Announcement",
  "0003": "Awards & Recognition",
};

// Social Icon Helpers
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

export default function PublicNewsDetailsPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const { selectedNews, loading, error, fetchNewsById } = useNews();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ---------- fetch by ID ---------- */
  useEffect(() => {
    if (!id) return;
    void fetchNewsById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------- normalize URL: redirect if slug is missing or incorrect ---------- */
  useEffect(() => {
    if (!selectedNews || !id) return;

    const correctSlug = slugify(selectedNews.Title);
    const currentSlug = slug ?? "";

    if (currentSlug !== correctSlug) {
      navigate(`/news/${id}/${correctSlug}`, { replace: true });
    }
  }, [selectedNews, id, slug, navigate]);

  /* ---------- share links & handlers ---------- */
  const shareUrl = `${window.location.origin}/news/${id}/${slugify(
    selectedNews?.Title ?? "",
  )}`;
  const shareTitle = selectedNews?.Title ?? "News Article";
  const shareSummary = selectedNews?.Summary ?? "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareSummary,
          url: shareUrl,
        });
      } catch {
        /* user cancelled share */
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
      `${shareTitle}${shareUrl}`,
    )}`,
  };

  /* ---------- reading time calculation ---------- */
  const calculateReadingTime = (text?: string) => {
    if (!text) return "1 min read";
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  /* ---------- formatted date ---------- */
  const published = selectedNews?.PublishedAt ?? selectedNews?.CreatedAt;
  const formattedDate = published
    ? new Date(published).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  /* ---------- loading state ---------- */
  if (loading && !selectedNews) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <LandingHeader />
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ borderRadius: 2, mb: 3 }}
          />
          <Skeleton variant="text" width="90%" height={56} />
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
          <Skeleton
            variant="rounded"
            height={400}
            sx={{ my: 4, borderRadius: 4 }}
          />
          <Skeleton variant="text" height={28} sx={{ mt: 2 }} />
          <Skeleton variant="text" height={28} />
          <Skeleton variant="text" height={28} width="80%" />
        </Container>
        <LandingFooter />
      </Box>
    );
  }

  /* ---------- not found / error state ---------- */
  if (!selectedNews || error) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <LandingHeader />
        <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "primary.50",
                color: "primary.main",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Newspaper size={36} />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}
            >
              Article Not Found
            </Typography>
            <Typography
              sx={{ color: "text.secondary", mb: 4, fontSize: "0.95rem" }}
            >
              The article you are looking for might have been moved, deleted, or
              never existed.
            </Typography>
            <Button
              component={Link}
              to="/news"
              variant="contained"
              disableElevation
              startIcon={<ArrowLeft size={18} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
                py: 1.2,
              }}
            >
              Back to News
            </Button>
          </Paper>
        </Container>
        <LandingFooter />
      </Box>
    );
  }

  /* ---------- main article render ---------- */
  const news = selectedNews;

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
          {/* Top navigation back link */}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <CommonPageHeader title="News Details" />
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/news")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                mb: 4,
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              }}
            >
              Back to News
            </Button>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2, md: 2 },
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {/* Header / Meta section */}
            <Box sx={{ mx: "auto", mb: 4 }}>
              {/* Badges */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
              >
                {news.IsBreakingNews && (
                  <Chip
                    label="Breaking News"
                    size="small"
                    color="error"
                    icon={<Sparkles size={14} style={{ color: "inherit" }} />}
                    sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
                  />
                )}
                {news.IsFeatured && (
                  <Chip
                    label="Featured"
                    size="small"
                    color="warning"
                    sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
                  />
                )}
                {news.CategoryID && (
                  <Chip
                    label={CATEGORY_LABEL[news.CategoryID] ?? news.CategoryID}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                      bgcolor: "primary.50",
                      color: "primary.main",
                      border: "none",
                    }}
                  />
                )}
              </Stack>

              {/* Title */}
              <Typography
                component="h3"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  fontSize: { xs: "2rem", sm: "2.75rem", md: "2.25rem" },
                  color: "grey.900",
                  mb: 3,
                }}
              >
                {news.Title}
              </Typography>

              {/* Author and Date bar */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{
                  py: 2.5,
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  xs: "flex-start",
                  sm: "center",
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
                    {news.AuthorID ? (
                      news.AuthorID.charAt(0).toUpperCase()
                    ) : (
                      <User size={20} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "grey.900",
                      }}
                    >
                      {news.AuthorID ?? "Editorial Team"}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ color: "text.secondary", fontSize: "0.825rem" }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Calendar size={13} />
                        <span>{formattedDate}</span>
                      </Stack>
                      <Typography component="span" sx={{ opacity: 0.4 }}>
                        •
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Clock size={13} />
                        <span>{calculateReadingTime(news.Content)}</span>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                {/* Bookmark & Quick Actions */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Tooltip title={saved ? "Saved" : "Save article"}>
                    <IconButton
                      onClick={() => setSaved(!saved)}
                      sx={{
                        color: saved ? "primary.main" : "text.secondary",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Bookmark
                        size={18}
                        fill={saved ? "currentColor" : "none"}
                      />
                    </IconButton>
                  </Tooltip>
                  {/* {navigator.share && ( */}
                  <Tooltip title="Share story">
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
                  {/* )} */}
                </Stack>
              </Stack>
            </Box>

            {/* Featured Image */}
            {news.Image && (
              <Box
                sx={{
                  width: "100%",
                  maxHeight: { xs: 320, sm: 480, md: 560 },
                  overflow: "hidden",
                  borderRadius: 4,
                  mb: 5,
                  boxShadow: "0 12px 32px -8px rgba(var(--rgb-black), 0.08)",
                }}
              >
                <Box
                  component="img"
                  src={news.Image}
                  alt={news.Title}
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    (
                      e.currentTarget as HTMLImageElement
                    ).parentElement!.style.display = "none";
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            )}

            {/* Layout grid with main content and share sidebar */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 4, md: 6 }}
              sx={{ position: "relative" }}
            >
              {/* Floating Share Toolbar (Desktop) */}
              <Box
                sx={{
                  width: { md: 56 },
                  flexShrink: 0,
                  position: { md: "sticky" },
                  top: 96,
                  alignSelf: "flex-start",
                }}
              >
                <Stack
                  direction={{ xs: "row", md: "column" }}
                  spacing={1.5}
                  sx={{
                    p: 1.5,
                    bgcolor: "grey.50",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "center" },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: "none", md: "block" },
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
                        boxShadow: "0 2px 4px rgba(var(--rgb-black), 0.02)",
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
                        boxShadow: "0 2px 4px rgba(var(--rgb-black), 0.02)",
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
                        boxShadow: "0 2px 4px rgba(var(--rgb-black), 0.02)",
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
                        boxShadow: "0 2px 4px rgba(var(--rgb-black), 0.02)",
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
                        boxShadow: "0 2px 4px rgba(var(--rgb-black), 0.02)",
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

              {/* Body Content */}
              <Box sx={{ flexGrow: 1, maxWidth: "720px" }}>
                {/* Executive Summary */}
                {news.Summary && (
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "1.15rem", md: "1.25rem" },
                      lineHeight: 1.6,
                      color: "grey.800",
                      mb: 4,
                      p: 3,
                      bgcolor: "grey.50",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                      borderRadius: "0 12px 12px 0",
                    }}
                  >
                    {news.Summary}
                  </Typography>
                )}

                {/* Article Text */}
                <Typography
                  component="div"
                  sx={{
                    color: "grey.800",
                    lineHeight: 1.85,
                    fontSize: { xs: "1rem", md: "1.075rem" },
                    whiteSpace: "pre-line",
                    fontFamily: "Georgia, serif, sans-serif",
                    "& p": { mb: 3 },
                  }}
                >
                  {news.Content}
                </Typography>

                {/* Tags Section */}
                {news.Tags && news.Tags.length > 0 && (
                  <Box
                    sx={{
                      mt: 6,
                      pt: 4,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          mr: 1,
                        }}
                      >
                        <Tag size={16} />
                        <Typography
                          sx={{ ml: 0.5, fontWeight: 700, fontSize: "0.85rem" }}
                        >
                          Tags:
                        </Typography>
                      </Box>
                      {news.Tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            bgcolor: "grey.100",
                            color: "grey.800",
                            fontWeight: 500,
                            "&:hover": { bgcolor: "grey.200" },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Copy Link Toast Notification */}
                <Fade in={copied}>
                  <Paper
                    elevation={4}
                    sx={{
                      position: "fixed",
                      bottom: 24,
                      right: 24,
                      bgcolor: "grey.900",
                      color: "white",
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      zIndex: 9999,
                    }}
                  >
                    <Check
                      size={18}
                      style={{ color: "var(--color-chart-green)" }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Link copied to clipboard!
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
            </Stack>
          </Paper>

          {/* Bottom navigation */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/news"
              variant="outlined"
              startIcon={<ArrowLeft size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
              }}
            >
              All Articles
            </Button>
          </Box>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
