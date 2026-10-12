import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Award, Users, CalendarDays, HeartHandshake } from "lucide-react";

const PROGRAMS = [
  {
    number: "01",
    icon: <Award size={26} />,
    title: "Scholarship Program",
    description:
      "Merit-based awards for outstanding students across every faculty.",
    about: "About scholarship program",
    color: "#0f766e",
  },
  {
    number: "02",
    icon: <Users size={26} />,
    title: "Mentorship",
    description: "Senior alumni guiding current students and young graduates.",
    about: "About mentorship",
    color: "#0f766e",
  },
  {
    number: "03",
    icon: <CalendarDays size={26} />,
    title: "Reunions & Events",
    description: "Year-round chapter meetups, lectures and the annual reunion.",
    about: "About reunions & events",
    color: "#0f766e",
  },
  {
    number: "04",
    icon: <HeartHandshake size={26} />,
    title: "Community Impact",
    description:
      "Giving back to the University of Dhaka and the wider society.",
    about: "About community impact",
    color: "#0f766e",
  },
];

export default function ProgramsSection() {
  return (
    <Box
      id="programs"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
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
            Our Programs
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Diverse Communities, One Family
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Programs through which serves alumni, students and the University.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {PROGRAMS.map((program) => (
            <Grid key={program.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,118,110,0.12)",
                    borderColor: program.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 20,
                      fontSize: "2rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: program.color,
                      opacity: 0.12,
                      userSelect: "none",
                    }}
                  >
                    {program.number}
                  </Typography>

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: program.color + "15",
                      color: program.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                    }}
                  >
                    {program.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: program.color,
                      mb: 0.75,
                    }}
                  >
                    {program.number}
                  </Typography>

                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}
                  >
                    {program.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    {program.description}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: program.color,
                    }}
                  >
                    {program.about} →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
