import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ACTIVITIES } from "@/data/activities";

export default function ActivitiesSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* ---------- Header ---------- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-end" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              From The Desk
            </Typography>
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                // mb: 1,
              }}
            >
              Our Day-to-Day Activities
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/activities"
            endIcon={<ArrowRight size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              color: "primary.main",
            }}
          >
            View All
          </Button>
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
                  {/* Image */}
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

                    {/* ★ Title — primary.main */}
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
  );
}
