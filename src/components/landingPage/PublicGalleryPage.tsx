import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";
import type { GalleryPhoto } from "@/store/Slice/landingSlice";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonButton } from "@/components/common";

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;

export default function PublicGalleryPage() {
  const navigate = useNavigate();
  const { galleryPhotos, loading, fetchLandingContent } = useLanding();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  const photos = useMemo(
    () => galleryPhotos.filter((p) => p.isActive),
    [galleryPhotos],
  );

  /* ---------- Reset to page 1 on page-size change ---------- */
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  /* ---------- Pagination math ---------- */
  const totalCount = photos.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paged = useMemo(
    () => photos.slice(startIdx, endIdx),
    [photos, startIdx, endIdx],
  );

  /* ---------- Page change → scroll ---------- */
  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    nextPage: number,
  ) => {
    setPage(nextPage);
    document
      .getElementById("gallery-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const active: GalleryPhoto | null =
    activeIndex !== null && activeIndex >= 0 && activeIndex < photos.length
      ? photos[activeIndex]
      : null;

  /* ---------- Lightbox navigation ---------- */
  const openAt = (idx: number) => setActiveIndex(idx);
  const close = () => setActiveIndex(null);

  const goPrev = useCallback(() => {
    setActiveIndex((idx) => {
      if (idx === null || photos.length === 0) return idx;
      return (idx - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const goNext = useCallback(() => {
    setActiveIndex((idx) => {
      if (idx === null || photos.length === 0) return idx;
      return (idx + 1) % photos.length;
    });
  }, [photos.length]);

  /* ---------- Keyboard support ---------- */
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goPrev, goNext]);

  /* ---------- Banner stats ---------- */
  const bannerStats = [
    {
      icon: <ImageIcon size={22} />,
      value: `${photos.length}`,
      label: "Snapshots",
    },
    {
      icon: <ImageIcon size={22} />,
      value: "Curated",
      label: "Moments",
    },
    {
      icon: <ImageIcon size={22} />,
      value: "Live",
      label: "Gallery",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <LandingHeader />

      {/* ---------- Banner ---------- */}
      <CommonBanner
        badge="Moments Gallery"
        title="Snapshots of"
        highlightText="Togetherness"
        subtitle="Every event, every laugh, every hug — captured forever."
        stats={bannerStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ---------- Page header + back ---------- */}
          <Box
            id="gallery-grid"
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
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Moments Gallery
              </Typography>
            </Box>

            <CommonButton
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                whiteSpace: "nowrap",
                alignSelf: { xs: "flex-start", md: "auto" },
              }}
            >
              Back
            </CommonButton>
          </Box>

          {/* ---------- Loading ---------- */}
          {loading && photos.length === 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 1.5, md: 2 },
                gridAutoRows: { xs: 140, md: 180 },
              }}
            >
              {[...Array(pageSize)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  sx={{
                    bgcolor: "action.hover",
                    borderRadius: 2.5,
                  }}
                />
              ))}
            </Box>
          )}

          {/* ---------- Empty ---------- */}
          {!loading && photos.length === 0 && (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ color: "text.secondary" }}>
                No photos yet. Check back soon.
              </Typography>
            </Box>
          )}

          {/* ---------- Grid with Dense Flow ---------- */}
          {paged.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gridAutoFlow: "dense",
                gap: { xs: 1.5, md: 2 },
                gridAutoRows: { xs: 140, md: 180 },
              }}
            >
              {paged.map((photo, idx) => {
                const globalIdx = startIdx + idx;
                const safeSpan = photo.span && photo.span <= 2 ? photo.span : 1;

                return (
                  <Box
                    key={photo.photoID}
                    onClick={() => openAt(globalIdx)}
                    sx={{
                      gridColumn: {
                        xs: "span 1",
                        md: `span ${safeSpan}`,
                      },
                      gridRow: {
                        xs: "span 1",
                        md: safeSpan === 2 ? "span 2" : "span 1",
                      },
                      position: "relative",
                      borderRadius: 2.5,
                      overflow: "hidden",
                      cursor: "pointer",
                      bgcolor: "action.hover",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.4s ease",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 55%)",
                        opacity: 0.6,
                        transition: "opacity 0.3s",
                      },
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        "&::after": { opacity: 0.9 },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.imageURL}
                      alt={photo.caption ?? ""}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80";
                      }}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {photo.caption && (
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          right: 12,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#fff",
                          zIndex: 2,
                          textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {photo.caption}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ============================================================
              BOTTOM BAR — info + page-size + pagination
             ============================================================ */}
          {photos.length > 0 && (
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
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  }}
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
                  {totalCount === 1 ? "photo" : "photos"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    }}
                  >
                    Per page:
                  </Typography>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{
                      minWidth: 80,
                      color: "text.primary",
                      bgcolor: "background.paper",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 2,
                        borderColor: "divider",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "text.secondary",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "text.secondary",
                      },
                    }}
                    MenuProps={{
                      slotProps: {
                        paper: {
                          sx: { bgcolor: "background.paper" },
                        },
                      },
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem
                        key={size}
                        value={size}
                        sx={{ color: "text.primary" }}
                      >
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Box>

              {/* Pagination */}
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
                  />
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* ============================================================
          LIGHTBOX
         ============================================================ */}
      <Dialog
        open={activeIndex !== null}
        onClose={close}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              backgroundImage: "none",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              m: 2,
              p: { xs: 2, md: 3 },
            },
          },
          backdrop: {
            sx: {
              bgcolor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            },
          },
        }}
      >
        {active && (
          <Box sx={{ position: "relative" }}>
            {/* Header bar */}
            <Box
              sx={{
                pb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {active.caption ?? "Gallery Photo"}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  {(activeIndex ?? 0) + 1} of {photos.length}
                </Typography>
              </Box>

              <IconButton
                onClick={close}
                aria-label="Close"
                size="small"
                sx={{
                  flexShrink: 0,
                  color: "text.secondary",
                  bgcolor: "action.hover",
                  "&:hover": {
                    bgcolor: "action.selected",
                    color: "text.primary",
                  },
                }}
              >
                <X size={18} />
              </IconButton>
            </Box>

            {/* Image */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover",
                minHeight: { xs: 300, md: 520 },
                maxHeight: "75vh",
                p: { xs: 1, md: 2 },
                mt: 2,
                borderRadius: 2,
              }}
            >
              {photos.length > 1 && (
                <IconButton
                  onClick={goPrev}
                  aria-label="Previous"
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: 16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "text.primary",
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ChevronLeft size={22} />
                </IconButton>
              )}

              <Box
                component="img"
                src={active.imageURL}
                alt={active.caption ?? ""}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 2,
                  display: "block",
                }}
              />

              {photos.length > 1 && (
                <IconButton
                  onClick={goNext}
                  aria-label="Next"
                  sx={{
                    position: "absolute",
                    right: { xs: 8, md: 16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "text.primary",
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ChevronRight size={22} />
                </IconButton>
              )}
            </Box>

            {/* Caption footer */}
            {active.caption && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {active.caption}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Dialog>

      <LandingFooter />
    </Box>
  );
}
