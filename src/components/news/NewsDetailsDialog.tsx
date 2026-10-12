import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { X, Calendar, Tag, User, Newspaper } from "lucide-react";
import type { NewsItem } from "@/components/news/NewsSection";

interface Props {
  open: boolean;
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsDetailsDialog({ open, news, onClose }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!news) return null;

  const published = news.PublishedAt ?? news.CreatedAt;
  const formatted = published
    ? new Date(published).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <Dialog
      disableScrollLock
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, sm: 300 },
          bgcolor: "action.hover",
          backgroundImage: news.Image ? `url(${news.Image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!news.Image && (
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
            <Newspaper size={48} />
          </Box>
        )}
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
          {news.IsBreakingNews && (
            <Chip
              label="Breaking"
              size="small"
              color="error"
              sx={{ fontWeight: 700 }}
            />
          )}
          {news.IsFeatured && (
            <Chip
              label="Featured"
              size="small"
              color="warning"
              sx={{ fontWeight: 600 }}
            />
          )}
          {news.CategoryID && (
            <Chip label={news.CategoryID} size="small" variant="outlined" />
          )}
        </Stack>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {news.Title}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2, color: "text.secondary", flexWrap: "wrap" }}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            <Calendar size={14} />
            <Typography sx={{ fontSize: "0.8rem" }}>{formatted}</Typography>
          </Stack>
          {news.AuthorID && (
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <User size={14} />
              <Typography sx={{ fontSize: "0.8rem" }}>
                {news.AuthorID}
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {news.Summary && (
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "text.primary",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {news.Summary}
          </Typography>
        )}

        <Divider sx={{ mb: 3 }} />

        <Typography
          sx={{
            color: "text.secondary",
            lineHeight: 1.8,
            whiteSpace: "pre-line",
          }}
        >
          {news.Content}
        </Typography>

        {news.Tags?.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                }}
              >
                <Tag size={16} />
              </Box>
              {news.Tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        {news.MetaDescription && (
          <Typography
            sx={{
              mt: 3,
              fontSize: "0.8rem",
              color: "text.disabled",
              fontStyle: "italic",
            }}
          >
            {news.MetaDescription}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
