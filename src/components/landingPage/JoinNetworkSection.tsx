import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
import { useAuth } from "@/hooks/useAuth";

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
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
        color: "var(--color-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background accents */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--rgb-primary), 0.06) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(var(--rgb-accent), 0.08) 0%, transparent 70%)",
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
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "0.02em",
                color: "text.primary",
                textTransform: "uppercase",
                mb: 3,
              }}
            >
              Join a network of{" "}
              <Box
                component="span"
                sx={{
                  color: "var(--color-accent)",
                }}
              >
                320+ alumni
              </Box>{" "}
              making a difference
            </Typography>
            <Typography
              sx={{
                fontSize: "1.05rem",
                color: "text.secondary",
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
                      color: "text.primary",
                      fontWeight: 500,
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
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "text.primary",
                  mb: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to rejoin?
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "text.secondary",
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
                  bgcolor: "var(--color-primary)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.75,
                  fontSize: "1rem",
                  borderRadius: 2.5,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
                  "&:hover": {
                    bgcolor: "var(--color-primary-hover, var(--color-primary))",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.18)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                {isAuthenticated ? "Explore Alumni" : "Join the Network"}
              </Button>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
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
