import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

interface NewsItem {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  href?: string;
}

// Replace with your real data (or wire to redux/react-query).
const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Annual Alumni Homecoming 2026 — Save the Date",
    excerpt:
      "Join hundreds of graduates for a weekend of celebrations, networking, and memories. Registration opens next month.",
    date: "Mar 15, 2026",
    category: "Event",
    image: "/image/news/homecoming.jpg",
  },
  {
    id: 2,
    title: "New Scholarship Fund Supports 50 Students",
    excerpt:
      "The Alumni Association has launched a $250K scholarship initiative to support first-generation students.",
    date: "Feb 28, 2026",
    category: "Announcement",
    image: "/image/news/scholarship.jpg",
  },
  {
    id: 3,
    title: "Distinguished Alumni Awards — Call for Nominations",
    excerpt:
      "Nominate a fellow alum whose career and service inspire our community. Submissions close April 30.",
    date: "Feb 10, 2026",
    category: "Awards",
    image: "/image/news/awards.jpg",
  },
];

const categoryColor: Record<
  string,
  "primary" | "secondary" | "success" | "warning"
> = {
  Event: "primary",
  Announcement: "secondary",
  Awards: "warning",
};

export default function NewsSection() {
  return (
    <Box
      component="section"
      id="news"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            gap: 2,
            mb: { xs: 4, md: 5 },
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
              Latest Updates
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              News &amp; Announcements
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/landing/news"
            endIcon={<ArrowRight size={16} />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            View all news
          </Button>
        </Box>

        {/* Cards */}
        {newsItems.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: "text.secondary",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Newspaper size={32} style={{ marginBottom: 8 }} />
            <Typography>No news yet. Check back soon.</Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {newsItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-4px)",
                      boxShadow: (t) => t.shadows[6],
                      "& .news-title": { color: "primary.main" },
                      "& .news-image": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={item.href ?? `/landing/news/${item.id}`}
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
                        pt: "56.25%", // 16:9
                        bgcolor: "action.hover",
                        overflow: "hidden",
                      }}
                    >
                      {item.image ? (
                        <Box
                          className="news-image"
                          component="img"
                          src={item.image}
                          alt={item.title}
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.disabled",
                          }}
                        >
                          <Newspaper size={36} />
                        </Box>
                      )}

                      <Chip
                        label={item.category}
                        size="small"
                        color={categoryColor[item.category] ?? "default"}
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
                        // alignItems="center"
                        sx={{
                          color: "text.secondary",
                          mb: 1,
                          alignItems: "center",
                        }}
                      >
                        <Calendar size={14} />
                        <Typography
                          sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                        >
                          {item.date}
                        </Typography>
                      </Stack>

                      <Typography
                        className="news-title"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          lineHeight: 1.4,
                          color: "text.primary",
                          mb: 1,
                          transition: "color 0.2s ease",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: "text.secondary",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.excerpt}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
