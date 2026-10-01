import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  alpha,
  Typography,
} from "@mui/material";
import { List, LayoutGrid, Eye, Pencil, BadgeCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniAsync,
  setSearch,
  setPage,
  setPageSize,
  setSort,
} from "@/Slice/alumniSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonPagination,
  CommonEmptyState,
  CommonLoading,
  CommonAvatar,
  CommonStatusBadge,
  CommonButton,
  CommonDataGrid,
} from "@/components/common";
import AlumniCard from "@/components/alumniProfile/AlumniCard";
import AlumniFilters from "@/components/alumniProfile/AlumniFilters";
import type { GridColDef } from "@mui/x-data-grid";
import type { Alumni } from "@/types/alumni";

const NAVY = "#132038";
const TEAL = "#2dd4bf";

export default function AlumniDirectoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useAppSelector((s) => s.auth);
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
  const [view, setView] = useState<"table" | "grid">("grid");
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    dispatch(fetchAlumniAsync());
  }, [dispatch, pageNumber, pageSize, search, filters, sortBy, sortDirection]);

  const columns: GridColDef<Alumni>[] = [
    {
      field: "fullName",
      headerName: "Alumni",
      minWidth: 220,
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <CommonAvatar src={row.profilePhoto} name={row.fullName} size={36} />
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: NAVY,
              minWidth: 0,
            }}
          >
            {row.fullName}
          </Typography>
        </Box>
      ),
    },

    {
      field: "departmentName",
      headerName: "Department",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "batch",
      headerName: "Batch",
      width: 100,
      valueGetter: (_value, row) => row.batch || row.graduationYear || "—",
    },
    {
      field: "designation",
      headerName: "Designation",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) =>
        [row.designation, row.companyName].filter(Boolean).join(" · ") || "—",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ row }) => <CommonStatusBadge status={row.status} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box onClick={(event) => event.stopPropagation()}>
          <IconButton
            size="small"
            aria-label={`View ${row.fullName}`}
            onClick={() => navigate(`/alumni/${row.id}`)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton
            size="small"
            aria-label={`Edit ${row.fullName}`}
            onClick={() => navigate(`/alumni/${row.id}/edit`)}
          >
            <Pencil size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <CommonPageHeader
        title="Alumni List"
        subtitle={`${totalCount} alumni in the community`}
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Directory" },
        ]}
        actions={
          isAdmin ? (
            <CommonButton
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/alumni/create")}
            >
              Add Alumni
            </CommonButton>
          ) : null
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
            onChange={(v) => dispatch(setSearch(v))}
            placeholder="Search alumni by name, company, profession..."
          />
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root.Mui-selected": {
              bgcolor: alpha(TEAL, 0.15),
              color: NAVY,
              "&:hover": { bgcolor: alpha(TEAL, 0.2) },
            },
          }}
        >
          <ToggleButton value="table">
            <List size={16} />
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
        />
      ) : view === "grid" ? (
        <Box>
          <Grid container spacing={2}>
            {items.map((alum) => (
              <Grid key={alum.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AlumniCard
                  alumni={alum}
                  onEdit={() => navigate(`/alumni/${alum.id}/edit`)}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CommonPagination
              count={Math.ceil(totalCount / pageSize)}
              page={pageNumber}
              onChange={(p) => dispatch(setPage(p))}
              pageSize={pageSize}
              onPageSizeChange={(s) => dispatch(setPageSize(s))}
            />
          </Box>
        </Box>
      ) : (
        <Box>
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
            autoHeight
            hideFooter
            rowHeight={64}
            onPaginationModelChange={(model) => {
              if (model.pageSize !== pageSize) {
                dispatch(setPageSize(model.pageSize));
              } else {
                dispatch(setPage(model.page + 1));
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
          />

          <Box sx={{ mt: 3 }}>
            <CommonPagination
              count={Math.ceil(totalCount / pageSize)}
              page={pageNumber}
              onChange={(p) => dispatch(setPage(p))}
              pageSize={pageSize}
              onPageSizeChange={(s) => dispatch(setPageSize(s))}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
