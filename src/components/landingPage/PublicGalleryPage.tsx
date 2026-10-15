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
  /* The lightbox navigates across ALL photos, not just the current page. */
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
        bgcolor: "var(--color-gray900)",
        color: "var(--color-white)",
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
              {/* <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  mb: 1,
                }}
              >
                All Photos
              </Typography> */}
              <Typography
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--color-white)",
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
                    bgcolor: "rgba(var(--rgb-white), 0.06)",
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
                borderColor: "rgba(var(--rgb-white), 0.2)",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ color: "rgba(var(--rgb-white), 0.65)" }}>
                No photos yet. Check back soon.
              </Typography>
            </Box>
          )}

          {/* ---------- Grid ---------- */}
          {paged.length > 0 && (
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
              {paged.map((photo, idx) => {
                /* The lightbox index is global across all photos, not the slice. */
                const globalIdx = startIdx + idx;
                return (
                  <Box
                    key={photo.photoID}
                    onClick={() => openAt(globalIdx)}
                    sx={{
                      gridColumn: { md: `span ${photo.span ?? 1}` },
                      gridRow: { md: `span ${photo.span === 2 ? 2 : 1}` },
                      position: "relative",
                      borderRadius: 2.5,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(var(--rgb-black), 0.65) 0%, transparent 55%)",
                        opacity: 0.7,
                        transition: "opacity 0.3s",
                      },
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 20px 40px rgba(var(--rgb-black), 0.35)",
                        "&::after": { opacity: 1 },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.imageURL}
                      alt={photo.caption ?? ""}
                      loading="lazy"
                      decoding="async"
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
                          color: "var(--color-white)",
                          zIndex: 2,
                          textShadow: "0 1px 4px rgba(var(--rgb-black), 0.6)",
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
                borderColor: "rgba(var(--rgb-white), 0.12)",
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
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(var(--rgb-white), 0.7)",
                  }}
                >
                  Showing{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "var(--color-white)" }}
                  >
                    {totalCount === 0 ? 0 : startIdx + 1}–{endIdx}
                  </Box>{" "}
                  of{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "var(--color-white)" }}
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
                      color: "rgba(var(--rgb-white), 0.7)",
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
                      color: "var(--color-white)",
                      bgcolor: "rgba(var(--rgb-white), 0.04)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 2,
                        borderColor: "rgba(var(--rgb-white), 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(var(--rgb-white), 0.4)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-accent)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "rgba(var(--rgb-white), 0.7)",
                      },
                    }}
                    MenuProps={{
                      slotProps: {
                        paper: {
                          sx: { bgcolor: "var(--color-gray900)" },
                        },
                      },
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem
                        key={size}
                        value={size}
                        sx={{ color: "var(--color-white)" }}
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
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontWeight: 600,
                        borderRadius: 2,
                        color: "var(--color-white)",
                        borderColor: "rgba(var(--rgb-white), 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(var(--rgb-white), 0.08)",
                        },
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "var(--color-primary)",
                        color: "var(--color-white)",
                        "&:hover": {
                          bgcolor: "var(--color-primary-hover)",
                        },
                      },
                    }}
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
              bgcolor: "rgba(0,0,0,0.92)",
              backgroundImage: "none",
              boxShadow: "none",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              m: 2,
            },
          },
          backdrop: {
            sx: {
              bgcolor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            },
          },
        }}
      >
        {active && (
          <Box sx={{ position: "relative" }}>
            {/* Header bar */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "rgba(var(--rgb-white), 0.1)",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "var(--color-white)",
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
                    color: "rgba(var(--rgb-white), 0.6)",
                    fontSize: "0.75rem",
                  }}
                >
                  {(activeIndex ?? 0) + 1} of {photos.length}
                </Typography>
              </Box>

              <IconButton
                onClick={close}
                aria-label="Close"
                sx={{
                  flexShrink: 0,
                  color: "var(--color-white)",
                  bgcolor: "rgba(var(--rgb-white), 0.1)",
                  border: "1px solid rgba(var(--rgb-white), 0.15)",
                  "&:hover": {
                    bgcolor: "rgba(var(--rgb-white), 0.2)",
                    color: "var(--color-accent)",
                  },
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Image */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.4)",
                minHeight: { xs: 300, md: 520 },
                maxHeight: "75vh",
                p: { xs: 2, md: 3 },
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
                    color: "var(--color-white)",
                    bgcolor: "rgba(var(--rgb-black), 0.5)",
                    border: "1px solid rgba(var(--rgb-white), 0.15)",
                    "&:hover": {
                      bgcolor: "rgba(var(--rgb-black), 0.8)",
                      color: "var(--color-accent)",
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
                    color: "var(--color-white)",
                    bgcolor: "rgba(var(--rgb-black), 0.5)",
                    border: "1px solid rgba(var(--rgb-white), 0.15)",
                    "&:hover": {
                      bgcolor: "rgba(var(--rgb-black), 0.8)",
                      color: "var(--color-accent)",
                    },
                  }}
                >
                  <ChevronRight size={22} />
                </IconButton>
              )}
            </Box>

            {/* Caption footer */}
            {active.caption && (
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: "1px solid",
                  borderColor: "rgba(var(--rgb-white), 0.1)",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--color-white)",
                    textAlign: "center",
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
