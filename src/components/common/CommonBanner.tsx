import { Box, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface PageBannerStat {
  icon: ReactNode;
  value: string;
  label: string;
}

export interface PageBannerProps {
  badge?: string;
  title: ReactNode | string;
  highlightText?: string;
  subtitle: string;
  bgImageUrl?: string;
  stats?: PageBannerStat[];
}

export default function CommonBanner({
  badge,
  title,
  highlightText,
  subtitle,
  bgImageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
  stats,
}: PageBannerProps) {
  return (
    <Box
      sx={{
        position: "relative",
        pt: { xs: 12, md: 16 },
        pb: { xs: 10, md: 14 },
        overflow: "hidden",
        color: "var(--color-surface)",
        // background:
        //   "linear-gradient( 90deg, var(--color-primary) 0%, var(--color-primary) 35%, transparent 50%)",
        background:
          "linear-gradient(135deg, var(--color-primary) 40%,  var(--color-dark-forest-surface) 100%)",
      }}
    >
      {/* Background Image Overlay */}
      <Box
        component="img"
        src={bgImageUrl}
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.2,
        }}
      />

      {/* Radial Light Overlays */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(var(--rgb-primary), 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(var(--rgb-category-orange), 0.25) 0%, transparent 60%)",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Optional Badge */}
        {badge && (
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
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
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
                color: "var(--color-surface)",
              }}
            >
              {badge}
            </Typography>
          </Box>
        )}

        {/* Headline */}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2.25rem", sm: "3.25rem", md: "4rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            mb: 2.5,
            maxWidth: 900,
            overflowWrap: "break-word",
          }}
        >
          {title}{" "}
          {highlightText && (
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(135deg, var(--color-accent) 0%, var(--color-category-warm) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {highlightText}
            </Box>
          )}
        </Typography>

        {/* Subheading */}
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.7,
            color: "rgba(var(--rgb-white), 0.82)",
            mb: stats && stats.length > 0 ? 5 : 0,
            maxWidth: 720,
            overflowWrap: "break-word",
          }}
        >
          {subtitle}
        </Typography>

        {/* Stats Row (Optional) */}
        {stats && stats.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2.5, sm: 5 }}
            sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
          >
            {stats.map((stat) => (
              <Box
                key={stat.label}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
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
                  {stat.icon}
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
      </Container>
    </Box>
  );
}
