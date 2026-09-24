import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { ArrowLeft, Bell } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchNoticeByIdAsync } from "@/Slice/noticeSlice";
import {
  CommonPageHeader,
  CommonLoading,
  CommonEmptyState,
  CommonStatusBadge,
} from "@/components/common";
import { formatDate } from "@/utils/dateUtils";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";

export default function NoticeDetailsPage({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedNotice, loading } = useAppSelector((s) => s.notices);
  const basePath = isAdmin ? "/notices" : "/alumni/notices";
  const { setBreadcrumbLabel, clearBreadcrumbLabel } = useBreadcrumbLabels();

  useEffect(() => {
    if (id) dispatch(fetchNoticeByIdAsync(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;
    if (selectedNotice)
      setBreadcrumbLabel(location.pathname, selectedNotice.title);
    return () => clearBreadcrumbLabel(location.pathname);
  }, [
    clearBreadcrumbLabel,
    id,
    location.pathname,
    selectedNotice,
    setBreadcrumbLabel,
  ]);

  if (loading && !selectedNotice) return <CommonLoading />;
  if (!selectedNotice) return <CommonEmptyState title="Notice not found" />;

  return (
    <Box>
      <CommonPageHeader
        title="Notice Details"
        breadcrumbs={[
          { label: "Home", path: isAdmin ? "/dashboard" : "/alumni/dashboard" },
          { label: "Notices", path: basePath },
          { label: selectedNotice.title },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(basePath)}
          >
            Back
          </Button>
        }
      />
      <Card
        sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
            <Chip
              label={selectedNotice.category}
              color="primary"
              size="small"
            />
            <CommonStatusBadge status={selectedNotice.status} />
          </Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
            {selectedNotice.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 3,
              color: "text.secondary",
            }}
          >
            <Bell size={14} /> Published on{" "}
            {formatDate(selectedNotice.publishDate)}{" "}
            {selectedNotice.author ? `by ${selectedNotice.author}` : ""}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {selectedNotice.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
