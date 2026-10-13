import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  TrendingUp,
  Globe,
  Target,
  Star,
  CalendarDays,
  Building2,
  type LucideProps,
} from "lucide-react";
import type { ComponentType, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  users: Users,
  award: Award,
  trending: TrendingUp,
  globe: Globe,
  target: Target,
  star: Star,
  calendar: CalendarDays,
  building: Building2,
};

export function getIcon(key: string, size = 18) {
  const Icon = ICONS[key] ?? Star;
  return <Icon size={size} />;
}

export const ICON_KEYS = Object.keys(ICONS);

const AUTOPLAY_MS = 6000;

const FALLBACK_SLIDE = {
  slideID: "default",
  image: null,
  badge: "Alumni Network",
  title: "Connected by memories, united for the future.",
  subtitle:
    "Reconnect with your community, share your experience, and build lasting connections.",
  tag: null,
  displayOrder: 0,
  isActive: true,
};

// Fade only: no translate or movement.
const fadeIn = keyframes`
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
`;

export default function HeroSection() {
  const navigate = useNavigate();

  const { heroSlides, heroStats, fetchLandingContent } = useLanding();

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Keep the selected slide index valid when slides are added or removed.
  useEffect(() => {
    setCurrent((index) =>
      heroSlides.length > 0 ? index % heroSlides.length : 0,
    );
  }, [heroSlides.length]);

  const next = useCallback(() => {
    setCurrent((index) =>
      heroSlides.length > 0 ? (index + 1) % heroSlides.length : 0,
    );
  }, [heroSlides.length]);

  const prev = useCallback(() => {
    setCurrent((index) =>
      heroSlides.length > 0
        ? (index - 1 + heroSlides.length) % heroSlides.length
        : 0,
    );
  }, [heroSlides.length]);

  // Auto-play without restarting the timer on every render.
  useEffect(() => {
    if (paused || reducedMotion || heroSlides.length < 2) return;

    const timer = window.setInterval(next, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, heroSlides.length, next]);

  const slides = heroSlides.length > 0 ? heroSlides : [FALLBACK_SLIDE];
  const slide = slides[current];

  const titleNode = useMemo(() => {
    if (!slide?.title) return null;

    const highlightStyle = {
      background:
        "linear-gradient(135deg, var(--color-accent) 0%, var(--color-category-warm) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };

    // The words you want to highlight
    const HIGHLIGHT_WORDS = ["memories", "opportunities", "gatherings"];

    // Split the title on any of those words (case-insensitive), keeping them
    const parts = slide.title.split(/(memories|opportunities|gatherings)/gi);

    return (
      <>
        {parts.map((part, i) => {
          const isHighlight = HIGHLIGHT_WORDS.some(
            (w) => w.toLowerCase() === part.toLowerCase(),
          );

          return isHighlight ? (
            <Box key={i} component="span" sx={highlightStyle}>
              {part}
            </Box>
          ) : (
            <Box key={i} component="span">
              {part}
            </Box>
          );
        })}
      </>
    );
  }, [slide?.title]);

  return (
    <Box
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      sx={{
        position: "relative",
        isolation: "isolate",
        minHeight: { xs: "auto", md: "99vh" },
        display: "flex",
        alignItems: "center",
        color: "var(--color-surface)",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 40%, var(--color-dark-forest-surface) 100%)",
        pt: { xs: 12, md: 16 },
        pb: { xs: 14, md: 14 },
      }}
    >
      {/* Background slider matching reference page banner styling */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        {/* Background slider only. */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: -1,
          }}
        >
          <Box
            key={slide.slideID}
            component="img"
            src={slide.image || undefined}
            alt=""
            fetchPriority={current === 0 ? "high" : "auto"}
            onError={(event: SyntheticEvent<HTMLImageElement>) => {
              event.currentTarget.onerror = null;
              event.currentTarget.style.display = "none";
            }}
            sx={{
              position: "absolute",
              inset: -8, // Slight negative inset to contain blurred edges
              width: "calc(100% + 16px)",
              height: "calc(100% + 16px)",
              objectFit: "cover",
              opacity: 0.25,
              filter: "blur(4px)", // Subtle, soft blur instead of heavy blur
              transform: "scale(1.04)", // Prevents edge clipping from light blur
              animation: `${fadeIn} 800ms ease both`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          {/* Rich color gradient background overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 40%, var(--color-dark-forest-surface) 100%)",
              opacity: 0.9,
            }}
          />
          {/* Radial light glow overlays */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(var(--rgb-primary), 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(var(--rgb-category-orange), 0.25) 0%, transparent 60%)",
            }}
          />
        </Box>
        {/* Radial Light Overlays matching reference styling */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(var(--rgb-primary), 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(var(--rgb-category-orange), 0.25) 0%, transparent 60%)",
          }}
        />
      </Box>

      {/* Previous and next arrows anchored to the outer hero section container */}
      {heroSlides.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Previous slide"
            sx={arrowSx("left")}
          >
            <ChevronLeft size={24} />
          </IconButton>

          <IconButton
            onClick={next}
            aria-label="Next slide"
            sx={arrowSx("right")}
          >
            <ChevronRight size={24} />
          </IconButton>
        </>
      )}

      {/* Static content layer with full width 12-column grid */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 10 }}>
            <Box
              key={slide.slideID}
              sx={{
                width: "100%",
                animation: `${fadeIn} 450ms ease both`,
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            >
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                {/* Badge area */}
                <Box
                  sx={{
                    minHeight: 58,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: 3,
                  }}
                >
                  {slide.badge ? (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 0.75,
                        borderRadius: 999,
                        bgcolor: "rgba(var(--rgb-white), 0.12)",
                        border: "1px solid rgba(var(--rgb-white), 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: "var(--color-accent)",
                          boxShadow: "0 0 12px var(--color-accent)",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {slide.badge}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>

                {/* Fixed title area with safe wrapping and full width layout */}
                <Box
                  sx={{
                    minHeight: { xs: 120, sm: 140, md: 160 },
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: 2.5,
                  }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      width: "100%",
                      fontSize: {
                        xs: "2.25rem",
                        sm: "3.25rem",
                        md: "4rem",
                      },
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: "-0.03em",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      m: 0,
                    }}
                  >
                    {titleNode}
                  </Typography>
                </Box>

                {/* Subtitle area */}
                <Box
                  sx={{
                    minHeight: { xs: 90, md: 100 },
                    pt: 1,
                    mb: 5,
                  }}
                >
                  {slide.subtitle ? (
                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        lineHeight: 1.7,
                        color: "rgba(var(--rgb-white), 0.82)",
                        maxWidth: 720,
                        mx: { xs: "auto", md: 0 },
                        overflowWrap: "break-word",
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                  ) : null}
                </Box>

                {/* Buttons */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    minHeight: 64,
                    alignItems: "stretch",
                    justifyContent: {
                      xs: "center",
                      md: "flex-start",
                    },
                    mb: 5,
                    "& .MuiButton-root": {
                      minHeight: 56,
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight size={18} />}
                    onClick={() => navigate("/login")}
                    sx={{
                      bgcolor: "var(--color-surface)",
                      color: "var(--color-primary)",
                      textTransform: "none",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontSize: "1rem",
                      boxShadow: "0 12px 30px rgba(var(--rgb-black), 0.15)",
                      "&:hover": {
                        bgcolor: "var(--color-gray50)",
                        transform: "translateY(-2px)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    Join Alumni Network
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() =>
                      document
                        .querySelector("#events")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    sx={{
                      color: "var(--color-surface)",
                      borderColor: "rgba(var(--rgb-white), 0.3)",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontSize: "1rem",
                      backdropFilter: "blur(8px)",
                      bgcolor: "rgba(var(--rgb-white), 0.06)",
                      "&:hover": {
                        borderColor: "rgba(var(--rgb-white), 0.6)",
                        bgcolor: "rgba(var(--rgb-white), 0.12)",
                      },
                    }}
                  >
                    Explore Events
                  </Button>
                </Stack>

                {/* Stats section */}
                <Box sx={{ minHeight: 56 }}>
                  {heroStats.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={{ xs: 2.5, sm: 5 }}
                      sx={{
                        flexWrap: "wrap",
                        rowGap: 2,
                        justifyContent: {
                          xs: "center",
                          md: "flex-start",
                        },
                      }}
                    >
                      {heroStats.map((stat) => (
                        <Box
                          key={stat.statID}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              flexShrink: 0,
                              borderRadius: 2.5,
                              bgcolor: "rgba(var(--rgb-white), 0.1)",
                              border: "1px solid rgba(var(--rgb-white), 0.18)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--color-accent)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            {getIcon(stat.iconKey)}
                          </Box>

                          <Box sx={{ textAlign: "left" }}>
                            <Typography
                              sx={{
                                fontSize: "1.4rem",
                                fontWeight: 800,
                                lineHeight: 1.1,
                              }}
                            >
                              {stat.value}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "rgba(var(--rgb-white), 0.68)",
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Accessible navigation dots */}
      {heroSlides.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          {heroSlides.map((item, index) => (
            <IconButton
              key={item.slideID}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              size="small"
              sx={{
                width: current === index ? 32 : 24,
                height: 24,
                minWidth: 24,
                p: 0,
                borderRadius: 999,
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "rgba(var(--rgb-white), 0.12)",
                },
                "& span": {
                  display: "block",
                  width: current === index ? 32 : 10,
                  height: 10,
                  borderRadius: 999,
                  bgcolor:
                    current === index
                      ? "var(--color-accent)"
                      : "rgba(var(--rgb-white), 0.55)",
                  transition: "width 0.3s ease, background-color 0.3s ease",
                },
                "@media (prefers-reduced-motion: reduce)": {
                  "& span": { transition: "none" },
                },
              }}
            >
              <Box component="span" aria-hidden="true" />
            </IconButton>
          ))}
        </Stack>
      )}
    </Box>
  );
}

const arrowSx = (side: "left" | "right") => ({
  position: "absolute" as const,
  [side]: { xs: 10, md: 30 },
  top: "50%",
  transform: "translateY(-50%)",
  bgcolor: "rgba(var(--rgb-white), 0.12)",
  color: "var(--color-surface)",
  border: "1px solid rgba(var(--rgb-white), 0.25)",
  backdropFilter: "blur(8px)",
  zIndex: 2,
  p: 1.5,
  "&:hover": {
    bgcolor: "rgba(var(--rgb-white), 0.25)",
    color: "var(--color-accent)",
  },
});
