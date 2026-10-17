import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  View,
  LayoutGrid,
  Plus,
  Download,
  Eye,
  Pencil,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAlumni } from "@/hooks/useAlumni";
import {
  setSearch,
  setPage,
  setPageSize,
  setSort,
} from "@/store/Slice/alumniSlice";
import { showToast } from "@/store/Slice/uiSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonDataGrid,
  CommonPagination,
  CommonEmptyState,
  CommonErrorState,
  CommonLoading,
  CommonStatusBadge,
  CommonButton,
  CommonAvatar,
} from "@/components/common";
import AlumniCard from "@/components/alumniProfile/AlumniCard";
import AlumniFilters from "@/components/alumniProfile/AlumniFilters";
import type { GridColDef } from "@mui/x-data-grid";
import type { AlumniProfileFullModel } from "@/types/alumni";
import { exportAlumniToCSV } from "@/utils/csvExport";
import { getApiErrorMessage } from "@/utils/apiError";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function AlumniListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    alumniData: items,
    loading,
    totalCount,
    fetchAlumniData,
    setAlumniActive,
  } = useAlumni();

  const { search, filters, pageNumber, pageSize, sortBy, sortDirection } =
    useAppSelector((s) => s.alumni);

  const debouncedSearch = useDebouncedValue(search);
  const [view, setView] = useState<"table" | "grid">("table");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    void fetchAlumniData({
      search: debouncedSearch || undefined,
      status: filters.status,
      programId: filters.programId,
      graduationYear: filters.graduationYear,
      pageNumber,
      pageSize,
    }).catch((err) =>
      setError(getApiErrorMessage(err, "Unable to load alumni")),
    );
  }, [debouncedSearch, filters, pageNumber, pageSize, fetchAlumniData]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, pageNumber, pageSize]);

  const handleToggleActive = async (row: AlumniProfileFullModel) => {
    try {
      const nextActive = row.status !== "ACTIVE";
      await setAlumniActive(row.alumniID, nextActive, {
        search: debouncedSearch || undefined,
        status: filters.status,
        programId: filters.programId,
        graduationYear: filters.graduationYear,
        pageNumber,
        pageSize,
      });
      dispatch(
        showToast({
          message: nextActive ? "Alumni activated" : "Alumni deactivated",
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Unable to update status"),
          severity: "error",
        }),
      );
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const exported: AlumniProfileFullModel[] = [];
      let page = 1;
      let total = Number.POSITIVE_INFINITY;

      while (exported.length < total) {
        const res = await fetchAlumniData({
          search: debouncedSearch || undefined,
          status: filters.status,
          programId: filters.programId,
          graduationYear: filters.graduationYear,
          pageNumber: page,
          pageSize: 100,
        });
        total = res.totalRecords;
        if (!res.items.length) break;
        exported.push(...res.items);
        page += 1;
      }

      exportAlumniToCSV(exported);
      dispatch(
        showToast({
          message: `${exported.length} alumni exported successfully`,
          severity: "success",
        }),
      );
    } catch (err) {
      dispatch(
        showToast({
          message: getApiErrorMessage(err, "Failed to export alumni"),
          severity: "error",
        }),
      );
    } finally {
      setExporting(false);
    }
  };

  const columns: GridColDef<AlumniProfileFullModel>[] = [
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
            items.findIndex((item) => item.alumniID === params.row.alumniID) +
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
            src={params.row.personalInformation.profilePhoto ?? undefined}
            name={params.row.personalInformation.fullName}
            size={40}
            sx={{ flexShrink: 0, fontSize: "0.8rem", fontWeight: 700 }}
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
              {params.row.personalInformation.fullName}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      valueGetter: (_v, row) => row.contactInformation.email ?? "",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 140,
      valueGetter: (_v, row) => row.contactInformation.phone ?? "",
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 160,
      valueGetter: (_v, row) =>
        row.academicInformation[0]?.departmentName ?? "",
    },
    {
      field: "batch",
      headerName: "Batch",
      width: 80,
      valueGetter: (_v, row) => row.academicInformation[0]?.batch ?? "",
    },
    {
      field: "graduationYear",
      headerName: "Grad Year",
      width: 100,
      valueGetter: (_v, row) =>
        row.academicInformation[0]?.graduationYear ?? "",
    },
    {
      field: "companyName",
      headerName: "Company",
      width: 160,
      valueGetter: (_v, row) => row.jobExperience[0]?.companyname ?? "",
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 160,
      valueGetter: (_v, row) => row.jobExperience[0]?.designation ?? "",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => <CommonStatusBadge status={params.row.status} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box onClick={(event) => event.stopPropagation()} sx={{ gap: 1 }}>
          <Tooltip title="View alumni">
            <IconButton
              size="small"
              onClick={() => navigate(`/alumni/profile-details/${row.alumniID}`)}
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
              size="small"
              onClick={() => navigate(`/alumni/profile-details/${row.alumniID}/edit`)}
              sx={{
                color: "text.secondary",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.status === "ACTIVE" ? "Deactivate" : "Activate"}>
            <IconButton
              size="small"
              onClick={() => void handleToggleActive(row)}
              sx={{
                color:
                  row.status === "ACTIVE" ? "warning.main" : "success.main",
              }}
            >
              <BadgeCheck size={16} />
            </IconButton>
          </Tooltip>
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
              onClick={() => navigate("/alumni/new")}
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
            onChange={(v) => dispatch(setSearch(v))}
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

      {error && !items.length ? (
        <CommonErrorState message={error} onRetry={load} />
      ) : loading ? (
        <CommonLoading fullHeight={false} />
      ) : items.length === 0 ? (
        <CommonEmptyState
          title="No alumni found"
          message="No alumni match your search criteria."
          actionLabel="Add Alumni"
          onAction={() => navigate("/alumni/new")}
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
                dispatch(setPageSize(m.pageSize));
              } else {
                dispatch(setPage(m.page + 1));
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
            getRowId={(row) => row.alumniID}
            rowHeight={64}
            height={Math.max(260, items.length * 64 + 120)}
          />
          <CommonPagination
            count={Math.max(1, Math.ceil(totalCount / pageSize))}
            page={pageNumber}
            onChange={(p) => dispatch(setPage(p))}
            pageSize={pageSize}
            onPageSizeChange={(s) => dispatch(setPageSize(s))}
          />
        </>
      ) : (
        <Grid container spacing={2}>
          {items.map((alum) => (
            <Grid key={alum.alumniID} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AlumniCard
                alumni={alum}
                onEdit={() => navigate(`/alumni/profile-details/${alum.alumniID}/edit`)}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <CommonPagination
              count={Math.max(1, Math.ceil(totalCount / pageSize))}
              page={pageNumber}
              onChange={(p) => dispatch(setPage(p))}
              pageSize={pageSize}
              onPageSizeChange={(s) => dispatch(setPageSize(s))}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
