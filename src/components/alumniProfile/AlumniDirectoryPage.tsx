import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  alpha,
  Typography,
} from "@mui/material";
import { List, LayoutGrid, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useAlumni } from "@/hooks/useAlumni";
import { setSearch, setPage, setPageSize } from "@/store/Slice/alumniSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonPagination,
  CommonEmptyState,
  CommonLoading,
  CommonAvatar,
  CommonStatusBadge,
  CommonDataGrid,
  CommonErrorState,
  CommonButton,
} from "@/components/common";
import AlumniCard from "@/components/alumniProfile/AlumniCard";
import AlumniFilters from "@/components/alumniProfile/AlumniFilters";
import type { GridColDef } from "@mui/x-data-grid";
import type { AlumniProfileFullModel } from "@/types/alumni";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/utils/apiError";

const NAVY = "#132038";
const TEAL = "#2dd4bf";

export default function AlumniDirectoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { role } = useAuth();
  const {
    alumniData: items,
    loading,
    totalCount,
    fetchAlumniData,
  } = useAlumni();

  const { search, filters, pageNumber, pageSize } = useAppSelector(
    (s) => s.alumni,
  );

  const debouncedSearch = useDebouncedValue(search);
  const [view, setView] = useState<"table" | "grid">("grid");
  const [error, setError] = useState<string | null>(null);

  const canAddAlumni = role === "ADMIN" || role === "MODERATOR";

  const load = useCallback(
    (overrideQuery?: {
      search?: string;
      pageNumber?: number;
      pageSize?: number;
    }) => {
      void fetchAlumniData({
        search: overrideQuery?.search ?? (debouncedSearch || undefined),
        status: filters.status,
        programId: filters.programId,
        graduationYear: filters.graduationYear,
        pageNumber: overrideQuery?.pageNumber ?? pageNumber,
        pageSize: overrideQuery?.pageSize ?? pageSize,
      }).catch((err) =>
        setError(getApiErrorMessage(err, "Unable to load alumni")),
      );
    },
    [debouncedSearch, filters, pageNumber, pageSize, fetchAlumniData],
  );

  /* ============================================================
     Effect 1 — Initial mount
     Fetch only if the store is empty. If the user already visited
     this page in the session, the cached data is reused.
     ============================================================ */
  useEffect(() => {
    if (!items || items.length === 0) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     Effect 2 — Search / filter / pagination changes
     Refetch unconditionally. Skip the very first render because
     Effect 1 already handled the mount case.
     ============================================================ */
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, pageNumber, pageSize]);

  const columns: GridColDef<AlumniProfileFullModel>[] = [
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
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <CommonAvatar
            src={row.personalInformation.profilePhoto ?? undefined}
            name={row.personalInformation.fullName}
            size={36}
          />
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: NAVY,
              minWidth: 0,
            }}
          >
            {row.personalInformation.fullName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "departmentName",
      headerName: "Department",
      minWidth: 150,
      flex: 1,
      valueGetter: (_v, row) =>
        row.academicInformation[0]?.departmentName ?? "",
    },
    {
      field: "batch",
      headerName: "Batch",
      width: 100,
      valueGetter: (_v, row) =>
        row.academicInformation[0]?.batch ??
        row.academicInformation[0]?.graduationYear ??
        "—",
    },
    {
      field: "designation",
      headerName: "Designation",
      minWidth: 180,
      flex: 1,
      valueGetter: (_v, row) =>
        [row.jobExperience[0]?.designation, row.jobExperience[0]?.companyname]
          .filter(Boolean)
          .join(" · ") || "—",
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
            onClick={() => navigate(`/alumni/${row.alumniID}`)}
          >
            <Eye size={16} />
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
          canAddAlumni ? (
            <CommonButton
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate("/alumni/new")}
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

      {error && !items.length ? (
        <CommonErrorState message={error} onRetry={() => load()} />
      ) : loading ? (
        <CommonLoading fullHeight={false} />
      ) : items.length === 0 ? (
        <CommonEmptyState
          title="No alumni found"
          message="No alumni match your search criteria."
          actionLabel={canAddAlumni ? "Add Alumni" : undefined}
          onAction={canAddAlumni ? () => navigate("/alumni/new") : undefined}
        />
      ) : view === "grid" ? (
        <Box>
          <Grid container spacing={2}>
            {items.map((alum) => (
              <Grid key={alum.alumniID} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AlumniCard alumni={alum} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CommonPagination
              count={Math.max(1, Math.ceil(totalCount / pageSize))}
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
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            autoHeight
            hideFooter
            rowHeight={64}
            onPaginationModelChange={(m) => {
              if (m.pageSize !== pageSize) dispatch(setPageSize(m.pageSize));
              else dispatch(setPage(m.page + 1));
            }}
            getRowId={(row) => row.alumniID}
          />
          <Box sx={{ mt: 3 }}>
            <CommonPagination
              count={Math.max(1, Math.ceil(totalCount / pageSize))}
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
