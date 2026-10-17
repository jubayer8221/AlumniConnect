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

export function getIcon(key: string, size = 18, strokeWidth = 2.25) {
  const Icon = ICONS[key] ?? Star;
  return <Icon size={size} strokeWidth={strokeWidth} />;
}

export const ICON_KEYS = Object.keys(ICONS);

const AUTOPLAY_MS = 6000;

const HERO_MIN_HEIGHT = { xs: 620, sm: 620, md: 620 } as const;

/* Fixed heights for the text blocks above the CTA buttons.
   Values are chosen to fit the maximum clamped line count at each breakpoint,
   so the button row is always in the same vertical position per breakpoint. */
const TITLE_MIN_HEIGHT = {
  xs: 110, // 3 lines @ 1.85rem
  sm: 155, // 3 lines @ 2.75rem
  md: 210, // 3 lines @ 3.75rem
  lg: 250, // 3 lines @ 4.5rem
} as const;

const SUBTITLE_MIN_HEIGHT = {
  xs: 80, // 3 lines @ 0.95rem
  sm: 88, // 3 lines @ 1.05rem
  md: 100, // 3 lines @ 1.2rem
  lg: 100, // 3 lines @ 1.2rem
} as const;

const FALLBACK_SLIDE = {
  slideID: "default",
  image: "/image/Sherpur_Victoria_Academy.jpg",
  badge: "Alumni Network",
  title: "Connected by memories, united for the future.",
  subtitle:
    "Reconnect with your community, share your experience, and build lasting connections.",
  tag: null,
  displayOrder: 0,
  isActive: true,
};

const fadeIn = keyframes`
  from { opacity: 0.2; }
  to   { opacity: 1; }
`;

const TEXT_SHADOW = {
  title: `
    0 2px 2px rgba(var(--rgb-black), 0.25),
    0 5px 10px rgba(var(--rgb-black), 0.35),
    0 10px 24px rgba(var(--rgb-black), 0.25)
  `,
  body: `
    0 1px 2px rgba(var(--rgb-black), 0.45),
    0 3px 8px rgba(var(--rgb-black), 0.35)
  `,
  small: `
    0 1px 2px rgba(var(--rgb-black), 0.4),
    0 2px 6px rgba(var(--rgb-black), 0.25)
  `,
} as const;

