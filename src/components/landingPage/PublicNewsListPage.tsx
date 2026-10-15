import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Divider,
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
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Newspaper,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { slugify } from "@/utils/slugify";
import { NewsItem } from "./PublicNewsSection";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "../common/CommonBanner";
import { CommonButton } from "../common";

const categoryColor: Record<
  string,
  "primary" | "secondary" | "success" | "warning"
> = {
  "0001": "primary",
  "0002": "secondary",
  "0003": "warning",
  Event: "primary",
  Announcement: "secondary",
  Awards: "warning",
};

const categoryLabel: Record<string, string> = {
  "0001": "Event",
  "0002": "Announcement",
  "0003": "Awards",
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PAGE_SIZE_OPTIONS = [9, 18, 36] as const;

export default function PublicNewsListPage() {
  const navigate = useNavigate();
  const { newsList, loading, fetchAllNews } = useNews();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(9);

  useEffect(() => {
    void fetchAllNews({ status: "Published", pageNumber: 1, pageSize: 200 });
  }, [fetchAllNews]);

  /* ---------- Base list ---------- */
  const items: NewsItem[] = useMemo(
    () =>
      (newsList ?? []).filter((n) => n.Status === "Published" && n.IsActive),
    [newsList],
  );

  /* ---------- Search filter ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (n) =>
        (n.Title ?? "").toLowerCase().includes(q) ||
        (n.Summary ?? "").toLowerCase().includes(q) ||
        (n.Content ?? "").toLowerCase().includes(q) ||
        (n.Tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [items, search]);

  /* ---------- Reset to page 1 on search / page-size change ---------- */
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* ---------- Pagination math ---------- */
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paged = useMemo(
    () => filtered.slice(startIdx, endIdx),
    [filtered, startIdx, endIdx],
  );

  /* ---------- Page change → scroll ---------- */
  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    nextPage: number,
  ) => {
    setPage(nextPage);
    document
      .getElementById("news-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const newsStats = [
    {
      icon: <Newspaper size={22} />,
      value: `${items.length}`,
      label: "Published Stories",
    },
    {
      icon: <Bell size={22} />,
      value: "Official",
      label: "Announcements",
    },
    {
      icon: <TrendingUp size={22} />,
      value: "Live",
      label: "Updates",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="News & Updates"
        title="Stories and News from"
        highlightText="Our Community"
        subtitle="Stay informed about campus milestones, institutional achievements, and inspiring spotlights on fellow alumni."
        stats={newsStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ============ Page header + search + back ============ */}
          <Box
            id="news-grid"
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
                All Articles
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
                News & Updates
              </Typography>
              {/* <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  maxWidth: 560,
                }}
              >
                {filtered.length}{" "}
                {filtered.length === 1 ? "article" : "articles"} available
                {search ? ` for "${search}"` : ""}.
              </Typography> */}
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
                placeholder="Search news..."
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

          {/* ============ Loading ============ */}
          {loading && items.length === 0 && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={380}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ============ Empty ============ */}
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
              <Newspaper size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                {search ? "No matching articles" : "No news yet"}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                {search
                  ? "Try a different search term or clear the search."
                  : "Please check back later."}
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

          {/* ============ Cards ============ */}
          {filtered.length > 0 && (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {paged.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.NewsID}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      bgcolor: "background.paper",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-4px)",
                        boxShadow: (t) => t.shadows[6],
                        "& .news-title": { color: "primary.main" },
                        "& .news-image": { transform: "scale(1.05)" },
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/news/${item.NewsID}/${slugify(item.Title)}`}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          pt: "56.25%",
                          bgcolor: "action.hover",
                          overflow: "hidden",
                        }}
                      >
                        {item.Image ? (
                          <Box
                            className="news-image"
                            component="img"
                            src={item.Image}
                            alt={item.Title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/image/logo-small.png";
                            }}
                            sx={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "text.disabled",
                            }}
                          >
                            <Newspaper size={36} />
                          </Box>
                        )}

                        <Chip
                          label={
                            categoryLabel[item.CategoryID] ?? item.CategoryID
                          }
                          size="small"
                          color={categoryColor[item.CategoryID] ?? "default"}
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          p: 2.5,
                          "&:last-child": { pb: 2.5 },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{
                            color: "text.secondary",
                            mb: 1,
                            alignItems: "center",
                          }}
                        >
                          <Calendar size={14} />
                          <Typography
                            sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                          >
                            {formatDate(item.PublishedAt ?? item.CreatedAt)}
                          </Typography>
                        </Stack>

                        <Typography
                          className="news-title"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            lineHeight: 1.4,
                            color: "text.primary",
                            mb: 1,
                            transition: "color 0.2s ease",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.8rem",
                          }}
                        >
                          {item.Title}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            flex: 1,
                          }}
                        >
                          {item.Summary}
                        </Typography>
                      </CardContent>
                    </CardActionArea>

                    <Box sx={{ px: 2.5, pb: 2.5 }}>
                      <Button
                        component={Link}
                        to={`/news/${item.NewsID}/${slugify(item.Title)}`}
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
                        Read More
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ============================================================
              BOTTOM BAR — info + page-size + pagination
             ============================================================ */}
          {filtered.length > 0 && (
            <Box
              sx={{
                mt: 6,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Info + page-size row */}
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
                  {totalCount === 1 ? "article" : "articles"}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
