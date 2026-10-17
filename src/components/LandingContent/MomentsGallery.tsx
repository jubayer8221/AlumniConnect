import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanding } from "@/hooks/useLanding";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";
import type { GalleryPhoto } from "@/store/Slice/landingSlice";
import {
  CommonPageHeader,
  CommonButton,
  CommonConfirmDialog,
  CommonEmptyState,
  CommonErrorState,
  CommonPagination,
} from "@/components/common";

export default function AdminGalleryListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    galleryPhotos,
    loading,
    error,
    fetchLandingContent,
    deleteGalleryPhoto,
  } = useLanding();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null);

  /* Matches your router:
     - list:  /alumni/explore/gallery
     - new:   /alumni/explore/gallery/new
     - edit:  /alumni/explore/gallery/:id  */
  const basePath = "/alumni/explore/gallery";
  const homePath = "/dashboard";

  useEffect(() => {
    void fetchLandingContent();
  }, [fetchLandingContent]);

  /* ---------- Base list (sorted by displayOrder) ---------- */
  const allPhotos: GalleryPhoto[] = useMemo(() => {
    const list = [...(galleryPhotos ?? [])];
    list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return list;
  }, [galleryPhotos]);

  /* ---------- Search ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allPhotos;
    return allPhotos.filter((p) => (p.caption ?? "").toLowerCase().includes(q));
  }, [allPhotos, search]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* ---------- Pagination math ---------- */
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paged = useMemo(
    () => filtered.slice(startIdx, endIdx),
    [filtered, startIdx, endIdx],
  );

  /* ---------- Actions ---------- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteGalleryPhoto(target.photoID);
      dispatch(
        showToast({
          message: target.caption
            ? `"${target.caption}" deleted`
            : "Photo deleted",
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message:
            err instanceof Error ? err.message : "Unable to delete photo",
          severity: "error",
        }),
      );
    }
  };

  const goToNew = () => navigate(`${basePath}/new`);
  const goToEdit = (photoID: string) => navigate(`${basePath}/${photoID}`);

  return (
    <Box>
      <CommonPageHeader
        title="Gallery"
        subtitle={`${totalCount} ${totalCount === 1 ? "photo" : "photos"} total`}
        breadcrumbs={[
          { label: "Home", path: homePath },
          { label: "Explore" },
          { label: "Gallery" },
        ]}
        actions={
          <CommonButton startIcon={<Plus size={18} />} onClick={goToNew}>
            Add Photo
          </CommonButton>
        }
      />

      {/* ---------- Search ---------- */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 240, maxWidth: 420 }}>
          <TextField
            size="small"
            placeholder="Search by caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} style={{ opacity: 0.6 }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        </Box>
      </Box>

      {/* ---------- Loading ---------- */}
      {loading && allPhotos.length === 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              sx={{ height: { xs: 160, md: 220 }, borderRadius: 3 }}
            />
          ))}
        </Box>
      )}

      {/* ---------- Error ---------- */}
      {!loading && error && allPhotos.length === 0 && (
        <CommonErrorState
          message={error}
          onRetry={() => void fetchLandingContent(true)}
        />
      )}

      {/* ---------- Empty ---------- */}
      {!loading && !error && filtered.length === 0 && (
        <CommonEmptyState
          title={search ? "No matching photos" : "No photos yet"}
          message={
            search
              ? "Try a different search term or clear the search."
              : "Add your first gallery photo to get started."
          }
          icon={<ImageIcon size={48} />}
        />
      )}

      {/* ---------- Grid ---------- */}
      {filtered.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {paged.map((photo) => (
            <Box
              key={photo.photoID}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.25s ease",
                "& .gallery-actions": {
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                },
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  "& .gallery-actions": { opacity: 1 },
                  "& .gallery-img": { transform: "scale(1.04)" },
                },
              }}
            >
              {/* Image → click to edit */}
              <Box
                onClick={() => goToEdit(photo.photoID)}
                sx={{
                  position: "relative",
                  pt: "70%",
                  cursor: "pointer",
                  overflow: "hidden",
                  bgcolor: "action.hover",
                }}
              >
                <Box
                  className="gallery-img"
                  component="img"
                  src={photo.imageURL}
                  alt={photo.caption ?? "Gallery photo"}
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

                <Chip
                  label={photo.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={photo.isActive ? "success" : "default"}
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 3,
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: 22,
                  }}
                />

                {photo.span === 2 && (
                  <Chip
                    label="Wide"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 76,
                      zIndex: 3,
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      height: 22,
                      bgcolor: "info.main",
                      color: "common.white",
                    }}
                  />
                )}

                <Stack
                  className="gallery-actions"
                  direction="row"
                  spacing={0.75}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 3,
                  }}
                >
                  <IconButton
                    size="small"
                    aria-label="Edit photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToEdit(photo.photoID);
                    }}
                    sx={{
                      bgcolor: "rgba(var(--rgb-white), 0.92)",
                      color: "primary.main",
                      backdropFilter: "blur(6px)",
                      "&:hover": { bgcolor: "var(--color-white)" },
                    }}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="Delete photo"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(photo);
                    }}
                    sx={{
                      bgcolor: "rgba(var(--rgb-white), 0.92)",
                      color: "error.main",
                      backdropFilter: "blur(6px)",
                      "&:hover": { bgcolor: "var(--color-white)" },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              </Box>

              {/* Footer */}
              <Box sx={{ p: 1.75 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "2.4em",
                  }}
                >
                  {photo.caption || (
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      Untitled
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Order: {photo.displayOrder ?? 0}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ---------- Pagination ---------- */}
      {filtered.length > 0 && (
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 2 }}
          >
            Showing{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {totalCount === 0 ? 0 : startIdx + 1}–{endIdx}
            </Box>{" "}
            of{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {totalCount}
            </Box>{" "}
            {totalCount === 1 ? "photo" : "photos"}
          </Typography>

          <CommonPagination
            count={totalPages}
            page={page}
            pageSize={pageSize}
            onChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Box>
      )}

      {/* ---------- Delete confirmation ---------- */}
      <CommonConfirmDialog
        open={!!deleteTarget}
        title="Delete Photo"
        message={
          deleteTarget?.caption
            ? `Are you sure you want to delete "${deleteTarget.caption}"? This cannot be undone.`
            : "Are you sure you want to delete this photo? This cannot be undone."
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
