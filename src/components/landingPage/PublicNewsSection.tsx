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
import { slugify } from "@/utils/slugify";

/* ---------- shared type ---------- */
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

/* ---------- local render shape ---------- */
interface NewsCardItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

const categoryColor: Record<
  string,
  "primary" | "secondary" | "success" | "warning"
> = {
  "0001": "primary",
  "0002": "secondary",
  "0003": "warning",
  Event: "primary",
  Announcement: "secondary",
  Awards: "warning",
};

const categoryLabel: Record<string, string> = {
  "0001": "Event",
  "0002": "Announcement",
  "0003": "Awards",
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const mapToCard = (n: NewsItem): NewsCardItem => ({
  id: n.NewsID,
  title: n.Title,
  excerpt: n.Summary ?? "",
  date: formatDate(n.PublishedAt ?? n.CreatedAt),
  category: categoryLabel[n.CategoryID] ?? n.CategoryID ?? "News",
  image: n.Image || undefined,
});

const NEWS_PER_ROW = 4;

export default function NewsSection() {
  const { newsList, loading, fetchAllNews } = useNews();

  useEffect(() => {
    void fetchAllNews({
      status: "Published",
      pageNumber: 1,
      pageSize: NEWS_PER_ROW,
    });
  }, [fetchAllNews]);

  const published = (newsList ?? []).filter(
    (n) => n.Status === "Published" && n.IsActive,
  );
  const newsItems: NewsCardItem[] = published
    .slice(0, NEWS_PER_ROW)
    .map(mapToCard);

  return (
    <Box
      component="section"
      id="news"
      sx={{ py: 6, bgcolor: "background.default" }}
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
            mb: { xs: 2, md: 2 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Latest Updates
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1,
              }}
            >
              News
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

        {/* Loading */}
        {loading && newsItems.length === 0 && (
          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {[0, 1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty */}
        {!loading && newsItems.length === 0 && (
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
        )}

        {/* Cards */}
        {newsItems.length > 0 && (
          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {newsItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
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
                    to={`/news/${item.id}/${slugify(item.title)}`}
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
                        pt: "56.25%",
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
                          loading="lazy"
                          decoding="async"
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

                      <Chip
                        label={item.category}
                        size="small"
                        color={categoryColor[item.category] ?? "default"}
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          height: 22,
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 2.25,
                        "&:last-child": { pb: 2.25 },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.75}
                        sx={{
                          color: "text.secondary",
                          mb: 0.75,
                          alignItems: "center",
                        }}
                      >
                        <Calendar size={13} />
                        <Typography
                          sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                        >
                          {item.date}
                        </Typography>
                      </Stack>

                      <Typography
                        className="news-title"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          lineHeight: 1.4,
                          color: "text.primary",
                          mb: 0.75,
                          transition: "color 0.2s ease",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.55rem",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                          lineHeight: 1.55,
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
