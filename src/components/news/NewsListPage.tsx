import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";
import { hasAdminAccess } from "@/utils/authUtils";
import type { NewsItem } from "@/components/news/NewsSection";
import NewsDetailsDialog from "./NewsDetailsDialog";

const categoryLabel: Record<string, string> = {
  "0001": "Event & Homecoming",
  "0002": "Announcement",
  "0003": "Awards & Recognition",
};

export default function NewsListPage() {
  const navigate = useNavigate();
  const { newsList, loading, fetchAllNews, deleteNews } = useNews();
  const { role } = useAuth();
  const canManageNews = hasAdminAccess(role);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    void fetchAllNews({ pageNumber: 1, pageSize: 100 });
  }, [fetchAllNews]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this news article?")) return;
    try {
      await deleteNews(id);
    } catch {
      // error is surfaced via the store
    }
  };

  const getStatusColor = (status: NewsItem["Status"]) => {
    switch (status) {
      case "Published":
        return "success";
      case "Draft":
        return "warning";
      case "Unpublished":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            News Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, edit, and publish updates and announcements for the portal.
          </Typography>
        </Box>
        {canManageNews && <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/alumni/news/create")}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          Add News Article
        </Button>}
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: "none",
          boxShadow: "0px 4px 20px rgba(var(--rgb-black), 0.04)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                newsList.length === 0 &&
                [0, 1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton variant="text" height={40} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && newsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No news articles yet. Click “Add News Article” to create
                      one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {newsList.map((news) => (
                <TableRow key={news.NewsID} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {news.Title}
                    <Typography variant="caption" color="text.secondary">
                      {news.Summary?.substring(0, 60) ?? ""}
                      {news.Summary && news.Summary.length > 60 ? "…" : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={categoryLabel[news.CategoryID] ?? news.CategoryID}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={news.Status}
                      size="small"
                      color={getStatusColor(news.Status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                  >
                    {news.CreatedAt
                      ? new Date(news.CreatedAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedNews(news)}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    {canManageNews && <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/alumni/news/edit/${news.NewsID}`)
                        }
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>}
                    {canManageNews && <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(news.NewsID)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <NewsDetailsDialog
        open={!!selectedNews}
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </Container>
  );
}
