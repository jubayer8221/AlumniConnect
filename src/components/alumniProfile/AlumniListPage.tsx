import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  View,
  LayoutGrid,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniAsync,
  setSearch,
  setPage,
  setPageSize,
  setSort,
  deleteAlumniAsync,
  verifyAlumniAsync,
} from "@/Slice/alumniSlice";
import { showToast } from "@/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonDataGrid,
  CommonPagination,
  CommonEmptyState,
  CommonLoading,
  CommonConfirmDialog,
  CommonStatusBadge,
  CommonButton,
  CommonAvatar,
} from "@/components/common";
import AlumniCard from "@/components/alumniProfile/AlumniCard";
import AlumniFilters from "@/components/alumniProfile/AlumniFilters";
import type { GridColDef } from "@mui/x-data-grid";
import type { Alumni } from "@/types/alumni";
import { exportAlumniToCSV } from "@/utils/csvExport";
import { alumniService } from "@/services";

export default function AlumniListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items,
    loading,
    totalCount,
    pageNumber,
    pageSize,
    search,
    filters,
    sortBy,
    sortDirection,
  } = useAppSelector((s) => s.alumni);
  const [view, setView] = useState<"table" | "grid">("table");
  const [exporting, setExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Alumni | null>(null);

  const load = useCallback(() => {
    dispatch(fetchAlumniAsync());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load, pageNumber, pageSize, search, filters]);

  const handleSearch = (val: string) => {
    dispatch(setSearch(val));
  };
  const handlePage = (p: number) => {
    dispatch(setPage(p));
  };
  const handlePageSize = (s: number) => {
    dispatch(setPageSize(s));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await dispatch(deleteAlumniAsync(deleteTarget.id));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({
          message: "Alumni deleted successfully",
          severity: "success",
        }),
      );
      load();
    } else {
      dispatch(
        showToast({ message: "Failed to delete alumni", severity: "error" }),
      );
    }
    setDeleteTarget(null);
  };

  const handleVerify = async (alumni: Alumni) => {
    const res = await dispatch(verifyAlumniAsync(alumni.id));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        showToast({
          message: "Alumni verified successfully",
          severity: "success",
        }),
      );
      load();
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportedAlumni = new Map<string, Alumni>();
      const exportPageSize = 100;
      let exportPage = 1;
      let exportTotalCount = Number.POSITIVE_INFINITY;

      while (exportedAlumni.size < exportTotalCount) {
        const response = await alumniService.getAll({
          pageNumber: exportPage,
          pageSize: exportPageSize,
          search,
          filters,
          sortBy: "fullName",
          sortDirection: "asc",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to load alumni");
        }

        exportTotalCount = response.data.totalCount;
        const previousCount = exportedAlumni.size;
        response.data.items.forEach((alumni) =>
          exportedAlumni.set(alumni.id, alumni),
        );

        if (
          response.data.items.length === 0 ||
          exportedAlumni.size === previousCount
        ) {
          break;
        }
        exportPage += 1;
      }

      exportAlumniToCSV(Array.from(exportedAlumni.values()));
      dispatch(
        showToast({
          message: `${exportedAlumni.size} alumni exported successfully`,
          severity: "success",
        }),
      );
    } catch (error) {
      dispatch(
        showToast({
          message:
            error instanceof Error ? error.message : "Failed to export alumni",
          severity: "error",
        }),
      );
    } finally {
      setExporting(false);
    }
  };

  const columns: GridColDef<Alumni>[] = [
    {
      field: "serial",
      headerName: "#",
      width: 64,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ color: "text.secondary", fontWeight: 600 }}>
          {(pageNumber - 1) * pageSize +
            items.findIndex((item) => item.id === params.row.id) +
            1}
        </Box>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 270,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: 0,
            width: "100%",
          }}
        >
          <CommonAvatar
            src={params.row.profilePhoto as string | undefined}
            name={params.row.fullName as string}
            size={40}
            sx={{
              flexShrink: 0,
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          />
          <Box sx={{ minWidth: 0, lineHeight: 1.2 }}>
            <Box
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.row.fullName}
            </Box>
            {/* <Box
              sx={{
                mt: 0.35,
                fontSize: "0.72rem",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              id: {params.row.alumniId}
            </Box> */}
          </Box>
        </Box>
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "departmentName", headerName: "Department", width: 160 },
    { field: "batch", headerName: "Batch", width: 80 },
    { field: "graduationYear", headerName: "Grad Year", width: 100 },
    { field: "companyName", headerName: "Company", width: 160 },
    { field: "designation", headerName: "Designation", width: 160 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => <CommonStatusBadge status={params.row.status} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box onClick={(event) => event.stopPropagation()} sx={{ gap: 1 }}>
          <Tooltip title="View alumni">
            <IconButton
              size="small"
              aria-label={`View ${row.fullName}`}
              onClick={() => navigate(`/alumni/${row.id}`)}
              sx={{
                color: "text.secondary",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              <Eye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit alumni">
            <IconButton
              sx={{
                color: "text.secondary",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
              size="small"
              aria-label={`Edit ${row.fullName}`}
              onClick={() => navigate(`/alumni/${row.id}/edit`)}
            >
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          {/* {!row.isVerified && (
            <Tooltip title="Verify alumni">
              <IconButton
                size="small"
                aria-label={`Verify ${row.fullName}`}
                onClick={() => void handleVerify(row)}
              >
                <BadgeCheck size={16} />
              </IconButton>
            </Tooltip>
          )} */}
          {/* <Tooltip title="Delete alumni">
            <IconButton
              size="small"
              aria-label={`Delete ${row.fullName}`}
              sx={{ color: "error.main" }}
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip> */}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title="Alumni Directory"
        subtitle={`${totalCount} alumni registered`}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Alumni Directory" },
        ]}
        actions={
          <>
            <CommonButton
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={handleExport}
              loading={exporting}
            >
              Export CSV
            </CommonButton>
            <CommonButton
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/alumni/create")}
            >
              Add Alumni
            </CommonButton>
          </>
        }
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 250 }}>
          <CommonSearchField
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, company, profession..."
          />
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
        >
          <ToggleButton value="table">
            <View size={16} />
          </ToggleButton>
          <ToggleButton value="grid">
            <LayoutGrid size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <AlumniFilters />

      {loading ? (
        <CommonLoading fullHeight={false} />
      ) : items.length === 0 ? (
        <CommonEmptyState
          title="No alumni found"
          message="No alumni match your search criteria."
          actionLabel="Add Alumni"
          onAction={() => navigate("/alumni/create")}
        />
      ) : view === "table" ? (
        <>
          <CommonDataGrid
            columns={columns}
            rows={items}
            rowCount={totalCount}
            page={pageNumber - 1}
            pageSize={pageSize}
            sortModel={[{ field: sortBy, sort: sortDirection }]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            loading={loading}
            hideFooter
            onPaginationModelChange={(m) => {
              if (m.pageSize !== pageSize) {
                handlePageSize(m.pageSize);
              } else {
                handlePage(m.page + 1);
              }
            }}
            onSortModelChange={(model) => {
              const sort = model[0];
              dispatch(
                setSort({
                  sortBy: sort?.field ?? "fullName",
                  sortDirection: sort?.sort ?? "asc",
                }),
              );
            }}
            getRowId={(row) => row.id}
            rowHeight={64}
            height={Math.max(260, items.length * 64 + 120)}
          />
          <CommonPagination
            count={Math.ceil(totalCount / pageSize)}
            page={pageNumber}
            onChange={handlePage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSize}
          />
        </>
      ) : (
        <Grid container spacing={2}>
          {items.map((alum) => (
            <Grid key={alum.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AlumniCard
                alumni={alum}
                onEdit={() => navigate(`/alumni/${alum.id}/edit`)}
                onDelete={() => setDeleteTarget(alum)}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <CommonPagination
              count={Math.ceil(totalCount / pageSize)}
              page={pageNumber}
              onChange={handlePage}
              pageSize={pageSize}
              onPageSizeChange={handlePageSize}
            />
          </Grid>
        </Grid>
      )}

      <CommonConfirmDialog
        open={!!deleteTarget}
        title="Delete Alumni"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
