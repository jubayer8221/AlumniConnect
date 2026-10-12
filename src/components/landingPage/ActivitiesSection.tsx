import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowUpRight, Bell, BookOpen, Users } from "lucide-react";

const ACTIVITIES = [
  {
    icon: <Bell size={18} />,
    category: "Announcement",
    date: "Oct 08, 2026",
    title: "Winter Reunion 2026 Registration Opens",
    excerpt:
      "Registration is now open for the biggest alumni gathering of the year. Early birds get priority seating and a special welcome kit.",
    color: "#0f766e",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <BookOpen size={18} />,
    category: "Workshop",
    date: "Oct 02, 2026",
    title: "Career Mentorship Program Kicks Off",
    excerpt:
      "120 mentors across IT, banking, and healthcare have signed up. Students can now request one-on-one sessions through the portal.",
    color: "#c2410c",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <Users size={18} />,
    category: "Community",
    date: "Sep 25, 2026",
    title: "New Chapter Launched in Dhaka",
    excerpt:
      "The Dhaka chapter opened with 80 founding members. Monthly meetups begin this November — sign up to be part of the founding circle.",
    color: "#0ea5e9",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ActivitiesSection() {
  return (
    <Box
      id="activities"
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
            From The Desk
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Our Day-to-Day Activities
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            News, announcements, and updates straight from the alumni office.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {ACTIVITIES.map((post) => (
            <Grid key={post.title} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    "& .post-image": { transform: "scale(1.06)" },
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 200,
                    overflow: "hidden",
                    bgcolor: "#e5e7eb",
                  }}
                >
                  <Box
                    className="post-image"
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url('${post.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      bgcolor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      color: post.color,
                    }}
                  >
                    {post.icon}
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {post.category}
                    </Typography>
                  </Box>
                </Box>

                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    {post.date}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      mb: 1.5,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.87rem",
                      color: "text.secondary",
                      lineHeight: 1.65,
                      flexGrow: 1,
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 2,
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Read More <ArrowUpRight size={14} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
