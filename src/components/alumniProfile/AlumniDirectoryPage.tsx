import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  alpha,
} from "@mui/material";
import { List, LayoutGrid, Eye, Pencil, BadgeCheck } from "lucide-react";
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
  CommonAvatar,
  CommonStatusBadge,
} from "@/components/common";
import AlumniCard from "@/components/alumniProfile/AlumniCard";
import AlumniFilters from "@/components/alumniProfile/AlumniFilters";

const NAVY = "#132038";
const TEAL = "#2dd4bf";

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
      ) : (
        <Box>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 700,
                      color: "text.secondary",
                      bgcolor: alpha(NAVY, 0.03),
                    },
                  }}
                >
                  <TableCell>Alumni</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((alum) => (
                  <TableRow
                    key={alum.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/alumni/${alum.id}`)}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <CommonAvatar
                          src={alum.profilePhoto}
                          name={alum.fullName}
                          size={36}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {alum.fullName}
                            </Typography>
                            {alum.isVerified && (
                              <BadgeCheck size={14} color={TEAL} />
                            )}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {alum.alumniId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {alum.departmentName || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alum.batch || alum.graduationYear || "—"}
                        size="small"
                        sx={{
                          bgcolor: alpha(TEAL, 0.12),
                          color: "#0f9c8f",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {alum.designation || "—"}
                        {alum.companyName ? ` · ${alum.companyName}` : ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CommonStatusBadge status={alum.status} />
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/alumni/${alum.id}`)}
                      >
                        <Eye size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/alumni/${alum.id}/edit`)}
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2 }}>
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
