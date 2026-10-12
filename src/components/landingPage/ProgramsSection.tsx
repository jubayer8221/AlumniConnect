import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { BookOpen, GraduationCap, Heart, Users } from "lucide-react";

const PROGRAMS = [
  {
    icon: <GraduationCap size={26} />,
    title: "SSC Cohort",
    description:
      "Reconnect with your secondary school batchmates, share memories, and organise reunions.",
    color: "#0f766e",
  },
  {
    icon: <BookOpen size={26} />,
    title: "HSC Alumni",
    description:
      "Higher secondary graduates keeping the academic torch alive through mentorship.",
    color: "#0ea5e9",
  },
  {
    icon: <Users size={26} />,
    title: "Honours & Masters",
    description:
      "Degree holders across faculties forming the backbone of our professional network.",
    color: "#c2410c",
  },
  {
    icon: <Heart size={26} />,
    title: "Mentorship Circle",
    description:
      "Experienced alumni guiding students through careers, admissions, and life decisions.",
    color: "#8b5cf6",
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
            Our alumni span multiple generations, programs, and faculties — but
            they all share one thing: the Academy.
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
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,118,110,0.12)",
                    borderColor: program.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
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
                    sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}
                  >
                    {program.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {program.description}
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
