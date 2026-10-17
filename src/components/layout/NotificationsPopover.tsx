import { useEffect, useState } from "react";
import {
  Popover,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
  Badge,
} from "@mui/material";
import { Bell, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotices } from "@/hooks/useNotices";
import { formatDate, fromNow } from "@/utils/dateUtils";

interface NotificationsPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const STORAGE_KEY = "notices_last_seen_at";

export function getUnseenNoticeCount(
  notices: { id: string; publishDate: string; status: string }[],
): number {
  const lastSeen = localStorage.getItem(STORAGE_KEY);
  if (!lastSeen) return notices.filter((n) => n.status === "PUBLISHED").length;

  const lastSeenTime = Date.parse(lastSeen);
  return notices.filter(
    (n) => n.status === "PUBLISHED" && Date.parse(n.publishDate) > lastSeenTime,
  ).length;
}

export default function NotificationsPopover({
  anchorEl,
  onClose,
}: NotificationsPopoverProps) {
  const navigate = useNavigate();
  const { items, loading, fetchNotices } = useNotices();
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  // Fetch notices once if empty
  useEffect(() => {
    if (!items || items.length === 0) {
      void fetchNotices({ pageNumber: 1, pageSize: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the "last seen" marker whenever the popover opens
  useEffect(() => {
    if (anchorEl) {
      setLastSeen(localStorage.getItem(STORAGE_KEY));
    }
  }, [anchorEl]);

  const published = items.filter((n) => n.status === "PUBLISHED");

  const isUnread = (publishDate: string) =>
    !lastSeen || Date.parse(publishDate) > Date.parse(lastSeen);

  const handleOpenNotice = (id: string) => {
    // Mark this moment as "last seen" before navigating
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    onClose();
    navigate(`/alumni/explore/notices/${id}`);
  };

  const handleViewAll = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    onClose();
    navigate("/alumni/explore/notices");
  };

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            mt: 1,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: 480,
            overflowY: "auto",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Bell size={18} />
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
            Notifications
          </Typography>
        </Box>
        <Chip
          label={`${published.length} notices`}
          size="small"
          sx={{ fontSize: "0.7rem", fontWeight: 600 }}
        />
      </Box>
      <Divider />

      {loading && published.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        </Box>
      ) : published.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Bell size={36} color="var(--color-gray200)" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No notifications yet
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {published.slice(0, 10).map((notice, i) => (
            <Box key={notice.id}>
              <ListItemButton
                onClick={() => handleOpenNotice(notice.id)}
                sx={{
                  px: 2,
                  py: 1.5,
                  alignItems: "flex-start",
                  bgcolor: isUnread(notice.publishDate)
                    ? "rgba(var(--rgb-chart-indigo), 0.06)"
                    : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                  <Badge
                    variant="dot"
                    color="primary"
                    invisible={!isUnread(notice.publishDate)}
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(var(--rgb-warning), 0.12)",
                        color: "var(--color-warning)",
                        width: 34,
                        height: 34,
                      }}
                    >
                      <Bell size={16} />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isUnread(notice.publishDate) ? 700 : 500,
                        mb: 0.25,
                      }}
                    >
                      {notice.title}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <Chip
                        label={notice.category}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          borderRadius: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {fromNow(notice.publishDate)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
              {i < Math.min(published.length, 10) - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}

      {published.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 1 }}>
            <Button
              fullWidth
              size="small"
              startIcon={<Eye size={16} />}
              onClick={handleViewAll}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              View all notices
            </Button>
          </Box>
        </>
      )}
    </Popover>
  );
}
