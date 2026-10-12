import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Skeleton,
  Typography,
} from "@mui/material";
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
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";

/* ============================================================
   Shared icon map — used by this file, AboutUsSection,
   LandingContentPage, HeroSlideFormPage.
   ============================================================ */

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

/* ============================================================ */

const AUTOPLAY_MS = 6000;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80";

export default function HeroSection() {
  const navigate = useNavigate();
  const { heroSlides, heroStats, loading, fetchLandingContent } = useLanding();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  // Reset index when slides change (e.g. admin edits)
  useEffect(() => {
    setCurrent((c) => (heroSlides.length ? c % heroSlides.length : 0));
  }, [heroSlides.length]);

  const next = () =>
    setCurrent((c) => (heroSlides.length ? (c + 1) % heroSlides.length : 0));
  const prev = () =>
    setCurrent((c) =>
      heroSlides.length ? (c - 1 + heroSlides.length) % heroSlides.length : 0,
    );

  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    timerRef.current = window.setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, current, heroSlides.length]);

  const slide = heroSlides[current];

  const titleNode = useMemo(() => {
    if (!slide?.title) return null;
    if (slide.title.includes("memories")) {
      const [before, after] = slide.title.split("memories");
      return (
        <>
          {before}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            memories
          </Box>
          {after}
        </>
      );
    }
    return (
      <Box
        component="span"
        sx={{
          background: "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {slide.title}
      </Box>
    );
  }, [slide?.title]);

  // ---- loading skeleton ----
  if (loading && heroSlides.length === 0) {
    return (
      <Box
        id="home"
        sx={{
          minHeight: { xs: "auto", md: "100vh" },
          bgcolor: "#102a28",
          pt: { xs: 12, md: 10 },
          pb: { xs: 12, md: 16 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="text"
            width={200}
            height={40}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={90}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
        </Container>
      </Box>
    );
  }

  if (!slide) return null;

  return (
    <Box
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        overflow: "hidden",
        background: "#102a28",
        pt: { xs: 12, md: 10 },
        pb: { xs: 12, md: 16 },
      }}
    >
      {/* Sliding background track */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${current * 100}%)`,
          zIndex: 1,
        }}
      >
        {heroSlides.map((s) => (
          <Box
            key={s.slideID}
            sx={{ minWidth: "100%", height: "100%", position: "relative" }}
          >
            <Box
              component="img"
              src={s.image || FALLBACK_IMAGE}
              alt={s.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.35,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #0f766e 0%, #115e59 40%, #102a28 100%)",
                opacity: 0.9,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 20% 30%, rgba(42,157,143,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(194,65,12,0.25) 0%, transparent 60%)",
              }}
            />
          </Box>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              {slide.badge && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#2dd4bf",
                      boxShadow: "0 0 12px #2dd4bf",
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
              )}

              <Typography
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  mb: 2.5,
                }}
              >
                {titleNode}
              </Typography>

              {slide.subtitle && (
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.82)",
                    mb: 4,
                    maxWidth: 640,
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  {slide.subtitle}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  mb: 6,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={18} />}
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "#ffffff",
                    color: "#0f766e",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: "1rem",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    "&:hover": {
                      bgcolor: "#f3f4f6",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
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
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.3)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: "1rem",
                    backdropFilter: "blur(8px)",
                    bgcolor: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.6)",
                      bgcolor: "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  Explore Events
                </Button>
              </Stack>

              {heroStats.length > 0 && (
                <Stack
                  direction="row"
                  spacing={{ xs: 3, sm: 5 }}
                  sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
                >
                  {heroStats.map((stat) => (
                    <Box
                      key={stat.statID}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#7dd3c7",
                        }}
                      >
                        {getIcon(stat.iconKey)}
                      </Box>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            lineHeight: 1.1,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.65)",
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
          </Grid>
        </Grid>
      </Container>

      {/* Left / right arrows — only when > 1 slide */}
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

      {/* Dots */}
      {heroSlides.length > 1 && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
          }}
        >
          {heroSlides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              sx={{
                width: current === i ? 32 : 10,
                height: 10,
                borderRadius: 999,
                bgcolor: current === i ? "#2dd4bf" : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

/* ---------- arrow styling helper ---------- */
const arrowSx = (side: "left" | "right") => ({
  position: "absolute",
  [side]: { xs: 10, md: 30 },
  top: "50%",
  transform: "translateY(-50%)",
  bgcolor: "rgba(255, 255, 255, 0.12)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(8px)",
  zIndex: 3,
  p: 1.5,
  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)", color: "#2dd4bf" },
});
// import { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Grid,
//   IconButton,
//   Stack,
//   Typography,
// } from "@mui/material";
// import {
//   ArrowRight,
//   Award,
//   ChevronLeft,
//   ChevronRight,
//   TrendingUp,
//   Users,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { appConfig } from "@/config/appConfig";

// const STATS = [
//   { icon: <Users size={18} />, value: "1,200+", label: "Alumni" },
//   { icon: <Award size={18} />, value: "135+", label: "Years" },
//   { icon: <TrendingUp size={18} />, value: "92%", label: "Active" },
// ];

// const HERO_SLIDES = [
//   {
//     id: "1",
//     image: "./image/Sherpur_Victoria_Academy.png",
//     badge: appConfig.institutionName,
//     title: "Where memories become lifelong connections",
//     subtitle:
//       "Reconnect with classmates, mentor the next generation, and stay in touch with everything happening.",
//     tag: "Over 135 Years of Legacy",
//   },
//   {
//     id: "2",
//     image:
//       "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80",
//     badge: "Global Network",
//     title: "Expanding opportunities worldwide",
//     subtitle:
//       "Join a thriving community of graduates making an impact across different industries and continents.",
//     tag: "Global Alumni Connection",
//   },
//   {
//     id: "3",
//     image:
//       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
//     badge: "Reunions & Events",
//     title: "Join our upcoming annual gatherings",
//     subtitle:
//       "Relive your school days, network with peers, and participate in special celebratory events.",
//     tag: "Annual Homecoming 2026",
//   },
// ];

// const AUTOPLAY_MS = 6000;

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const timerRef = useRef<number | null>(null);

//   const next = () => setCurrent((c) => (c + 1) % HERO_SLIDES.length);
//   const prev = () =>
//     setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

//   useEffect(() => {
//     if (paused) return;
//     timerRef.current = window.setInterval(next, AUTOPLAY_MS);
//     return () => {
//       if (timerRef.current) window.clearInterval(timerRef.current);
//     };
//   }, [paused, current]);

//   return (
//     <Box
//       id="home"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//       sx={{
//         position: "relative",
//         minHeight: { xs: "auto", md: "100vh" },
//         display: "flex",
//         alignItems: "center",
//         color: "#ffffff",
//         overflow: "hidden",
//         background: "#102a28",
//         pt: { xs: 12, md: 10 },
//         pb: { xs: 12, md: 16 },
//       }}
//     >
//       {/* Sliding Background Track Container */}
//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,
//           display: "flex",
//           transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
//           transform: `translateX(-${current * 100}%)`,
//           zIndex: 1,
//         }}
//       >
//         {HERO_SLIDES.map((slide) => (
//           <Box
//             key={slide.id}
//             sx={{
//               minWidth: "100%",
//               height: "100%",
//               position: "relative",
//             }}
//           >
//             {/* Background Image with Fallback */}
//             <Box
//               component="img"
//               src={slide.image}
//               alt={slide.title}
//               onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//                 // Fallback to Unsplash image if local asset fails to load
//                 e.currentTarget.src =
//                   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80";
//               }}
//               sx={{
//                 position: "absolute",
//                 inset: 0,
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 opacity: 0.35,
//               }}
//             />
//             {/* Rich Gradient Overlays */}
//             <Box
//               sx={{
//                 position: "absolute",
//                 inset: 0,
//                 background:
//                   "linear-gradient(135deg, #0f766e 0%, #115e59 40%, #102a28 100%)",
//                 opacity: 0.9,
//               }}
//             />
//             <Box
//               sx={{
//                 position: "absolute",
//                 inset: 0,
//                 background:
//                   "radial-gradient(ellipse at 20% 30%, rgba(42,157,143,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(194,65,12,0.25) 0%, transparent 60%)",
//               }}
//             />
//           </Box>
//         ))}
//       </Box>

//       {/* Foreground Content container */}
//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
//         <Grid container spacing={6} sx={{ alignItems: "center" }}>
//           <Grid size={{ xs: 12, md: 8 }}>
//             <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
//               {/* Badge */}
//               <Box
//                 sx={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 1,
//                   px: 2,
//                   py: 0.75,
//                   borderRadius: 999,
//                   bgcolor: "rgba(255,255,255,0.12)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                   backdropFilter: "blur(10px)",
//                   mb: 3,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     bgcolor: "#2dd4bf",
//                     boxShadow: "0 0 12px #2dd4bf",
//                   }}
//                 />
//                 <Typography
//                   sx={{
//                     fontSize: "0.8rem",
//                     fontWeight: 600,
//                     letterSpacing: "0.04em",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   {HERO_SLIDES[current].badge}
//                 </Typography>
//               </Box>

//               {/* Dynamic Headline */}
//               <Typography
//                 sx={{
//                   fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
//                   fontWeight: 800,
//                   lineHeight: 1.1,
//                   letterSpacing: "-0.03em",
//                   mb: 2.5,
//                   transition: "opacity 0.4s ease",
//                 }}
//               >
//                 {HERO_SLIDES[current].title.split("memories").length > 1 ? (
//                   <>
//                     Where{" "}
//                     <Box
//                       component="span"
//                       sx={{
//                         background:
//                           "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                       }}
//                     >
//                       memories
//                     </Box>{" "}
//                     become lifelong connections
//                   </>
//                 ) : (
//                   <Box
//                     component="span"
//                     sx={{
//                       background:
//                         "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     {HERO_SLIDES[current].title}
//                   </Box>
//                 )}
//               </Typography>

//               {/* Subheading */}
//               <Typography
//                 sx={{
//                   fontSize: { xs: "1rem", md: "1.15rem" },
//                   lineHeight: 1.7,
//                   color: "rgba(255,255,255,0.82)",
//                   mb: 4,
//                   maxWidth: 640,
//                   mx: { xs: "auto", md: 0 },
//                 }}
//               >
//                 {HERO_SLIDES[current].subtitle}
//               </Typography>

//               {/* CTAs */}
//               <Stack
//                 direction={{ xs: "column", sm: "row" }}
//                 spacing={2}
//                 sx={{
//                   mb: 6,
//                   justifyContent: { xs: "center", md: "flex-start" },
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   size="large"
//                   endIcon={<ArrowRight size={18} />}
//                   onClick={() => navigate("/login")}
//                   sx={{
//                     bgcolor: "#ffffff",
//                     color: "#0f766e",
//                     textTransform: "none",
//                     fontWeight: 700,
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: 2.5,
//                     fontSize: "1rem",
//                     boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
//                     "&:hover": {
//                       bgcolor: "#f3f4f6",
//                       transform: "translateY(-2px)",
//                     },
//                     transition: "all 0.2s ease",
//                   }}
//                 >
//                   Join Alumni Network
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="large"
//                   onClick={() => {
//                     const el = document.querySelector("#events");
//                     el?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   sx={{
//                     color: "#ffffff",
//                     borderColor: "rgba(255,255,255,0.3)",
//                     textTransform: "none",
//                     fontWeight: 600,
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: 2.5,
//                     fontSize: "1rem",
//                     backdropFilter: "blur(8px)",
//                     bgcolor: "rgba(255,255,255,0.06)",
//                     "&:hover": {
//                       borderColor: "rgba(255,255,255,0.6)",
//                       bgcolor: "rgba(255,255,255,0.12)",
//                     },
//                   }}
//                 >
//                   Explore Events
//                 </Button>
//               </Stack>

//               {/* Stats Bar */}
//               <Stack
//                 direction="row"
//                 spacing={{ xs: 3, sm: 5 }}
//                 sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
//               >
//                 {STATS.map((stat) => (
//                   <Box
//                     key={stat.label}
//                     sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
//                   >
//                     <Box
//                       sx={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: 2,
//                         bgcolor: "rgba(255,255,255,0.1)",
//                         border: "1px solid rgba(255,255,255,0.15)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#7dd3c7",
//                       }}
//                     >
//                       {stat.icon}
//                     </Box>
//                     <Box sx={{ textAlign: "left" }}>
//                       <Typography
//                         sx={{
//                           fontSize: "1.25rem",
//                           fontWeight: 800,
//                           lineHeight: 1.1,
//                         }}
//                       >
//                         {stat.value}
//                       </Typography>
//                       <Typography
//                         sx={{
//                           fontSize: "0.75rem",
//                           color: "rgba(255,255,255,0.65)",
//                         }}
//                       >
//                         {stat.label}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 ))}
//               </Stack>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Manual Left/Right Navigation Controls */}
//       <IconButton
//         onClick={prev}
//         aria-label="Previous slide"
//         sx={{
//           position: "absolute",
//           left: { xs: 10, md: 30 },
//           top: "50%",
//           transform: "translateY(-50%)",
//           bgcolor: "rgba(255, 255, 255, 0.12)",
//           color: "#ffffff",
//           border: "1px solid rgba(255, 255, 255, 0.25)",
//           backdropFilter: "blur(8px)",
//           zIndex: 3,
//           p: 1.5,
//           "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)", color: "#2dd4bf" },
//         }}
//       >
//         <ChevronLeft size={24} />
//       </IconButton>
//       <IconButton
//         onClick={next}
//         aria-label="Next slide"
//         sx={{
//           position: "absolute",
//           right: { xs: 10, md: 30 },
//           top: "50%",
//           transform: "translateY(-50%)",
//           bgcolor: "rgba(255, 255, 255, 0.12)",
//           color: "#ffffff",
//           border: "1px solid rgba(255, 255, 255, 0.25)",
//           backdropFilter: "blur(8px)",
//           zIndex: 3,
//           p: 1.5,
//           "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)", color: "#2dd4bf" },
//         }}
//       >
//         <ChevronRight size={24} />
//       </IconButton>

//       {/* Bottom Pagination Dots */}
//       <Stack
//         direction="row"
//         spacing={1.5}
//         sx={{
//           position: "absolute",
//           bottom: 30,
//           left: "50%",
//           transform: "translateX(-50%)",
//           zIndex: 3,
//         }}
//       >
//         {HERO_SLIDES.map((_, i) => (
//           <Box
//             key={i}
//             onClick={() => setCurrent(i)}
//             sx={{
//               width: current === i ? 32 : 10,
//               height: 10,
//               borderRadius: 999,
//               bgcolor: current === i ? "#2dd4bf" : "rgba(255, 255, 255, 0.35)",
//               cursor: "pointer",
//               transition: "all 0.3s ease",
//             }}
//           />
//         ))}
//       </Stack>
//     </Box>
//   );
// }
