import { useEffect, useState } from "react";
import {
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Plus,
  Bell,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Send,
  Archive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { useNotices } from "@/hooks/useNotices";
import { useAuth } from "@/hooks/useAuth";
import { hasAdminAccess } from "@/utils/authUtils";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonEmptyState,
  CommonLoading,
  CommonButton,
  CommonStatusBadge,
  CommonConfirmDialog,
} from "@/components/common";
import { formatDate } from "@/utils/dateUtils";
import type { Notice } from "@/types/notice";

export default function NoticeListPage({
  isAdmin: adminView = false,
}: {
  isAdmin?: boolean;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = adminView || hasAdminAccess(role);
  const {
    items,
    loading,
    totalCount,
    search,
    error,
    fetchNotices,
    deleteNotice,
    publishNotice,
    unpublishNotice,
    setSearch,
  } = useNotices();
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    notice: Notice;
    anchor: HTMLElement | null;
  }>({ notice: null as unknown as Notice, anchor: null });

  // ★ Fetch only if the store is empty
  useEffect(() => {
    if (!items || items.length === 0) {
      void fetchNotices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNotice(deleteTarget.id);
      dispatch(
        showToast({
          message: "Notice deleted successfully",
          severity: "success",
        }),
      );
    } catch {
      // Request error is reflected in the notice state.
    }
    setDeleteTarget(null);
  };

  const handlePublish = async (notice: Notice) => {
    try {
      await publishNotice(notice.id);
      dispatch(showToast({ message: "Notice published", severity: "success" }));
    } catch {
      // Request error is reflected in the notice state.
    }
    setActionTarget({ notice: null as unknown as Notice, anchor: null });
  };

  const handleUnpublish = async (notice: Notice) => {
    try {
      await unpublishNotice(notice.id);
      dispatch(showToast({ message: "Notice unpublished", severity: "info" }));
    } catch {
      // Request error is reflected in the notice state.
    }
    setActionTarget({ notice: null as unknown as Notice, anchor: null });
  };

  const basePath = "/alumni/explore/notices";
  const visibleItems = isAdmin
    ? items
    : items.filter((n: any) => n.status === "PUBLISHED");

  return (
    <Box>
      <CommonPageHeader
        title="Notices & News"
        subtitle={`${totalCount} notices total`}
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Notices" },
        ]}
        actions={
          isAdmin ? (
            <CommonButton
              startIcon={<Plus size={18} />}
              onClick={() => navigate(`${basePath}/create`)}
            >
              Create
            </CommonButton>
          ) : undefined
        }
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 250 }}>
          <CommonSearchField
            value={search}
            onChange={(v) => {
              setSearch(v);
              void fetchNotices({ pageNumber: 1, pageSize: 10, search: v });
            }}
            placeholder="Search notices..."
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CommonLoading fullHeight={false} />
      ) : visibleItems.length === 0 ? (
        <CommonEmptyState
          title="No notices available"
          message="Check back later for updates."
          icon={<Bell size={48} className="text-gray-300" />}
        />
      ) : (
        <Grid container spacing={2}>
          {visibleItems.map((notice) => (
            <Grid key={notice.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      <Chip
                        label={notice.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <CommonStatusBadge status={notice.status} />
                    </Box>
                    {isAdmin && (
                      <IconButton
                        size="small"
                        onClick={(e) =>
                          setActionTarget({ notice, anchor: e.currentTarget })
                        }
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 1, cursor: "pointer", fontWeight: 700 }}
                    onClick={() => navigate(`${basePath}/${notice.id}`)}
                  >
                    {notice.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "text.secondary",
                    }}
                  >
                    {notice.content}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatDate(notice.publishDate)}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate(`${basePath}/${notice.id}`)}
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={actionTarget.anchor}
        open={!!actionTarget.anchor}
        onClose={() =>
          setActionTarget({ notice: null as unknown as Notice, anchor: null })
        }
      >
        <MenuItem
          onClick={() => {
            navigate(`${basePath}/${actionTarget.notice.id}`);
            setActionTarget({
              notice: null as unknown as Notice,
              anchor: null,
            });
          }}
        >
          <Eye size={16} className="mr-2" /> View
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`${basePath}/${actionTarget.notice.id}/edit`);
            setActionTarget({
              notice: null as unknown as Notice,
              anchor: null,
            });
          }}
        >
          <Pencil size={16} className="mr-2" /> Edit
        </MenuItem>
        {actionTarget.notice?.status === "DRAFT" && (
          <MenuItem onClick={() => handlePublish(actionTarget.notice)}>
            <Send size={16} className="mr-2" /> Publish
          </MenuItem>
        )}
        {actionTarget.notice?.status === "PUBLISHED" && (
          <MenuItem onClick={() => handleUnpublish(actionTarget.notice)}>
            <Archive size={16} className="mr-2" /> Unpublish
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setDeleteTarget(actionTarget.notice);
            setActionTarget({
              notice: null as unknown as Notice,
              anchor: null,
            });
          }}
          sx={{ color: "error.main" }}
        >
          <Trash2 size={16} className="mr-2" /> Delete
        </MenuItem>
      </Menu>

      <CommonConfirmDialog
        open={!!deleteTarget}
        title="Delete Notice"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
