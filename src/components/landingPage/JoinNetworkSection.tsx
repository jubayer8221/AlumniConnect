import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "@/config/appConfig";

const BENEFITS = [
  "Reconnect with old classmates and friends",
  "Mentor current students and young alumni",
  "Access exclusive events, webinars, and reunions",
  "Find job leads and business opportunities",
  "Give back through scholarships and programs",
  "Build your professional network for life",
];

export default function JoinNetworkSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 60%, var(--color-dark-forest-surface) 100%)",
        color: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--rgb-accent), 0.25) 0%, transparent 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--rgb-category-warm), 0.2) 0%, transparent 70%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                mb: 1.5,
              }}
            >
              Become Part of Alumni Network
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                mb: 3,
              }}
            >
              Join a network of{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, var(--color-accent) 0%, var(--color-category-warm) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                320+ alumni
              </Box>{" "}
              making a difference
            </Typography>
            <Typography
              sx={{
                fontSize: "1.05rem",
                color: "rgba(var(--rgb-white), 0.78)",
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 620,
              }}
            >
              From {appConfig.institutionName}, our alumni span continents,
              industries, and generations. Whether you graduated last year or
              thirty years ago — this community is yours.
            </Typography>

            <Stack spacing={1.5}>
              {BENEFITS.map((benefit) => (
                <Box
                  key={benefit}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      color: "var(--color-accent)",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: "rgba(var(--rgb-white), 0.9)",
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                bgcolor: "rgba(var(--rgb-white), 0.06)",
                border: "1px solid rgba(var(--rgb-white), 0.14)",
                backdropFilter: "blur(20px)",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to rejoin?
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "rgba(var(--rgb-white), 0.7)",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                It takes less than a minute. Log in with your alumni account or
                contact the office to get started.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={18} />}
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "var(--color-surface)",
                  color: "var(--color-primary)",
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.75,
                  fontSize: "1rem",
                  borderRadius: 2.5,
                  boxShadow: "0 12px 30px rgba(var(--rgb-white), 0.15)",
                  "&:hover": {
                    bgcolor: "var(--color-gray50)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 16px 36px rgba(var(--rgb-white), 0.25)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Join the Network
              </Button>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(var(--rgb-white), 0.5)",
                  mt: 2,
                }}
              >
                Existing members — use your alumni credentials
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
