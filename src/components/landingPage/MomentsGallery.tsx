import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";
import type { GalleryPhoto } from "@/store/Slice/landingSlice";

const PREVIEW_COUNT = 8;

export default function MomentsGallery() {
  const { galleryPhotos, loading, fetchLandingContent } = useLanding();
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  const allPhotos = galleryPhotos.filter((p) => p.isActive);
  const previewPhotos = allPhotos.slice(0, PREVIEW_COUNT);
  const hasMore = allPhotos.length > PREVIEW_COUNT;

  /* ---------- loading state ---------- */
  if (loading && allPhotos.length === 0) {
    return (
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "var(--color-gray900)",
          color: "var(--color-surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Skeleton
              variant="text"
              width={140}
              height={28}
              sx={{ bgcolor: "rgba(var(--rgb-white), 0.08)", mx: "auto", mb: 1.5 }}
            />
            <Skeleton
              variant="text"
              width={320}
              height={56}
              sx={{ bgcolor: "rgba(var(--rgb-white), 0.08)", mx: "auto", mb: 1.5 }}
            />
          </Box>
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
            {[...Array(PREVIEW_COUNT)].map((_, i) => (
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
        </Container>
      </Box>
    );
  }

  /* ---------- empty state ---------- */
  if (allPhotos.length === 0) return null;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "var(--color-gray900)",
        color: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle glow */}
      <Box
        sx={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--rgb-accent), 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--rgb-category-orange), 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              mb: 1.5,
            }}
          >
            Moments Gallery
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Snapshots of Togetherness
          </Typography>
          <Typography
            sx={{
              color: "rgba(var(--rgb-white), 0.65)",
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Every event, every laugh, every hug — captured forever.
          </Typography>
        </Box>

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
          {previewPhotos.map((photo) => (
            <Box
              key={photo.photoID}
              onClick={() => setActive(photo)}
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
          ))}
        </Box>

        {/* View all button */}
        {hasMore && (
          <Box
            sx={{
              textAlign: "center",
              mt: 5,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Button
              component={Link}
              to="/gallery"
              variant="outlined"
              endIcon={<ArrowRight size={16} />}
              sx={{
                color: "var(--color-white)",
                borderColor: "rgba(var(--rgb-white), 0.35)",
                textTransform: "none",
                fontWeight: 600,
                px: 3.5,
                py: 1.25,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "rgba(var(--rgb-white), 0.7)",
                  bgcolor: "rgba(var(--rgb-white), 0.06)",
                },
              }}
            >
              View all {allPhotos.length} moments
            </Button>
          </Box>
        )}
      </Container>

      {/* Lightbox */}
      <Dialog
        open={!!active}
        onClose={() => setActive(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              backgroundImage: "none",
            },
          },
        }}
      >
        {active && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setActive(null)}
              sx={{
                position: "absolute",
                top: -56,
                right: 0,
                color: "var(--color-white)",
                bgcolor: "rgba(var(--rgb-black), 0.4)",
                "&:hover": { bgcolor: "rgba(var(--rgb-black), 0.7)" },
              }}
            >
              <X size={20} />
            </IconButton>
            <Box
              component="img"
              src={active.imageURL}
              alt={active.caption ?? ""}
              sx={{
                width: "100%",
                borderRadius: 2,
                display: "block",
              }}
            />
            {active.caption && (
              <Typography
                sx={{
                  color: "var(--color-white)",
                  textAlign: "center",
                  mt: 2,
                  fontSize: "0.9rem",
                }}
              >
                {active.caption}
              </Typography>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
