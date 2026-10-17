import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import {
  Award,
  Users,
  CalendarDays,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";

import SectionHeader from "@/components/common/SectionHeader";

const PROGRAMS = [
  {
    number: "01",
    icon: Award,
    title: "Scholarship Program",
    description:
      "Merit-based awards for outstanding students across every faculty.",
    about: "About scholarship program",
    path: "",
    color: "var(--color-primary)",
  },
  {
    number: "02",
    icon: Users,
    title: "Mentorship",
    description: "Senior alumni guiding current students and young graduates.",
    about: "About mentorship",
    path: "/mentorship",
    color: "var(--color-primary)",
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Reunions & Events",
    description: "Year-round chapter meetups, lectures and the annual reunion.",
    about: "About reunions & events",
    path: "/events",
    color: "var(--color-primary)",
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Community Impact",
    description:
      "Giving back to the University of Dhaka and the wider society.",
    about: "About community impact",
    path: "/about",
    color: "var(--color-primary)",
  },
];

export default function ProgramsSection() {
  return (
    <Box
      component="section"
      aria-labelledby="programs-heading"
      sx={{
        py: 8,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Reusable Section Header */}
        <SectionHeader
          align="center"
          subtitle="Our Programs"
          subtitlePosition="above"
          title="Diverse Communities, One Family"
          titleColor="text.primary"
          subtitleSx={{
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "primary.main",
            mb: 1.5,
          }}
          titleSx={{
            fontSize: { xs: "2rem", md: "2.25rem" },
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
          sx={{ mb: 6 }}
        />

        {/* Program cards */}
        <Grid container spacing={3}>
          {PROGRAMS.map((program) => {
            const ProgramIcon = program.icon;

            return (
              <Grid key={program.number} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  component="article"
                  sx={{
                    height: "100%",
                    minHeight: 280,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",

                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 16px 40px rgba(var(--rgb-primary), 0.12)",
                      borderColor: program.color,
                      "& .about-link-icon": {
                        transform: "translate(2px, -2px)",
                      },
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                      "&:hover": {
                        transform: "none",
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3.5,
                      height: "100%",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",

                      "&:last-child": {
                        pb: 3.5,
                      },
                    }}
                  >
                    {/* Decorative background number */}
                    <Typography
                      aria-hidden="true"
                      sx={{
                        position: "absolute",
                        top: 38,
                        right: 28,
                        fontSize: "2rem",
                        fontWeight: 900,
                        lineHeight: 1,
                        color: program.color,
                        opacity: 0.75,
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {program.number}
                    </Typography>

                    {/* Program icon */}
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 56,
                        height: 56,
                        flexShrink: 0,
                        borderRadius: 3,
                        bgcolor: `color-mix(in srgb, ${program.color} 8%, transparent)`,
                        color: program.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                      }}
                    >
                      <ProgramIcon size={26} strokeWidth={1.8} />
                    </Box>

                    {/* Program title */}
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "primary.main",
                        mb: 1,
                      }}
                    >
                      {program.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                        lineHeight: 1.7,
                        // mb: 1,
                      }}
                    >
                      {program.description}
                    </Typography>

                    {/* Interactive path link */}
                    <Box
                      component={Link}
                      to={program.path === "" ? "" : program.path}
                      sx={{
                        mt: "auto",
                        // pt: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        color: "primary.main",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "primary.dark",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          // lineHeight: 1.5,
                        }}
                      >
                        {program.about}
                      </Typography>

                      <ArrowUpRight
                        size={16}
                        className="about-link-icon"
                        style={{
                          transition: "transform 0.2s ease",
                        }}
                        aria-hidden="true"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
