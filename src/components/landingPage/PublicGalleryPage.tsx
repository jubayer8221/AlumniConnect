import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useLanding } from "@/hooks/useLanding";
import type { GalleryPhoto } from "@/store/Slice/landingSlice";
import LandingHeader from "@/components/landingPage/LandingHeader";
import LandingFooter from "@/components/landingPage/LandingFooter";

const PAGE_SIZE = 12;

export default function PublicGalleryPage() {
  const { galleryPhotos, loading, fetchLandingContent } = useLanding();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  const photos = galleryPhotos.filter((p) => p.isActive);
  const shown = photos.slice(0, visible);
  const hasMore = visible < photos.length;

  return (
    <Box sx={{ bgcolor: "var(--color-gray900)", color: "var(--color-white)", minHeight: "100vh" }}>
      <LandingHeader />

      <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {/* Header */}
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
              All Snapshots ({photos.length})
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

          {/* Loading */}
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
              {[...Array(PAGE_SIZE)].map((_, i) => (
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

          {/* Empty */}
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

          {/* Grid */}
          {shown.length > 0 && (
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
              {shown.map((photo) => (
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
          )}

          {/* Load more */}
          {hasMore && (
            <Stack sx={{ alignItems: "center", mt: 5 }}>
              <Button
                variant="outlined"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
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
                Load more ({photos.length - visible} remaining)
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

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

      <LandingFooter />
    </Box>
  );
}
