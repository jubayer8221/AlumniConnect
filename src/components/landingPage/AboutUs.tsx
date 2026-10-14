import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanding } from "@/hooks/useLanding";
import { getIcon } from "./HeroSection";

export default function AboutUsSection() {
  const { aboutStats, loading, fetchLandingContent } = useLanding();

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: 6,
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 6, md: 8 }}
          sx={{ alignItems: "center" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1.5,
              }}
            >
              About Us
            </Typography>

            <Typography
              // variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 800,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                mb: 1,

                // fontWeight: 800,
                // fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                // letterSpacing: "-0.03em",
                lineHeight: 1.15,
                // mb: 3,
                color: "text.primary",
              }}
            >
              Reconnecting alumni, <br />
              <Box
                component="span"
                sx={{
                  background: (t) =>
                    `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary?.main || t.palette.primary.dark} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                building a lifetime network.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.75,
                mb: 2.5,
              }}
            >
              The Alumni Association exists to keep our community connected long
              after graduation. From mentorship programs and scholarships to
              networking events and giving back, we help alumni stay in touch
              with each other and with the institution that shaped them.
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.75,
                mb: 4,
              }}
            >
              Whether you graduated last year or decades ago, there's a place
              for you here — a community that celebrates your success and
              supports the next generation.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
            >
              <Button
                component={Link}
                to="/about"
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={18} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2.5,
                  boxShadow: (t) => `0 8px 20px ${t.palette.primary.main}30`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                Learn more
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2.5,
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Join the network
              </Button>
            </Stack>
          </Grid>

          {/* Right: Modern Stat Cards Grid */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2.5}>
              {loading && aboutStats.length === 0
                ? [0, 1, 2, 3].map((i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                      <Skeleton
                        variant="rounded"
                        height={140}
                        sx={{ borderRadius: 4 }}
                      />
                    </Grid>
                  ))
                : aboutStats.map((s) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={s.statID}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-4px)",
                            boxShadow: (t) =>
                              `0 16px 32px ${t.palette.text.primary}0D`,
                            "& .stat-icon-box": {
                              transform: "scale(1.1) rotate(5deg)",
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                            },
                          },
                        }}
                      >
                        {/* Row 1: Icon on left, Value centered */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            mb: 1.5,
                          }}
                        >
                          <Box
                            className="stat-icon-box"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 48,
                              height: 48,
                              borderRadius: 3,
                              bgcolor: (t) => `${t.palette.primary.main}12`,
                              color: "primary.main",
                              flexShrink: 0,
                              transition: "all 0.3s ease",
                              zIndex: 1,
                            }}
                          >
                            {getIcon(s.iconKey, 24)}
                          </Box>
                          <Typography
                            sx={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              textAlign: "center",
                              fontSize: { xs: "1.8rem", md: "2.1rem" },
                              fontWeight: 800,
                              color: "text.primary",
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {s.value}
                          </Typography>
                        </Box>

                        {/* Row 2: Title / Label */}
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            // fontWeight: 500,
                            color: "primary.main",
                            // color: "text.secondary",
                            lineHeight: 1.4,
                            // fontSize: { xs: "2rem", md: "2rem" },
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                            mb: 1,
                          }}
                        >
                          {s.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
