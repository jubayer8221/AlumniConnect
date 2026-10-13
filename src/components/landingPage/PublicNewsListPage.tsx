import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Container,
  Grid,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import { Calendar, Newspaper, Bell, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { slugify } from "@/utils/slugify";
import { NewsItem } from "./PublicNewsSection";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import CommonBanner from "../common/CommonBanner";
// import PageBanner from "@/components/PageBanner"; // Import your reusable PageBanner component

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

export default function PublicNewsListPage() {
  const { newsList, loading, fetchAllNews } = useNews();

  useEffect(() => {
    void fetchAllNews({ status: "Published", pageNumber: 1, pageSize: 50 });
  }, [fetchAllNews]);

  const items: NewsItem[] = (newsList ?? []).filter(
    (n) => n.Status === "Published" && n.IsActive,
  );

  // Dynamic banner stats based on actual loaded items
  const newsStats = [
    {
      icon: <Newspaper size={22} />,
      value: `${items.length}`,
      label: "Published Stories",
    },
    {
      icon: <Bell size={22} />,
      value: "Official",
      label: "Announcements",
    },
    {
      icon: <TrendingUp size={22} />,
      value: "Live",
      label: "Updates",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <LandingHeader />

      {/* Hero / Page Banner Component */}
      <CommonBanner
        badge="News & Updates"
        title="Stories and News from"
        highlightText="Our Community"
        subtitle="Stay informed about campus milestones, institutional achievements, and inspiring spotlights on fellow alumni."
        stats={newsStats}
      />

      <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {/* Loading skeletons */}
          {loading && items.length === 0 && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rounded"
                    height={340}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <Box
              sx={{
                py: 10,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                color: "text.secondary",
              }}
            >
              <Newspaper size={40} style={{ marginBottom: 12 }} />
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                No news yet
              </Typography>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Please check back later.
              </Typography>
            </Box>
          )}

          {/* News Cards Grid */}
          {items.length > 0 && (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {items.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.NewsID}>
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
                      to={`/news/${item.NewsID}/${slugify(item.Title)}`}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      {/* Image Container */}
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
                      </Box>

                      {/* Content Area */}
                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
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
                            {formatDate(item.PublishedAt ?? item.CreatedAt)}
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
                          {item.Title}
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

      <LandingFooter />
    </Box>
  );
}
