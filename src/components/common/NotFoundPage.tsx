import { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NotFoundPageProps = {
  homePath?: string;
};

export default function NotFoundPage({ homePath = "/" }: NotFoundPageProps) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-gray950)",
        color: "var(--color-gray50)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Dynamic Cursor Spotlight / Radial Glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--rgb-chart-blue), 0.12), transparent 40%)`,
          pointerEvents: "none",
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Grid Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(var(--rgb-white), 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(var(--rgb-white), 0.03) 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-black) 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-black) 70%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 10 }}>
        <Stack
          spacing={4}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* Status Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: "9999px",
              backgroundColor: "rgba(var(--rgb-white), 0.03)",
              border: "1px solid rgba(var(--rgb-white), 0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--color-chart-blue)",
                boxShadow: "0 0 10px var(--color-chart-blue)",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-gray400)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Error Code 404
            </Typography>
          </Box>

          {/* Hero Glitch-Effect 404 Watermark */}
          <Box sx={{ position: "relative" }}>
            <Typography
              sx={{
                fontSize: { xs: "7rem", sm: "11rem", md: "14rem" },
                fontWeight: 900,
                lineHeight: 0.8,
                letterSpacing: "-0.06em",
                background:
                  "linear-gradient(180deg, rgba(var(--rgb-white), 0.15) 0%, rgba(var(--rgb-white), 0.01) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                userSelect: "none",
              }}
            >
              404
            </Typography>

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.75rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--color-surface)",
                }}
              >
                Lost in the deep end?
              </Typography>
            </Box>
          </Box>

          {/* Subtitle */}
          <Typography
            sx={{
              color: "var(--color-gray400)",
              maxWidth: 460,
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              lineHeight: 1.6,
              mt: -2,
            }}
          >
            The page you're searching for has either migrated to another node or
            doesn't exist anymore.
          </Typography>

          {/* Action Callouts */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate(homePath)}
              endIcon={<MoveRight size={18} />}
              sx={{
                borderRadius: "12px",
                px: 3.5,
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-gray950)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--color-gray50)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 24px -8px rgba(var(--rgb-white), 0.3)",
                },
              }}
            >
              Return to Dashboard
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                borderRadius: "12px",
                px: 3.5,
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                borderColor: "rgba(var(--rgb-white), 0.12)",
                color: "var(--color-gray300)",
                backgroundColor: "rgba(var(--rgb-white), 0.02)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "rgba(var(--rgb-white), 0.25)",
                  backgroundColor: "rgba(var(--rgb-white), 0.05)",
                  color: "var(--color-surface)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
