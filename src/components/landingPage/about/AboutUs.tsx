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
import { ArrowRight } from "lucide-react";
import { useLanding } from "@/hooks/useLanding";
import { getIcon } from "../HeroSection";
import SectionHeader from "@/components/common/SectionHeader";

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
        py: { xs: 6, sm: 8, md: 10 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 6, md: 8 }}
          sx={{ alignItems: "center" }}
        >
          {/* Left Column: Text & Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Reusable Section Header */}
            <SectionHeader
              align="left"
              subtitle="About Us"
              subtitlePosition="above"
              title={
                <>
                  Connecting Alumni <br />
                  <Box
                    component="span"
                    sx={{
                      background: (t) =>
                        `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${
                          t.palette.secondary?.main || t.palette.primary.dark
                        } 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Building Legacy
                  </Box>
                </>
              }
              titleColor="text.primary"
              subtitleSx={{
                fontSize: { xs: "0.75rem", md: "0.8rem" },
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1.5,
              }}
              titleSx={{
                fontSize: { xs: "1.65rem", sm: "2rem", md: "2.25rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                lineHeight: { xs: 1.2, md: 1.15 },
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.925rem", sm: "1rem", md: "1.05rem" },
                lineHeight: 1.7,
                mb: 2,
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
                fontSize: { xs: "0.925rem", sm: "1rem", md: "1.05rem" },
                lineHeight: 1.7,
                mb: { xs: 3, md: 4 },
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
              sx={{ width: "100%" }}
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
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2.5,
                  width: { xs: "100%", sm: "auto" },
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
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2.5,
                  borderWidth: "2px",
                  width: { xs: "100%", sm: "auto" },
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

          {/* Right Column: 2x2 Responsive Stat Cards Grid on Mobile */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
              {loading && aboutStats.length === 0
                ? [0, 1, 2, 3].map((i) => (
                    <Grid size={{ xs: 6, sm: 6 }} key={i}>
                      <Skeleton
                        variant="rounded"
                        height={130}
                        sx={{ borderRadius: 4 }}
                      />
                    </Grid>
                  ))
                : aboutStats.map((s) => (
                    <Grid size={{ xs: 6, sm: 6 }} key={s.statID}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          borderRadius: 4,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-4px)",
                            boxShadow: (t) =>
                              `0 16px 32px ${t.palette.text.primary}0D`,
                            "& .stat-icon-box": {
                              transform: "scale(1.08) rotate(5deg)",
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                            },
                          },
                        }}
                      >
                        {/* Top Row: Icon + Large Stat Value */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                            gap: 1,
                          }}
                        >
                          <Box
                            className="stat-icon-box"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: { xs: 36, sm: 48 },
                              height: { xs: 36, sm: 48 },
                              borderRadius: 3,
                              bgcolor: (t) => `${t.palette.primary.main}12`,
                              color: "primary.main",
                              flexShrink: 0,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {getIcon(s.iconKey, 20)}
                          </Box>

                          <Typography
                            sx={{
                              fontSize: {
                                xs: "1.45rem",
                                sm: "2rem",
                                md: "2.1rem",
                              },
                              fontWeight: 800,
                              color: "text.primary",
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {s.value}
                          </Typography>
                        </Box>

                        {/* Bottom Row: Label */}
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.725rem",
                              sm: "0.875rem",
                              md: "0.925rem",
                            },
                            color: "primary.main",
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                            lineHeight: 1.3,
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
