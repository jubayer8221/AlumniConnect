import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommonButton,
  CommonPageHeader,
  CommonSearchField,
  CommonConfirmDialog,
} from "@/components/common";
import { useJobs } from "@/hooks/useJobs";
import { useAppDispatch } from "@/hooks";
import { showToast } from "@/store/Slice/uiSlice";
import type { JobItem } from "@/types/job";
import { formatDate } from "@/utils/dateUtils";

export default function JobBoardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    jobs,
    totalCount,
    loading,
    pageNumber,
    pageSize,
    fetchJobs,
    deleteJob,
    setPage,
    setPageSize,
  } = useJobs();

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searchRequest, setSearchRequest] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<JobItem | null>(null);

  useEffect(() => {
    void fetchJobs({
      search: appliedSearch || undefined,
      pageNumber,
      pageSize,
    }).catch((reason: unknown) => {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to load jobs",
          severity: "error",
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearch, pageNumber, pageSize, searchRequest]);

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(search.trim());
    setSearchRequest((c) => c + 1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteJob(deleteTarget.jobID);
      dispatch(
        showToast({
          message: "Job deleted successfully.",
          severity: "success",
        }),
      );
    } catch (reason) {
      dispatch(
        showToast({
          message:
            reason instanceof Error ? reason.message : "Unable to delete job",
          severity: "error",
        }),
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <CommonPageHeader
        title="Job Board"
        // subtitle={`${totalCount} job posting${totalCount === 1 ? "" : "s"} total`}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Job Board" },
        ]}
        actions={
          <CommonButton
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/alumni/explore/job-board/new")}
          >
            Post Job
          </CommonButton>
        }
      />

      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
          <CommonSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by title, company, or location..."
            fullWidth
          />
        </Box>
        <CommonButton
          startIcon={<Search size={17} />}
          onClick={handleSearch}
          sx={{ px: 3, py: 1.25 }}
        >
          Search
        </CommonButton>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          p: 2,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Deadline</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      No jobs found. Click "Post Job" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {jobs.map((job) => (
                <TableRow key={job.jobID} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {job.title}
                      {job.isFeatured && (
                        <Chip
                          label="Featured"
                          size="small"
                          color="warning"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      )}
                    </Box>
                    {job.location && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {job.location}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {job.company}
                  </TableCell>
                  <TableCell>
                    {job.employmentType ? (
                      <Chip
                        label={job.employmentType}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {job.deadline ? formatDate(job.deadline) : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={job.isActive ? "Active" : "Inactive"}
                      color={job.isActive ? "success" : "default"}
                      variant="outlined"
                      icon={
                        job.isActive ? <Eye size={12} /> : <EyeOff size={12} />
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/alumni/explore/job-board/${job.jobID}/edit`)
                        }
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(job)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Loading jobs…
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={pageNumber - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, nextPage) => setPage(nextPage + 1)}
          onRowsPerPageChange={(event) => {
            setPageSize(Number(event.target.value));
          }}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Card>

      <CommonConfirmDialog
        open={!!deleteTarget}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
