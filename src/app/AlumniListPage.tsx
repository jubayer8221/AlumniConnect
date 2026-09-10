import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  View,
  LayoutGrid,
  Plus,
  Download,
  MoreVertical,
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
import AlumniCard from "@/app/components/AlumniCard";
import AlumniFilters from "@/app/components/AlumniFilters";
import type { GridColDef } from "@mui/x-data-grid";
import type { Alumni } from "@/types/alumni";
import { exportAlumniToCSV } from "@/utils/csvExport";

export default function AlumniListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, totalCount, pageNumber, pageSize, search, filters } =
    useAppSelector((s) => s.alumni);
  const [view, setView] = useState<"table" | "grid">("table");
  const [deleteTarget, setDeleteTarget] = useState<Alumni | null>(null);
  const [actionRow, setActionRow] = useState<{
    alumni: Alumni;
    anchor: HTMLElement | null;
  }>({ alumni: null as unknown as Alumni, anchor: null });

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

  const handleExport = () => {
    exportAlumniToCSV(items);
  };

  const columns: GridColDef[] = [
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
            <Box
              sx={{
                mt: 0.35,
                fontSize: "0.72rem",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ID: {params.row.alumniId}
            </Box>
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
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setActionRow({
                alumni: params.row as Alumni,
                anchor: e.currentTarget,
              });
            }}
          >
            <MoreVertical size={16} />
          </IconButton>
          <Menu
            anchorEl={actionRow.anchor}
            open={actionRow.alumni?.id === (params.row as Alumni).id}
            onClose={() =>
              setActionRow({ alumni: null as unknown as Alumni, anchor: null })
            }
          >
            <MenuItem
              onClick={() => {
                setActionRow({
                  alumni: null as unknown as Alumni,
                  anchor: null,
                });
                navigate(`/alumni/${actionRow.alumni.id}`);
              }}
            >
              <Eye size={16} className="mr-2" /> View
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActionRow({
                  alumni: null as unknown as Alumni,
                  anchor: null,
                });
                navigate(`/alumni/${actionRow.alumni.id}/edit`);
              }}
            >
              <Pencil size={16} className="mr-2" /> Edit
            </MenuItem>
            {!actionRow.alumni?.isVerified && (
              <MenuItem
                onClick={() => {
                  handleVerify(actionRow.alumni);
                  setActionRow({
                    alumni: null as unknown as Alumni,
                    anchor: null,
                  });
                }}
              >
                <BadgeCheck size={16} className="mr-2" /> Verify
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                setDeleteTarget(actionRow.alumni);
                setActionRow({
                  alumni: null as unknown as Alumni,
                  anchor: null,
                });
              }}
              sx={{ color: "error.main" }}
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box>
      <CommonPageHeader
        title="Alumni List"
        subtitle={`${totalCount} alumni registered`}
        breadcrumbs={[
          { label: "Home", path: "/dashboard" },
          { label: "Alumni" },
        ]}
        actions={
          <>
            <CommonButton
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={handleExport}
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
            rows={items as unknown as Record<string, unknown>[]}
            rowCount={totalCount}
            page={pageNumber - 1}
            pageSize={pageSize}
            loading={loading}
            onPaginationModelChange={(m) => {
              handlePage(m.page + 1);
              handlePageSize(m.pageSize);
            }}
            onRowClick={(params) => navigate(`/alumni/${params.id}`)}
            getRowId={(row) => (row as unknown as Alumni).id}
            rowHeight={64}
            height={500}
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
