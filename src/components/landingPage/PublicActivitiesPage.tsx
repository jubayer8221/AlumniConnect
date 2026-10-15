import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "@/components/common/CommonBanner";
import { CommonButton } from "@/components/common";
import { ACTIVITIES } from "@/data/activities";

export default function PublicActivitiesPage() {
  const navigate = useNavigate();

  const bannerStats = [
    {
      icon: <Bell size={22} />,
      value: `${ACTIVITIES.length}`,
      label: "Announcements",
    },
    {
      icon: <CalendarDays size={22} />,
      value: "Weekly",
      label: "Updates",
    },
    {
      icon: <TrendingUp size={22} />,
      value: "Live",
      label: "From the Desk",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      <CommonBanner
        badge="From The Desk"
        title="Our Day-to-Day"
        highlightText="Activities"
        subtitle="News, announcements, and updates straight from the alumni office."
        stats={bannerStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ---------- Page header + back ---------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "flex-end" },
              gap: 3,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Activities
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                Our Day-to-Day Activities
              </Typography>
              {/* <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  maxWidth: 560,
                }}
              >
                {ACTIVITIES.length}{" "}
                {ACTIVITIES.length === 1 ? "story" : "stories"} available.
              </Typography> */}
            </Box>

            <CommonButton
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                whiteSpace: "nowrap",
                alignSelf: { xs: "flex-start", md: "auto" },
              }}
            >
              Back
            </CommonButton>
          </Box>

          {/* ---------- Cards ---------- */}
          <Grid container spacing={3}>
            {ACTIVITIES.map((post) => (
              <Grid key={post.id} size={{ xs: 12, md: 4 }}>
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
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(var(--rgb-black), 0.08)",
                      borderColor: "primary.main",
                      "& .post-image": { transform: "scale(1.06)" },
                      "& .post-title": { color: "primary.dark" },
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={`/activities/${post.id}`}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 200,
                        overflow: "hidden",
                        bgcolor: "action.hover",
                      }}
                    >
                      <Box
                        className="post-image"
                        component="img"
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        sx={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
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
                          bgcolor: "rgba(var(--rgb-white), 0.95)",
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
                        className="post-title"
                        sx={{
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          lineHeight: 1.4,
                          mb: 1.5,
                          color: "primary.main",
                          transition: "color 0.2s ease",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
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
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
}
