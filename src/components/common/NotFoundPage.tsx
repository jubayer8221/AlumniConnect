import { useEffect, useRef } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Image as ImageIcon,
  Newspaper,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "../landingPage/LandingHeader";
import LandingFooter from "../landingPage/LandingFooter";

type NotFoundPageProps = {
  homePath?: string;
};

const QUICK_LINKS = [
  { label: "Events", to: "/events", icon: <CalendarDays size={20} /> },
  { label: "News", to: "/news", icon: <Newspaper size={20} /> },
  { label: "Gallery", to: "/gallery", icon: <ImageIcon size={20} /> },
  { label: "Directory", to: "/alumni/directory", icon: <Users size={20} /> },
];

export default function NotFoundPage({ homePath = "/" }: NotFoundPageProps) {
  const navigate = useNavigate();
  const spotlightRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef({ x: 0, y: 0 });

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerPositionRef.current = { x: e.clientX, y: e.clientY };
    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      const { x, y } = pointerPositionRef.current;
      spotlightRef.current?.style.setProperty("--pointer-x", `${x}px`);
      spotlightRef.current?.style.setProperty("--pointer-y", `${y}px`);
      animationFrameRef.current = null;
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <LandingHeader />

      <Box
        component="main"
        onPointerMove={handlePointerMove}
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Soft warm glows in the corners */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-primary), 0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            bottom: -180,
            left: -180,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--rgb-category-orange), 0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Pointer spotlight — desktop only */}
        <Box
          ref={spotlightRef}
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px circle at var(--pointer-x, 50vw) var(--pointer-y, 50vh), rgba(var(--rgb-primary), 0.08), transparent 45%)",
            pointerEvents: "none",
            transition: "background 0.15s ease-out",
            display: { xs: "none", md: "block" },
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 999,
                bgcolor: "rgba(var(--rgb-primary), 0.08)",
                border: "1px solid rgba(var(--rgb-primary), 0.18)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "var(--color-primary)",
                  boxShadow: "0 0 10px var(--color-primary)",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "primary.main",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Page not found
              </Typography>
            </Box>

            {/* Big 404 */}
            <Typography
              sx={{
                fontSize: { xs: "6rem", sm: "10rem", md: "12rem" },
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                background:
                  "linear-gradient(180deg, var(--color-primary) 0%, rgba(var(--rgb-primary), 0.12) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                userSelect: "none",
                m: 0,
              }}
            >
              404
            </Typography>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "text.primary",
                lineHeight: 1.2,
                mt: -1,
              }}
            >
              Looks like you've wandered off campus
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                lineHeight: 1.7,
              }}
            >
              The page you're looking for may have moved, been renamed, or never
              existed. But don't worry — the alumni community is just a click
              away.
            </Typography>

            {/* CTAs */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                pt: 1,
                width: { xs: "100%", sm: "auto" },
                alignItems: "stretch",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate(homePath)}
                startIcon={<ArrowLeft size={18} />}
                sx={{
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  bgcolor: "primary.main",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                Back to Home
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1.25,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Go Back
              </Button>
            </Stack>

            {/* Quick links */}
            <Box sx={{ width: "100%", pt: 3 }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Or explore these
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {QUICK_LINKS.map((link) => (
                  <Box
                    key={link.label}
                    component={Link}
                    to={link.to}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      py: 2,
                      px: 1,
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      color: "text.primary",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-3px)",
                        boxShadow: 3,
                        "& .quick-icon": {
                          bgcolor: "primary.main",
                          color: "common.white",
                        },
                      },
                    }}
                  >
                    <Box
                      className="quick-icon"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "rgba(var(--rgb-primary), 0.08)",
                        color: "primary.main",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {link.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
