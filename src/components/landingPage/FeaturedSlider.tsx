import { useEffect, useRef, useState } from "react";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
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
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
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
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
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
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
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
      sx={{
        py: 6,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Section heading */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "primary.main",
              // mb: 1,
            }}
          >
            Featured Voices
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2rem" },
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              // mb: 1,
            }}
          >
            Stories From Our Alumni
          </Typography>
          {/* <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 520,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Every graduate carries a piece of this institution into the world.
            Here are a few of their stories.
          </Typography> */}
        </Box>

        {/* Slider */}
        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{ position: "relative" }}
        >
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
                  {/* Photo */}
                  <Box
                    sx={{
                      position: "relative",
                      minHeight: { xs: 300, md: 420 },
                      // minWidth: { xs: 300, md: 320 },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(var(--rgb-primary), 0.15) 0%, transparent 50%)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={slide.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "90%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                    />
                  </Box>
                  {/* Quote */}
                  <Box
                    sx={{
                      p: { xs: 4, md: 6 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
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
                        fontSize: { xs: "1.05rem", md: "1.25rem" },
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

          {/* Arrows */}
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
              "&:hover": {
                bgcolor: "primary.main",
                color: "var(--color-white)",
              },
            }}
          >
            <ChevronRight size={20} />
          </IconButton>

          {/* Dots */}
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
