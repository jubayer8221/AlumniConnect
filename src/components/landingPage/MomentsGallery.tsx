import { useState } from "react";
import { Box, Container, Dialog, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  caption: string;
  span?: 1 | 2; // 2 = larger tile
}

const PHOTOS: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    caption: "Annual Cultural Night 2025",
    span: 2,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    caption: "Graduation Day",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    caption: "Campus Memories",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80",
    caption: "Reunion 2024",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    caption: "Sports Meet",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    caption: "Workshop Session",
    span: 2,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    caption: "Networking Evening",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    caption: "Community Outreach",
  },
];

export default function MomentsGallery() {
  const [active, setActive] = useState<Photo | null>(null);

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#0f172a",
        color: "#ffffff",
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
            "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(194,65,12,0.1) 0%, transparent 70%)",
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
              color: "#7dd3c7",
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
              color: "rgba(255,255,255,0.65)",
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
          {PHOTOS.map((photo) => (
            <Box
              key={photo.id}
              onClick={() => setActive(photo)}
              sx={{
                gridColumn: { md: `span ${photo.span ?? 1}` },
                gridRow: { md: `span ${photo.span === 2 ? 2 : 1}` },
                position: "relative",
                borderRadius: 2.5,
                overflow: "hidden",
                cursor: "pointer",
                backgroundImage: `url('${photo.url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 0.4s ease",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                  opacity: 0.7,
                  transition: "opacity 0.3s",
                },
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                  "&::after": { opacity: 1 },
                },
              }}
            >
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
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                {photo.caption}
              </Typography>
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
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.4)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
            >
              <X size={20} />
            </IconButton>
            <Box
              component="img"
              src={active.url}
              alt={active.caption}
              sx={{
                width: "100%",
                borderRadius: 2,
                display: "block",
              }}
            />
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                mt: 2,
                fontSize: "0.9rem",
              }}
            >
              {active.caption}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
