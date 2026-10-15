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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Share2,
  Tag,
  User,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { slugify } from "@/utils/slugify";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import { CommonPageHeader } from "../common";
import { appConfig } from "@/config/appConfig";

const CATEGORY_LABEL: Record<string, string> = {
  "0001": "Event & Homecoming",
  "0002": "Announcement",
  "0003": "Awards & Recognition",
};

/* ---------- Quick Links (sidebar widget) ---------- */
const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "About the Academy", path: "/about" },
  { label: "Upcoming Events", path: "/events" },
  { label: "News & Updates", path: "/news" },
  { label: "Moments Gallery", path: "/gallery" },
  { label: "Mentorship", path: "/mentorship" },
  { label: "Alumni Directory", path: "/alumni/network/directory" },
  { label: "Job Board", path: "/alumni/explore/job-board" },
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

/* ============================================================
   Article body renderer — paragraphs + blockquotes
   ============================================================ */
function renderArticleContent(content: string) {
  const paragraphs = (content ?? "").split(/\n{2,}/);

  return paragraphs.map((raw, index) => {
    const text = raw.trim();
    if (!text) return null;

    if (text.startsWith(">")) {
      const quoteText = text.replace(/^>\s?/, "").trim();
      return (
        <Box
          key={index}
          component="blockquote"
          sx={{
            position: "relative",
            my: 4,
            mx: 0,
            p: { xs: 3, md: 4 },
            pl: { xs: 3.5, md: 4.5 },
            borderRadius: 3,
            bgcolor: "var(--color-dark-forest-surface)",
            color: "var(--color-off-white)",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: 4,
              bgcolor: "var(--color-accent)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "var(--color-off-white)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {quoteText}
          </Typography>
          <Typography
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: 12, md: 20 },
              bottom: { xs: -12, md: -20 },
              fontSize: { xs: "4rem", md: "6rem" },
              lineHeight: 1,
              fontWeight: 900,
              fontFamily: "Georgia, serif",
              color: "rgba(255,255,255,0.08)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            &rdquo;
          </Typography>
        </Box>
      );
    }

    return (
      <Typography
        key={index}
        component="p"
        sx={{
          color: "text.primary",
          lineHeight: 1.85,
          fontSize: { xs: "1rem", md: "1.075rem" },
          fontFamily: "Georgia, 'Times New Roman', serif",
          mb: 3,
        }}
      >
        {text}
      </Typography>
    );
  });
}

export default function PublicNewsDetailsPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const {
    selectedNews,
    newsList,
    loading,
    error,
    fetchNewsById,
    fetchAllNews,
  } = useNews();

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    void fetchNewsById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!newsList || newsList.length === 0) {
      void fetchAllNews({ status: "Published", pageNumber: 1, pageSize: 50 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedNews || !id) return;
    const correctSlug = slugify(selectedNews.Title);
    const currentSlug = slug ?? "";
    if (currentSlug !== correctSlug) {
      navigate(`/news/${id}/${correctSlug}`, { replace: true });
    }
  }, [selectedNews, id, slug, navigate]);

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
      /* ignore */
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
        /* ignore */
      }
    } else {
      await handleCopy();
    }
  };

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
  };

  const calculateReadingTime = (text?: string) => {
    if (!text) return "1 min read";
    const words = text.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const published = selectedNews?.PublishedAt ?? selectedNews?.CreatedAt;
  const formattedDate = published
    ? new Date(published).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const { prevArticle, nextArticle } = useMemo(() => {
    if (!newsList || newsList.length === 0 || !id) {
      return { prevArticle: null, nextArticle: null };
    }
    const publishedList = newsList.filter(
      (n) => n.Status === "Published" && n.IsActive,
    );
    const index = publishedList.findIndex((n) => n.NewsID === id);
    if (index === -1) return { prevArticle: null, nextArticle: null };
    return {
      prevArticle: index > 0 ? publishedList[index - 1] : null,
      nextArticle:
        index < publishedList.length - 1 ? publishedList[index + 1] : null,
    };
  }, [newsList, id]);

  if (loading && !selectedNews) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
        <LandingHeader />
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
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
          {/* Back row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <CommonPageHeader title="News Details" />
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/news")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              }}
            >
              Back to News
            </Button>
          </Box>

          {/* ============================================================
              MAIN LAYOUT
              ─ Desktop: [share 56px] [article + sidebar grid]
              ─ Within grid: [article 1fr] [sidebar 300px]
             ============================================================ */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 4 }}
            sx={{ alignItems: "flex-start" }}
          >
            {/* ---- Sticky share toolbar (hidden on mobile) ---- */}
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

            {/* ---- Article + Sidebar grid ---- */}
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
              {/* ============ ARTICLE COLUMN ============ */}
              <Box sx={{ minWidth: 0 }}>
                {/* Header */}
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
                    {news.IsBreakingNews && (
                      <Chip
                        label="Breaking News"
                        size="small"
                        color="error"
                        icon={
                          <Sparkles size={14} style={{ color: "inherit" }} />
                        }
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
                        label={
                          CATEGORY_LABEL[news.CategoryID] ?? news.CategoryID
                        }
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

                  <Typography
                    component="h1"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.2,
                      fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                      color: "text.primary",
                      mb: 3,
                    }}
                  >
                    {news.Title}
                  </Typography>

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
                            color: "text.primary",
                          }}
                        >
                          {news.AuthorID ?? "Editorial Team"}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.825rem",
                          }}
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
                    </Stack>
                  </Stack>
                </Paper>

                {/* Featured image */}
                {news.Image && (
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

                {/* Body */}
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
                  {news.Summary && (
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        lineHeight: 1.65,
                        color: "text.primary",
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

                  <Box>{renderArticleContent(news.Content ?? "")}</Box>

                  {/* Tags + inline share */}
                  <Box
                    sx={{
                      mt: 6,
                      pt: 3,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        flexWrap: "wrap",
                        gap: 1,
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      {news.Tags && news.Tags.length > 0 ? (
                        news.Tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 1.5,
                              borderColor: "divider",
                              bgcolor: "background.paper",
                              fontWeight: 500,
                              fontSize: "0.8rem",
                              "&:hover": {
                                borderColor: "primary.main",
                                color: "primary.main",
                              },
                            }}
                          />
                        ))
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.secondary",
                          }}
                        >
                          <Tag size={14} />
                          <Typography variant="caption">No tags</Typography>
                        </Box>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "text.primary",
                          mr: 0.5,
                        }}
                      >
                        Share:
                      </Typography>
                      <IconButton
                        size="small"
                        component="a"
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "text.primary",
                          "&:hover": { color: "var(--color-facebook)" },
                        }}
                      >
                        <FacebookIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        component="a"
                        href={shareLinks.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "text.primary",
                          "&:hover": { color: "black" },
                        }}
                      >
                        <XIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        component="a"
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "text.primary",
                          "&:hover": { color: "var(--color-linked-in)" },
                        }}
                      >
                        <LinkedinIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        component="a"
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "text.primary",
                          "&:hover": { color: "var(--color-whatsapp)" },
                        }}
                      >
                        <WhatsappIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              </Box>

              {/* ============================================================
                  RIGHT SIDEBAR
                 ============================================================ */}
              <Stack
                spacing={3}
                sx={{
                  position: { lg: "sticky" },
                  top: { lg: 96 },
                  alignSelf: "flex-start",
                }}
              >
                {/* ---- Quick Links ---- */}
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

                {/* ---- Contact Us ---- */}
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
              Prev / Next
             ============================================================ */}
          {(prevArticle || nextArticle) && (
            <Box
              sx={{
                mt: 6,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {prevArticle ? (
                <Box
                  component={Link}
                  to={`/news/${prevArticle.NewsID}/${slugify(prevArticle.Title)}`}
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
                      borderRadius: "50%",
                      overflow: "hidden",
                      bgcolor: "grey.100",
                      "& img": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  >
                    {prevArticle.Image && (
                      <Box
                        component="img"
                        src={prevArticle.Image}
                        alt={prevArticle.Title}
                      />
                    )}
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
                      {prevArticle.Title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box />
              )}

              {nextArticle ? (
                <Box
                  component={Link}
                  to={`/news/${nextArticle.NewsID}/${slugify(nextArticle.Title)}`}
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
                      borderRadius: "50%",
                      overflow: "hidden",
                      bgcolor: "grey.100",
                      "& img": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  >
                    {nextArticle.Image && (
                      <Box
                        component="img"
                        src={nextArticle.Image}
                        alt={nextArticle.Title}
                      />
                    )}
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
                      {nextArticle.Title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box />
              )}
            </Box>
          )}

          {/* ============================================================
              Leave a Comment
             ============================================================ */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Leave a Comment
            </Typography>
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.9rem", mb: 3 }}
            >
              Your email address will not be published. Required fields are
              marked *
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                setCommentSubmitted(true);
                setTimeout(() => setCommentSubmitted(false), 3500);
              }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="Your Name *"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                />
                <TextField
                  required
                  fullWidth
                  type="email"
                  size="small"
                  placeholder="Email Address *"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                />
              </Stack>

              <TextField
                fullWidth
                size="small"
                placeholder="Website (optional)"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />

              <TextField
                required
                fullWidth
                multiline
                rows={5}
                placeholder="Write your comment here... *"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  endIcon={<ArrowRight size={16} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    px: 3.5,
                    py: 1.2,
                  }}
                >
                  Post Comment
                </Button>
              </Box>

              <Fade in={commentSubmitted}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: "success.main",
                    mt: 1,
                  }}
                >
                  <Check size={16} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Thanks! Your comment has been posted.
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Box>

          {/* Bottom nav */}
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