const ACCENT = "var(--color-accent, #f59e0b)";

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

  useEffect(() => {
    if (paused || reducedMotion || heroSlides.length < 2) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, heroSlides.length, next]);

  const slides = heroSlides.length > 0 ? heroSlides : [FALLBACK_SLIDE];
  const slide = slides[current];

  const titleNode = useMemo(() => {
    if (!slide?.title) return null;

    const baseTextStyle = {
      color: "var(--color-off-white)",
      WebkitTextStroke: "1.5px var(--color-gray900)",
      paintOrder: "stroke fill",
      textShadow: TEXT_SHADOW.title,
      letterSpacing: "-0.02em",
    };

    const highlightStyle = {
      color: "var(--color-category-warm)",
      WebkitTextStroke: "1.5px var(--color-gray900)",
      paintOrder: "stroke fill",
      textShadow: TEXT_SHADOW.title,
      letterSpacing: "-0.02em",
    };

    const HIGHLIGHT_WORDS = ["memories", "opportunities", "gatherings"];
    const parts = slide.title.split(/(memories|opportunities|gatherings)/gi);

    return (
      <>
        {parts.map((part, i) => {
          const isHighlight = HIGHLIGHT_WORDS.some(
            (word) => word.toLowerCase() === part.toLowerCase(),
          );
          return (
            <Box
              key={i}
              component="span"
              sx={isHighlight ? highlightStyle : baseTextStyle}
            >
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
        minHeight: HERO_MIN_HEIGHT,
        display: "flex",
        alignItems: "center",
        color: "var(--color-surface)",
        overflow: "hidden",
        background: "var(--color-primary)",
        pt: 16,
        pb: { xs: 11, sm: 12, md: 14 },
      }}
    >
      {/* ============================================================
          Background layer
         ============================================================ */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: -1,
          background: "var(--color-primary)",
        }}
      >
        <Box
          key={slide.slideID}
          component="img"
          src={slide.image || undefined}
          alt=""
          width={1920}
          height={1063}
          loading={current === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={current === 0 ? "high" : "auto"}
          onError={(event: SyntheticEvent<HTMLImageElement>) => {
            event.currentTarget.onerror = null;
            event.currentTarget.style.display = "none";
          }}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 1,
            animation: `${fadeIn} 800ms ease both`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: `
                linear-gradient(
                  180deg,
                  rgba(var(--rgb-primary), 0.85) 0%,
                  rgba(var(--rgb-primary), 0.78) 40%,
                  rgba(var(--rgb-primary), 0.85) 100%
                )
              `,
              md: `
                linear-gradient(
                  90deg,
                  rgba(var(--rgb-primary), 0.96) 0%,
                  rgba(var(--rgb-primary), 0.88) 22%,
                  rgba(var(--rgb-primary), 0.72) 38%,
                  rgba(var(--rgb-primary), 0.42) 55%,
                  rgba(var(--rgb-primary), 0.12) 75%,
                  transparent 100%
                )
              `,
            },
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, transparent 65%)",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(var(--rgb-primary), 0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(var(--rgb-category-orange), 0.12) 0%, transparent 60%)
            `,
            pointerEvents: "none",
          }}
        />
      </Box>

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

      {/* ============================================================
          Main content
         ============================================================ */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          px: { xs: 7, sm: 6, md: 3 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ alignItems: "center" }}
        >
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
                {/* ---------- Badge ---------- */}
                <Box
                  sx={{
                    minHeight: { xs: 44, md: 58 },
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  {slide.badge ? (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: { xs: 1.5, md: 2 },
                        py: { xs: 0.5, md: 0.75 },
                        borderRadius: 999,
                        bgcolor: "rgba(var(--rgb-white), 0.14)",
                        border: "1px solid rgba(var(--rgb-white), 0.24)",
                        backdropFilter: "blur(10px)",
                        boxShadow:
                          "0 4px 12px rgba(var(--rgb-black), 0.25), 0 8px 24px rgba(var(--rgb-black), 0.15)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: ACCENT,
                          boxShadow: `0 0 12px ${ACCENT}`,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.7rem", md: "0.8rem" },
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "var(--color-white)",
                          textShadow: TEXT_SHADOW.small,
                        }}
                      >
                        {slide.badge}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>

                {/* ---------- Title ----------
                    Fixed min-height at every breakpoint so short titles
                    don't shrink the block and long titles don't push
                    the buttons down. Clamped to 3 lines so overflow can
                    never exceed the reserved space. */}
                <Box
                  sx={{
                    minHeight: TITLE_MIN_HEIGHT,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: { xs: 2, md: 2.5 },
                  }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      width: "100%",
                      fontSize: {
                        xs: "1.85rem",
                        sm: "2.75rem",
                        md: "3.75rem",
                        lg: "4.5rem",
                      },
                      fontWeight: 900,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      m: 0,
                      fontFamily:
                        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      /* Clamp to 3 lines */
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {titleNode}
                  </Typography>
                </Box>

                {/* ---------- Subtitle ----------
                    Same idea: fixed min-height + 3-line clamp. */}
                <Box
                  sx={{
                    minHeight: SUBTITLE_MIN_HEIGHT,
                    pt: { xs: 0.5, md: 1 },
                    mb: { xs: 3.5, md: 5 },
                  }}
                >
                  {slide.subtitle ? (
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "0.95rem",
                          sm: "1.05rem",
                          md: "1.2rem",
                        },
                        lineHeight: 1.65,
                        color: "rgba(var(--rgb-white), 1)",
                        maxWidth: { xs: "100%", md: 720 },
                        mx: { xs: "auto", md: 0 },
                        overflowWrap: "break-word",
                        fontWeight: 500,
                        textShadow: TEXT_SHADOW.body,
                        /* Clamp to 3 lines */
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {slide.subtitle}
                    </Typography>
                  ) : null}
                </Box>

                {/* ---------- Buttons ---------- */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1.5, sm: 2 }}
                  sx={{
                    alignItems: "stretch",
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: { xs: 4, md: 5 },
                    "& .MuiButton-root": {
                      minHeight: { xs: 48, sm: 56 },
                      whiteSpace: "nowrap",
                      width: { xs: "100%", sm: "auto" },
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
                      px: { xs: 3, md: 4 },
                      py: 1.5,
                      borderRadius: 2.5,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      boxShadow:
                        "0 12px 30px rgba(var(--rgb-black), 0.25), 0 4px 10px rgba(var(--rgb-black), 0.15)",
                      "&:hover": {
                        bgcolor: "var(--color-gray50)",
                        transform: "translateY(-2px)",
                        boxShadow:
                          "0 16px 40px rgba(var(--rgb-black), 0.3), 0 6px 14px rgba(var(--rgb-black), 0.18)",
                      },
                      transition:
                        "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
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
                      borderColor: "rgba(var(--rgb-white), 0.35)",
                      textTransform: "none",
                      fontWeight: 700,
                      px: { xs: 3, md: 4 },
                      py: 1.5,
                      borderRadius: 2.5,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      backdropFilter: "blur(8px)",
                      bgcolor: "rgba(var(--rgb-white), 0.08)",
                      boxShadow:
                        "0 8px 24px rgba(var(--rgb-black), 0.2), inset 0 1px 0 rgba(var(--rgb-white), 0.15)",
                      "&:hover": {
                        borderColor: "rgba(var(--rgb-white), 0.7)",
                        bgcolor: "rgba(var(--rgb-white), 0.15)",
                        boxShadow:
                          "0 12px 32px rgba(var(--rgb-black), 0.28), inset 0 1px 0 rgba(var(--rgb-white), 0.2)",
                        transform: "translateY(-2px)",
                      },
                      transition:
                        "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    Explore Events
                  </Button>
                </Stack>

                {/* ---------- Stats ---------- */}
                <Box sx={{ minHeight: { xs: "auto", md: 64 } }}>
                  {heroStats.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={{ xs: 1.5, sm: 2, md: 3 }}
                      sx={{
                        flexWrap: "wrap",
                        rowGap: 2,
                        justifyContent: { xs: "center", md: "flex-start" },
                        alignItems: "center",
                      }}
                    >
                      {heroStats.map((stat) => (
                        <Box
                          key={stat.statID}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1.25, md: 1.75 },
                            py: 1,
                            px: { xs: 1.5, md: 2 },
                            borderRadius: 3,
                            bgcolor:
                              "rgba(var(--rgb-white, 255, 255, 255), 0.06)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border:
                              "1px solid rgba(var(--rgb-white, 255, 255, 255), 0.12)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              bgcolor:
                                "rgba(var(--rgb-white, 255, 255, 255), 0.1)",
                              borderColor:
                                "rgba(var(--rgb-white, 255, 255, 255), 0.25)",
                              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          {/* Icon Badge */}
                          <Box
                            sx={{
                              width: { xs: 40, md: 44 },
                              height: { xs: 40, md: 44 },
                              flexShrink: 0,
                              borderRadius: 2.5,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                              "& svg": {
                                width: { xs: 18, md: 20 },
                                height: { xs: 18, md: 20 },
                                strokeWidth: 2.2,
                                display: "block",
                              },
                            }}
                          >
                            {getIcon(stat.iconKey, 20, 2.2)}
                          </Box>

                          {/* Text Content */}
                          <Box sx={{ textAlign: "left", minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: { xs: "1.2rem", md: "1.45rem" },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                color: "var(--color-white, #ffffff)",
                                textShadow:
                                  TEXT_SHADOW?.small ??
                                  "0 1px 3px rgba(0,0,0,0.5)",
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.75rem", md: "0.825rem" },
                                fontWeight: 500,
                                lineHeight: 1.2,
                                mt: 0.25,
                                color:
                                  "rgba(var(--rgb-white, 255, 255, 255), 0.85)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textShadow:
                                  TEXT_SHADOW?.small ??
                                  "0 1px 2px rgba(0,0,0,0.4)",
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

      {/* ---------- Dots ---------- */}
      {heroSlides.length > 1 && (
        <Stack
          direction="row"
          spacing={{ xs: 0.5, md: 1 }}
          sx={{
            position: "absolute",
            bottom: { xs: 18, md: 30 },
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
                "&:hover": { bgcolor: "rgba(var(--rgb-white), 0.12)" },
                "& span": {
                  display: "block",
                  width: current === index ? 32 : 10,
                  height: 10,
                  borderRadius: 999,
                  bgcolor:
                    current === index ? ACCENT : "rgba(var(--rgb-white), 0.55)",
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

/* Arrows at a fixed pixel offset from the top — not 50% — so their
   vertical position is independent of content height. */
const arrowSx = (side: "left" | "right") => ({
  position: "absolute" as const,
  [side]: { xs: 8, sm: 12, md: 24 },
  top: { xs: 320, sm: 340, md: 360 },
  transform: "translateY(-50%)",
  bgcolor: "rgba(var(--rgb-white), 0.14)",
  color: "var(--color-surface)",
  border: "1px solid rgba(var(--rgb-white), 0.25)",
  backdropFilter: "blur(8px)",
  zIndex: 2,
  width: { xs: 40, sm: 44, md: 48 },
  height: { xs: 40, sm: 44, md: 48 },
  p: 0,
  boxShadow: "0 6px 16px rgba(var(--rgb-black), 0.25)",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    bgcolor: "rgba(var(--rgb-white), 0.25)",
    color: ACCENT,
    boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.35)",
  },
});
