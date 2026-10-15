import { Box, Button, Container, Typography } from "@mui/material";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: <GraduationCap size={18} />, label: "Career Guidance" },
  { icon: <Lightbulb size={18} />, label: "Skill Development" },
  { icon: <Briefcase size={18} />, label: "Industry Insights" },
  { icon: <Users size={18} />, label: "One-to-One Sessions" },
];

export default function MentorshipBanner() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr 1fr" },
            gap: 0,
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 60px rgba(var(--rgb-primary), 0.08)",
            bgcolor: "background.paper",
          }}
        >
          {/* Left — image */}
          <Box
            sx={{
              minHeight: { xs: 220, md: 320 },
              backgroundImage:
                "url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Middle — copy + CTA */}
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(var(--rgb-primary), 0.1)",
                  color: "primary.main",
                }}
              >
                <Users size={20} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.9rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                }}
              >
                Mentorship
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "primary.main",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Learn • Share • Grow Together
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 3,
                fontSize: "0.95rem",
              }}
            >
              Connect with experienced alumni for guidance, career advice and
              industry insights. Be a mentor or find the right mentor for your
              journey.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                onClick={() => navigate("/mentorship")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                }}
              >
                Find a Mentor
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/alumni/network/mentorship")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                }}
              >
                Become a Mentor
              </Button>
            </Box>
          </Box>

          {/* Right — feature list */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              //   borderLeft: { md: "1px solid" },
              //   borderTop: { xs: "1px solid", md: "none" },
              borderColor: "divider",
              bgcolor: "var(--color-light-surface-blue)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {FEATURES.map((f) => (
              <Box
                key={f.label}
                sx={{ display: "flex", alignItems: "center", gap: 1.75 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "background.paper",
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {f.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
