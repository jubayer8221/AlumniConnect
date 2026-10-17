import { useEffect, useRef, useState } from "react";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";

interface Slide {
  id: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  quote: string;
  photo: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    name: "Pallab Serniabat",
    batch: "SSC 1998",
    role: "Banker",
    company: "BRAC Bank",
    quote:
      "The academy shaped who I am today. Every reunion reminds me that the bonds we formed here are stronger than time.",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Nasrin Akter Nilima",
    batch: "SSC 1998",
    role: "Assistant Teacher",
    company: "Sherpur Govt Girls High School",
    quote:
      "Giving back to the community that raised me is the greatest privilege. Our alumni network makes that possible.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Dr. Nahid Kamal",
    batch: "SSC 1998",
    role: "Physician",
    company: "Dhaka Medical College",
    quote:
      "I still remember the corridors we walked. Now I walk hospital corridors healing people. This school is where it started.",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    name: "Engr. Sharif Ahmed Khan",
    batch: "SSC 1998",
    role: "Lecturer in ICT",
    company: "Technical University",
    quote:
      "Every startup I've built traces back to a spark I first felt in a classroom at Victoria Academy.",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
  },
];

const AUTOPLAY_MS = 6000;

export default function FeaturedSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, current]);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 6 },
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          align="center"
          subtitle="Featured Voices"
          subtitlePosition="above"
          title="Stories From Our Alumni"
          titleColor="primary.main"
          sx={{ mb: { xs: 4, md: 6 } }}
        />

        {/* Slider Wrapper */}
        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{ position: "relative" }}
        >
          {/* Main Card Container */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(var(--rgb-primary), 0.12)",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {/* Carousel Track */}
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {SLIDES.map((slide) => (
                <Box
                  key={slide.id}
                  sx={{
                    minWidth: "100%",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
                  }}
                >
                  {/* Photo Container (Restored to minHeight: 320 / 420) */}
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: { xs: 320, md: 420 },
                      overflow: "hidden",
                      bgcolor: "action.hover",
                    }}
                  >
                    <Box
                      component="img"
                      src={slide.photo}
                      alt={slide.name}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />

                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(var(--rgb-primary), 0.15) 0%, transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Batch Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 0, 0, 0.55)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {slide.batch}
                    </Box>
                  </Box>

                  {/* Quote & Details (Restored Padding) */}
                  <Box
                    sx={{
                      p: { xs: 3.5, sm: 4, md: 6 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Quote
                      size={40}
                      style={{
                        color: "var(--color-primary)",
                        marginBottom: 16,
                        opacity: 0.4,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        lineHeight: 1.7,
                        fontStyle: "italic",
                        color: "text.primary",
                        mb: 3,
                      }}
                    >
                      "{slide.quote}"
                    </Typography>

                    <Box>
                      <Typography
                        sx={{ fontSize: "1rem", fontWeight: 700, mb: 0.25 }}
                      >
                        {slide.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                      >
                        {slide.role} · {slide.company}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "primary.main",
                          fontWeight: 600,
                          mt: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {slide.batch}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Navigation Arrows */}
          <IconButton
            onClick={prev}
            aria-label="Previous slide"
            sx={{
              position: "absolute",
              left: { xs: -8, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.1)",
              zIndex: 4,
              "&:hover": {
                bgcolor: "primary.main",
                color: "var(--color-white)",
              },
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>

          <IconButton
            onClick={next}
            aria-label="Next slide"
            sx={{
              position: "absolute",
              right: { xs: -8, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 20px rgba(var(--rgb-black), 0.1)",
              zIndex: 4,
              "&:hover": {
                bgcolor: "primary.main",
                color: "var(--color-white)",
              },
            }}
          >
            <ChevronRight size={20} />
          </IconButton>

          {/* Dots Indicator */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", mt: 4 }}
          >
            {SLIDES.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{
                  width: current === i ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: current === i ? "primary.main" : "divider",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
