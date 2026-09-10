import { Box, Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { View, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchAlumniAsync,
  setSearch,
  setPage,
  setPageSize,
} from "@/Slice/alumniSlice";
import {
  CommonPageHeader,
  CommonSearchField,
  CommonPagination,
  CommonEmptyState,
  CommonLoading,
  CommonCard,
} from "@/components/common";
import AlumniCard from "@/app/components/AlumniCard";
import AlumniFilters from "@/app/components/AlumniFilters";

export default function AlumniDirectoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, totalCount, pageNumber, pageSize, search } =
    useAppSelector((s) => s.alumni);
  const [view, setView] = useState<"table" | "grid">("grid");

  useEffect(() => {
    dispatch(fetchAlumniAsync());
  }, [dispatch, pageNumber, pageSize]);

  return (
    <Box>
      <CommonPageHeader
        title="Alumni List"
        subtitle={`${totalCount} alumni in the community`}
        breadcrumbs={[
          { label: "Home", path: "/alumni/dashboard" },
          { label: "Directory" },
        ]}
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
        />
      ) : (
        <Grid container spacing={2}>
          {items.map((alum) => (
            <Grid key={alum.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AlumniCard
                alumni={alum}
                onEdit={() => navigate(`/alumni/${alum.id}/edit`)}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <CommonPagination
              count={Math.ceil(totalCount / pageSize)}
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
