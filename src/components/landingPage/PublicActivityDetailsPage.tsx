import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
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
} from "@mui/material";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonButton } from "@/components/common";
import { ACTIVITIES } from "@/data/activities";

const PAGE_SIZE_OPTIONS = [9, 18, 36] as const;

export default function PublicActivitiesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(9);

  /* ---------- Search filter ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ACTIVITIES;
    return ACTIVITIES.filter(
      (a) =>
        (a.title ?? "").toLowerCase().includes(q) ||
        (a.excerpt ?? "").toLowerCase().includes(q) ||
        (a.content ?? "").toLowerCase().includes(q) ||
        (a.category ?? "").toLowerCase().includes(q),
    );
  }, [search]);

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
      .getElementById("activities-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const bannerStats = [
    {
      icon: <Bell size={22} />,
      value: `${ACTIVITIES.length}`,
      label: "Announcements",
    },
    {
      icon: <CalendarDays size={22} />,
      value: "Weekly",
      label: "Updates",
    },
    {
      icon: <TrendingUp size={22} />,
      value: "Live",
      label: "From the Desk",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="From The Desk"
        title="Our Day-to-Day"
        highlightText="Activities"
        subtitle="News, announcements, and updates straight from the alumni office."
        stats={bannerStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ============ Page header + search + back ============ */}
          <Box
            id="activities-grid"
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
                Activities
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
                Our Day-to-Day Activities
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  maxWidth: 560,
                }}
              >
                {filtered.length} {filtered.length === 1 ? "story" : "stories"}{" "}
                available
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
                placeholder="Search activities..."
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
          {filtered.length === 0 && !search && (
            <Grid container spacing={3}>
              {[0, 1, 2].map((i) => (
                <Grid key={i} size={{ xs: 12, md: 4 }}>
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
          {filtered.length === 0 && search && (
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
              <Bell size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                No matching activities
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Try a different search term or clear the search.
              </Typography>
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
            </Box>
          )}

          {/* ============ Cards ============ */}
          {filtered.length > 0 && (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {paged.map((post) => (
                <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "background.paper",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: (t) => t.shadows[6],
                        borderColor: "primary.main",
                        "& .post-image": { transform: "scale(1.06)" },
                        "& .post-title": { color: "primary.dark" },
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/activities/${post.id}`}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 180,
                          overflow: "hidden",
                          bgcolor: "action.hover",
                        }}
                      >
                        <Box
                          className="post-image"
                          component="img"
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          sx={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            bgcolor: "rgba(var(--rgb-white), 0.95)",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            color: post.color,
                          }}
                        >
                          {post.icon}
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              letterSpacing: "0.03em",
                            }}
                          >
                            {post.category}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Body */}
                      <CardContent
                        sx={{
                          p: 2.5,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          "&:last-child": { pb: 2.5 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            mb: 1,
                            fontWeight: 500,
                          }}
                        >
                          {post.date}
                        </Typography>

                        <Typography
                          className="post-title"
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            lineHeight: 1.4,
                            mb: 1,
                            color: "primary.main",
                            transition: "color 0.2s ease",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.8rem",
                          }}
                        >
                          {post.title}
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
                          {post.excerpt}
                        </Typography>
                      </CardContent>
                    </CardActionArea>

                    {/* Read More */}
                    <Box sx={{ px: 2.5, pb: 2.5 }}>
                      <Button
                        component={Link}
                        to={`/activities/${post.id}`}
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowUpRight size={16} />}
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
                  {totalCount === 1 ? "story" : "stories"}
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
