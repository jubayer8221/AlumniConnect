import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "@/config/appConfig";

const STATS = [
  { icon: <Users size={20} />, value: "1,200+", label: "Registered Alumni" },
  { icon: <Award size={20} />, value: "45+", label: "Years of Legacy" },
  { icon: <TrendingUp size={20} />, value: "92%", label: "Active Mentors" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        minHeight: { xs: "90vh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0f766e 0%, #115e59 40%, #102a28 100%)",
      }}
    >
      {/* Background image with overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.28,
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

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 2, py: { xs: 12, md: 16 } }}
      >
        <Box
          sx={{
            maxWidth: 780,
            mx: { xs: "auto", md: 0 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Badge */}
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
              {appConfig.institutionName}
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              mb: 2.5,
            }}
          >
            Where{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #7dd3c7 0%, #f4a261 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              memories
            </Box>{" "}
            become lifelong connections
          </Typography>

          {/* Subheading */}
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
              mb: 4,
              maxWidth: 620,
              mx: { xs: "auto", md: 0 },
            }}
          >
            Reconnect with classmates, mentor the next generation, and stay in
            touch with everything happening at {appConfig.institutionShortName}.
          </Typography>

          {/* CTAs */}
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
                boxShadow: "0 12px 30px rgba(255,255,255,0.2)",
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
              onClick={() => {
                const el = document.querySelector("#events");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
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

          {/* Stats */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 5 }}
            sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
          >
            {STATS.map((stat) => (
              <Box
                key={stat.label}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7dd3c7",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {stat.icon}
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Bottom fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to top, rgba(243,246,243,1) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
