import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  Stack,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { useEffect } from "react";
import { useNews } from "@/hooks/useNews";

export interface NewsItem {
  NewsID: string;
  Title: string;
  Summary: string;
  Content: string;
  CategoryID: string;
  Tags: string[];
  Image: string;
  AuthorID: string;
  Status: "Draft" | "Published" | "Unpublished";
  IsFeatured: boolean;
  IsBreakingNews: boolean;
  PublishedAt: string | null;
  ScheduledAt: string | null;
  MetaDescription: string;
  IsActive: boolean;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string | null;
}

/* accept both display names and numeric category codes */
const categoryColor: Record<
  string,
  "primary" | "secondary" | "success" | "warning"
> = {
  // numeric codes (used by the admin form)
  "0001": "primary",
  "0002": "secondary",
  "0003": "warning",
  // display names (backward compat)
  Event: "primary",
  Announcement: "secondary",
  Awards: "warning",
};

const categoryLabel: Record<string, string> = {
  "0001": "Event & Homecoming",
  "0002": "Announcement",
  "0003": "Awards & Recognition",
};

export default function NewsSection() {
  const { newsList, loading, fetchAllNews } = useNews();

  useEffect(() => {
    void fetchAllNews({ status: "Published", pageNumber: 1, pageSize: 6 });
  }, [fetchAllNews]);

  const publishedNews = newsList.filter(
    (item) => item.Status === "Published" && item.IsActive,
  );

  return (
    <Box component="section" id="news" sx={{ py: { xs: 6, md: 10 } }}>
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
              News & Announcements
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/news"
            endIcon={<ArrowRight size={16} />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            View all
          </Button>
        </Box>

        {/* Loading skeletons */}
        {loading && publishedNews.length === 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[0, 1, 2].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{ borderRadius: 3.5 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {!loading && publishedNews.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: "text.secondary",
              borderRadius: 3,
            }}
          >
            <Newspaper size={32} style={{ marginBottom: 8 }} />
            <Typography>No news yet. Check back soon.</Typography>
          </Box>
        )}

        {/* Cards */}
        {publishedNews.length > 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {publishedNews.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.NewsID}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3.5,
                    border: "none",
                    boxShadow: "0px 4px 20px rgba(var(--rgb-black), 0.04)",
                    overflow: "hidden",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 12px 30px rgba(var(--rgb-black), 0.08)",
                      "& .news-title": { color: "primary.main" },
                      "& .news-image": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={`/news/${item.NewsID}`}
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
                        pt: "56.25%",
                        bgcolor: "action.hover",
                        overflow: "hidden",
                      }}
                    >
                      {item.Image ? (
                        <Box
                          className="news-image"
                          component="img"
                          src={item.Image}
                          alt={item.Title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/image/logo-small.png";
                          }}
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

                      {item.CategoryID && (
                        <Chip
                          label={
                            categoryLabel[item.CategoryID] ?? item.CategoryID
                          }
                          size="small"
                          color={categoryColor[item.CategoryID] ?? "default"}
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
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
                          {item.PublishedAt
                            ? new Date(item.PublishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Recently"}
                        </Typography>
                      </Stack>

                      <Typography
                        className="news-title"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
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
                        {item.Title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "text.secondary",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.Summary}
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
