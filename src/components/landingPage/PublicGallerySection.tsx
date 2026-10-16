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
import SectionHeader from "@/components/common/SectionHeader";

const PREVIEW_COUNT = 10;

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
          py: 6,
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Skeleton
              variant="text"
              width={140}
              height={28}
              sx={{ bgcolor: "action.hover", mx: "auto", mb: 1.5 }}
            />
            <Skeleton
              variant="text"
              width={320}
              height={56}
              sx={{ bgcolor: "action.hover", mx: "auto", mb: 1.5 }}
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
              gap: 2,
              gridAutoRows: 180,
            }}
          >
            {[...Array(PREVIEW_COUNT)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                sx={{ bgcolor: "action.hover", borderRadius: 3 }}
              />
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (allPhotos.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <SectionHeader
          titleAlign="center"
          // subtitleAlign="center"
          descriptionAlign="center"
          subtitle="Moments Gallery"
          // subtitlePosition="above"
          title="Snapshots of Togetherness"
          titleBorder
          titleBorderColor="primary.main"
          description="Every event, every laugh, every hug — captured forever."
          sx={{ mb: { xs: 5, md: 6 } }}
          action={
            <Button
              component={Link}
              to="/gallery"
              endIcon={<ArrowRight size={16} />}
            >
              View all
            </Button>
          }
        />

        {/* Dense Grid layout prevents empty spaces */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gridAutoFlow: "dense", // Key property: Fills empty grid gaps automatically
            gap: { xs: 1.5, md: 2 },
            gridAutoRows: { xs: 140, md: 180 },
          }}
        >
          {previewPhotos.map((photo, index) => {
            // Safety fallback: ensure span doesn't exceed total photos count to break layout
            const safeSpan = photo.span && photo.span <= 2 ? photo.span : 1;

            return (
              <Box
                key={photo.photoID}
                onClick={() => setActive(photo)}
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
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                    opacity: 0.6,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    "& img": { transform: "scale(1.05)" },
                    "&::after": { opacity: 0.85 },
                  },
                }}
              >
                <Box
                  component="img"
                  src={photo.imageURL}
                  alt={photo.caption ?? "Gallery photo"}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    // Fallback image if localhost image URL fails to load
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80";
                  }}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
                {photo.caption && (
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      right: 12,
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      color: "#fff",
                      zIndex: 2,
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
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

        {/* View all button */}
        {/* {hasMore && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              component={Link}
              to="/gallery"
              variant="outlined"
              endIcon={<ArrowRight size={16} />}
              sx={{
                color: "text.primary",
                borderColor: "divider",
                bgcolor: "background.paper",
                textTransform: "none",
                fontWeight: 600,
                px: 3.5,
                py: 1.25,
                borderRadius: 2.5,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              View all {allPhotos.length} moments
            </Button>
          </Box>
        )} */}
      </Container>

      {/* Lightbox */}
      <Dialog
        open={!!active}
        onClose={() => setActive(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              borderRadius: 3,
              p: 2,
            },
          },
        }}
      >
        {active && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setActive(null)}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <X size={18} />
            </IconButton>
            <Box
              component="img"
              src={active.imageURL}
              alt={active.caption ?? ""}
              sx={{
                width: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            />
            {active.caption && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  mt: 2,
                  fontWeight: 500,
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
