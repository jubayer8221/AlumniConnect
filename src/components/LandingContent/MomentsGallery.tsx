import { useEffect, useState } from "react";
import { Box, Container, Dialog, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import { useLanding } from "@/hooks/useLanding";
import type { GalleryPhoto } from "@/store/Slice/landingSlice";

export default function MomentsGallery() {
  const { galleryPhotos, fetchLandingContent } = useLanding();
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  const photos = galleryPhotos.filter((p) => p.isActive);

  if (photos.length === 0) return null;

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "var(--color-gray900)",
        color: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* glow orbs */}
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
          {photos.map((photo) => (
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
                backgroundImage: `url('${photo.imageURL}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
              sx={{ width: "100%", borderRadius: 2, display: "block" }}
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
